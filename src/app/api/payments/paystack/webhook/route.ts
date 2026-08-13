import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_paystack';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify HMAC signature
    if (signature) {
      const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(rawBody).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    switch (event.event) {
      case 'charge.success': {
        const data = event.data;
        const metadata = data.metadata || {};
        const userId = metadata.userId;
        const tier = metadata.tier || 'pro';
        const reference = data.reference;

        if (userId) {
          // Check idempotency: check if subscription reference already exists
          const existingSub = await prisma.subscription.findUnique({
            where: { reference },
          });

          if (!existingSub) {
            await prisma.user.update({
              where: { id: userId },
              data: { tier },
            }).catch(err => console.error(err));

            const now = new Date();
            const periodEnd = new Date(now);
            periodEnd.setMonth(periodEnd.getMonth() + 1);

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
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Paystack Event: ${event.event}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Paystack Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
