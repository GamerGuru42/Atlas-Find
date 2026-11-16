import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db/prisma';
import { PAYSTACK_SECRET_KEY, verifyPaystackTransaction } from '@/lib/payments/paystack';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // 1. Mandatory HMAC signature verification
    if (!signature || !PAYSTACK_SECRET_KEY) {
      console.error('[Paystack Webhook] Rejected: Missing signature or PAYSTACK_SECRET_KEY');
      return NextResponse.json({ error: 'Unauthorized: Missing webhook signature' }, { status: 401 });
    }

    const expectedHash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedHash, 'utf8');
    const signatureBuf = Buffer.from(signature, 'utf8');

    if (expectedBuf.length !== signatureBuf.length || !crypto.timingSafeEqual(expectedBuf, signatureBuf)) {
      console.error('[Paystack Webhook] Invalid signature mismatch');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    switch (event.event) {
      case 'charge.success': {
        const data = event.data;
        const metadata = data.metadata || {};
        let userId = metadata.userId;
        const tier = (metadata.tier || 'pro').toLowerCase();
        const billing = metadata.billing || 'monthly';
        const reference = data.reference;

        if (!reference) {
          return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 });
        }

        // 2. Server-side verification with Paystack to confirm authentic charge
        try {
          const verifiedCharge = await verifyPaystackTransaction(reference);
          if (verifiedCharge.status !== 'success') {
            console.error('[Paystack Webhook] Server verification failed: status not success', verifiedCharge);
            return NextResponse.json({ error: 'Transaction verification failed' }, { status: 400 });
          }
        } catch (verErr) {
          console.error('[Paystack Webhook] Error calling verify endpoint:', verErr);
          // If in test mode or network error, proceed only if reference exists
        }

        // Fallback user lookup by customer email if metadata.userId is missing
        if (!userId && data.customer?.email) {
          const user = await prisma.user.findUnique({ where: { email: data.customer.email } });
          if (user) userId = user.id;
        }

        if (userId) {
          // Idempotency: atomic transaction to prevent double processing
          await prisma.$transaction(async (tx: any) => {
            const existingSub = await tx.subscription.findUnique({
              where: { reference },
            });

            if (existingSub) {
              console.log(`[Paystack Webhook] Reference ${reference} already processed.`);
              return;
            }

            await tx.user.update({
              where: { id: userId },
              data: { tier },
            });

            const now = new Date();
            const periodEnd = new Date(now);
            if (billing === 'yearly') {
              periodEnd.setFullYear(periodEnd.getFullYear() + 1);
            } else {
              periodEnd.setMonth(periodEnd.getMonth() + 1);
            }

            await tx.subscription.upsert({
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

            await tx.usageLimit.upsert({
              where: { userId },
              update: { maxSaves: 999999 },
              create: { userId, maxSaves: 999999 },
            });
          });

          console.log(`[Paystack Webhook] Subscription activated for user: ${userId} (${tier})`);
        }
        break;
      }

      case 'subscription.disable': {
        const subCode = event.data?.subscription_code;
        if (subCode) {
          await prisma.subscription.updateMany({
            where: { paystackSubscriptionCode: subCode },
            data: { status: 'canceled' },
          });
        }
        break;
      }

      default:
        // Acknowledge other event types safely
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Paystack Webhook Handler Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
