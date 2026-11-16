import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    // 1. Mandatory signature and secret verification
    if (!signature || !endpointSecret) {
      console.error('[Stripe Webhook] Rejected: Missing signature or STRIPE_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Unauthorized: Missing webhook signature or secret' }, { status: 401 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err: any) {
      console.error('[Stripe Webhook] Signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Signature Error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const tier = metadata.tier || 'pro';
        const billing = metadata.billing || 'monthly';
        const sessionId = session.id;

        if (userId) {
          await prisma.$transaction(async (tx: any) => {
            const existingSub = await tx.subscription.findUnique({
              where: { reference: sessionId },
            });

            if (existingSub) {
              console.log(`[Stripe Webhook] Session ${sessionId} already processed.`);
              return;
            }

            await tx.user.update({
              where: { id: userId },
              data: {
                tier,
                stripeCustomerId: session.customer as string,
              },
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
                processor: 'stripe',
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                reference: sessionId,
                localAmount: (session.amount_total || 0) / 100,
                currency: (session.currency || 'usd').toUpperCase(),
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
              },
              create: {
                userId,
                tier,
                status: 'active',
                processor: 'stripe',
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                reference: sessionId,
                localAmount: (session.amount_total || 0) / 100,
                currency: (session.currency || 'usd').toUpperCase(),
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

          console.log(`[Stripe Webhook] Successfully activated ${tier} for user ${userId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subId = invoice.subscription;
        if (subId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: 'past_due' },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        if (sub.id) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: sub.id },
            data: { status: 'canceled' },
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook Handler Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
