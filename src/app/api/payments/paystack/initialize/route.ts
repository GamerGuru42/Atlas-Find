import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { initializePaystackTransaction } from '@/lib/payments/paystack';

const prisma = new PrismaClient();

// Local currency pricing table (Paystack African Currencies)
const PRICING_TABLE: Record<string, Record<string, Record<string, number>>> = {
  NGN: {
    PRO: { monthly: 7500, yearly: 55000 },
    ELITE: { monthly: 22500, yearly: 165000 },
  },
  GHS: {
    PRO: { monthly: 65, yearly: 500 },
    ELITE: { monthly: 195, yearly: 1500 },
  },
  KES: {
    PRO: { monthly: 750, yearly: 5500 },
    ELITE: { monthly: 2250, yearly: 16500 },
  },
  ZAR: {
    PRO: { monthly: 95, yearly: 750 },
    ELITE: { monthly: 285, yearly: 2250 },
  },
  USD: {
    PRO: { monthly: 10, yearly: 80 },
    ELITE: { monthly: 30, yearly: 240 },
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
