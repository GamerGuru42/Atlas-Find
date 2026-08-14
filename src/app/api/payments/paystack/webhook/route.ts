import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db/prisma';
import { PAYSTACK_SECRET_KEY } from '@/lib/payments/paystack';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // 1. Verify HMAC signature if present
    if (signature) {
      const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
      if (hash !== signature) {
        console.error('Invalid Paystack webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`🔔 Paystack Webhook Received: [${event.event}]`, {
      reference: event.data?.reference,
      email: event.data?.customer?.email,
    });

    switch (event.event) {
      case 'charge.success': {
        const data = event.data;
        const metadata = data.metadata || {};
        let userId = metadata.userId;
        const tier = (metadata.tier || 'pro').toLowerCase();
        const billing = metadata.billing || 'monthly';
        const reference = data.reference;

        // Fallback user lookup by email if metadata.userId is missing
        if (!userId && data.customer?.email) {
          const user = await prisma.user.findUnique({ where: { email: data.customer.email } });
          if (user) userId = user.id;
        }

        if (userId) {
          // Idempotency check: check if subscription reference was already processed
          const existingSub = await prisma.subscription.findUnique({
            where: { reference },
          });

          if (!existingSub) {
            await prisma.user.update({
              where: { id: userId },
              data: { tier },
            }).catch(err => console.error('Webhook user update error:', err));

            const now = new Date();
            const periodEnd = new Date(now);
            if (billing === 'yearly') {
              periodEnd.setFullYear(periodEnd.getFullYear() + 1);
            } else {
              periodEnd.setMonth(periodEnd.getMonth() + 1);
            }

            await prisma.subscription.upsert({
              where: { userId },
              update: {
                tier,
                status: 'active',
                processor: 'paystack',
                reference,
                localAmount: data.amount / 100,
                currency: data.currency,
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
              },
              create: {
                userId,
                tier,
                status: 'active',
                processor: 'paystack',
                reference,
                localAmount: data.amount / 100,
                currency: data.currency,
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
              },
            });

            await prisma.usageLimit.upsert({
              where: { userId },
              update: { maxSaves: 999999 },
              create: { userId, maxSaves: 999999 },
            });

            console.log(`✅ Subscription activated via Paystack webhook for user: ${userId} (${tier})`);
          } else {
            console.log(`ℹ️ Paystack reference ${reference} already processed, skipping duplicate activation.`);
          }
        }
        break;
      }

      case 'subscription.disable': {
        const data = event.data;
        const subCode = data.subscription_code;

        if (subCode) {
          const sub = await prisma.subscription.findFirst({
            where: { paystackSubscriptionCode: subCode },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: 'canceled' },
            });
            await prisma.user.update({
              where: { id: sub.userId },
              data: { tier: 'free' },
            });
            await prisma.usageLimit.update({
              where: { userId: sub.userId },
              data: { maxSaves: 20 },
            });

            console.log(`🔒 Subscription disabled via Paystack webhook for user: ${sub.userId}`);
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Received unhandled Paystack event: ${event.event}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('Paystack Webhook Processing Error:', error);
    // Return 200 so Paystack doesn't keep retrying broken payloads indefinitely
    return NextResponse.json({ status: 'error', message: error.message }, { status: 200 });
  }
}
