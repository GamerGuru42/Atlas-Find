import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { initializePaystackTransaction } from '@/lib/payments/paystack';

const prisma = new PrismaClient();

// Streamlined 2-Zone Pricing Table for Paystack (African & Emerging Currencies)
const PRICING_TABLE: Record<string, Record<string, Record<string, number>>> = {
  NGN: {
    PRO: { monthly: 5000, yearly: 40000 },
    ELITE: { monthly: 15000, yearly: 120000 },
  },
  GHS: {
    PRO: { monthly: 45, yearly: 360 },
    ELITE: { monthly: 135, yearly: 1080 },
  },
  KES: {
    PRO: { monthly: 500, yearly: 4000 },
    ELITE: { monthly: 1500, yearly: 12000 },
  },
  ZAR: {
    PRO: { monthly: 95, yearly: 750 },
    ELITE: { monthly: 285, yearly: 2250 },
  },
  USD: {
    PRO: { monthly: 9.99, yearly: 79.99 },
    ELITE: { monthly: 29.99, yearly: 239.99 },
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
    const currency = (user?.currency || 'NGN').toUpperCase();
    const formattedTier = tier.toUpperCase();
    const formattedBilling = billing.toLowerCase();

    // Get pricing amount
    const currencyPricing = PRICING_TABLE[currency] || PRICING_TABLE.NGN;
    const tierPricing = currencyPricing[formattedTier] || currencyPricing.PRO;
    const amountInMainCurrency = tierPricing[formattedBilling] || tierPricing.monthly;

    // Paystack takes amount in kobo/cents (* 100)
    const amountInKobo = amountInMainCurrency * 100;

    const reference = `atlas_${formattedTier.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const baseUrl = process.env.APP_URL || 'https://atlas-find.vercel.app';
    const callback_url = `${baseUrl}/payments/success?reference=${reference}`;

    const paystackRes = await initializePaystackTransaction({
      email,
      amount: amountInKobo,
      currency,
      callback_url,
      metadata: {
        userId: user?.id || userId,
        tier: formattedTier.toLowerCase(),
        billing: formattedBilling,
        reference,
      },
    });

    return NextResponse.json({
      success: true,
      authorization_url: paystackRes.authorization_url,
      reference,
    });
  } catch (error: any) {
    console.error('Paystack Initialize Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize Paystack transaction' },
      { status: 500 }
    );
  }
}
