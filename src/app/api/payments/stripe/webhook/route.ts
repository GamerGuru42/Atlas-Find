import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    if (signature && endpointSecret && !endpointSecret.includes('placeholder')) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      event = JSON.parse(rawBody);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const tier = metadata.tier || 'pro';
        const billing = metadata.billing || 'monthly';

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              tier,
              stripeCustomerId: session.customer as string,
            },
          }).catch(err => console.error(err));

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
              processor: 'stripe',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              reference: session.id,
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
              reference: session.id,
              localAmount: (session.amount_total || 0) / 100,
              currency: (session.currency || 'usd').toUpperCase(),
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          });

          await prisma.usageLimit.upsert({
            where: { userId },
            update: { maxSaves: 999999 },
            create: { userId, maxSaves: 999999 },
          });

          console.log(`[STIPE WEBHOOK] Activated ${tier} subscription for user ${userId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subId = invoice.subscription;
        if (subId) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subId },
          });
          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: 'past_due' },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subObject = event.data.object as any;
        const subId = subObject.id;
        if (subId) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subId },
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
        console.log(`Unhandled Stripe Event: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Stripe Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
