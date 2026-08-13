import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createStripeCheckoutSession, createStripeCustomer } from '@/lib/payments/stripe';

const prisma = new PrismaClient();

// Stripe Price IDs (Placeholders - replace with real price_xxx IDs from Stripe Dashboard)
const STRIPE_PRICE_MAP: Record<string, Record<string, string>> = {
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly_placeholder',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly_placeholder',
  },
  ELITE: {
    monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY || 'price_elite_monthly_placeholder',
    yearly: process.env.STRIPE_PRICE_ELITE_YEARLY || 'price_elite_yearly_placeholder',
  },
};

export async function POST(req: Request) {
  try {
    const { userId, tier = 'PRO', billing = 'monthly' } = await req.json();

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    const email = user?.email || 'customer@atlasfind.com';
    const formattedTier = tier.toUpperCase();
    const formattedBilling = billing.toLowerCase();

    // Look up Stripe Price ID
    const tierMap = STRIPE_PRICE_MAP[formattedTier] || STRIPE_PRICE_MAP.PRO;
    const priceId = tierMap[formattedBilling] || tierMap.monthly;

    // Get or create Stripe Customer
    let stripeCustomerId = user?.stripeCustomerId || undefined;
    if (user && !stripeCustomerId && !stripeCustomerId?.startsWith('cus_placeholder')) {
      try {
        const customer = await createStripeCustomer(email, user.email || 'AtlasUser');
        stripeCustomerId = customer.id;
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });
      } catch (e) {
        console.error('Error creating Stripe customer:', e);
      }
    }

    const baseUrl = process.env.APP_URL || 'https://atlas-find.vercel.app';
    const successUrl = `${baseUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/payments/cancel`;

    const session = await createStripeCheckoutSession({
      customerEmail: email,
      priceId,
      stripeCustomerId,
      metadata: {
        userId: user?.id || userId,
        tier: formattedTier.toLowerCase(),
        billing: formattedBilling,
      },
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize Stripe checkout' },
      { status: 500 }
    );
  }
}
