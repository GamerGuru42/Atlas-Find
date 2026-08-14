import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { initializePaystackTransaction } from '@/lib/payments/paystack';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Paystack Pricing Table (African & Emerging Currencies)
const PRICING_TABLE: Record<string, Record<string, Record<string, number>>> = {
  NGN: {
    PRO: { monthly: 5000, yearly: 40000 },
    ELITE: { monthly: 15000, yearly: 120000 },
  },
  GHS: {
    PRO: { monthly: 50, yearly: 400 },
    ELITE: { monthly: 150, yearly: 1200 },
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
    const body = await req.json().catch(() => ({}));
    let { userId, tier = 'PRO', billing = 'monthly' } = body;
    let sessionUserEmail: string | undefined = undefined;

    // Retrieve active Supabase user session if userId is not explicitly passed
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() {}
          }
        }
      );
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        if (!userId) userId = session.user.id;
        sessionUserEmail = session.user.email;
      }
    } catch (e) {
      console.error('Session lookup in Paystack init:', e);
    }

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } }).catch(err => {
        console.error('Prisma user lookup error (bypassing DB crash):', err);
        return null;
      });
    }

    const email = user?.email || sessionUserEmail || 'customer@atlasfind.com';
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
    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://atlas-find.vercel.app';
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
      { error: 'Payment service temporarily unavailable. Please try again in a few seconds.' },
      { status: 500 }
    );
  }
}
