import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyPaystackTransaction } from '@/lib/payments/paystack';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Reference code is required' }, { status: 400 });
    }

    // Verify transaction with Paystack API
    const paystackData = await verifyPaystackTransaction(reference);

    if (paystackData.status !== 'success') {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
    }

    const metadata = paystackData.metadata || {};
    const userId = metadata.userId;
    const tier = (metadata.tier || 'pro').toLowerCase();
    const billing = metadata.billing || 'monthly';

    if (userId) {
      // 1. Update User tier in Prisma DB (Source of Truth)
      await prisma.user.update({
        where: { id: userId },
        data: { tier },
      }).catch(err => console.error('User update error:', err));

      // 2. Create or update Subscription record
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
          localAmount: paystackData.amount / 100,
          currency: paystackData.currency,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        create: {
          userId,
          tier,
          status: 'active',
          processor: 'paystack',
          reference,
          localAmount: paystackData.amount / 100,
          currency: paystackData.currency,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      // 3. Create or update UsageLimits record
      const maxSaves = tier === 'elite' ? 999999 : tier === 'pro' ? 999999 : 20;
      await prisma.usageLimit.upsert({
        where: { userId },
        update: { maxSaves },
        create: { userId, maxSaves },
      });

      // 4. Set cookie for fast UI rendering
      try {
        const cookieStore = await cookies();
        cookieStore.set('atlas_user_tier', tier, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax'
        });
      } catch (e) {
        console.error('Cookie set error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      tier,
      message: 'Payment verified and subscription activated successfully!',
    });
  } catch (error: any) {
    console.error('Paystack Verify Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
