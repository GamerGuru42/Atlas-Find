import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyPaystackTransaction } from '@/lib/payments/paystack';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const atlasRef = searchParams.get('atlas_ref') || searchParams.get('atlasReference');
    
    // Paystack appends trxref and reference to callback URL
    const urlParams = new URL(req.url).searchParams;
    const allRefs = urlParams.getAll('reference');
    
    // paystackRef is either trxref, second reference param, or first reference param if atlas_ref is separate
    let paystackRef = searchParams.get('trxref') || 
                      searchParams.get('paystackReference') || 
                      (allRefs.length > 1 ? allRefs[1] : allRefs[0]);

    // Fallback: if only reference parameter is passed and it starts with atlas_, that's atlasRef
    let primaryAtlasRef = atlasRef;
    if (!primaryAtlasRef && allRefs[0]?.startsWith('atlas_')) {
      primaryAtlasRef = allRefs[0];
      if (allRefs.length > 1) {
        paystackRef = allRefs[1];
      }
    }

    console.log('🔍 Paystack Verification Request Debug:', {
      atlasReference: primaryAtlasRef,
      paystackReference: paystackRef,
      allReferenceParams: allRefs,
      fullUrl: req.url,
    });

    if (!paystackRef && !primaryAtlasRef) {
      return NextResponse.json({ success: false, message: 'Transaction reference is required' }, { status: 400 });
    }

    // Step A: Attempt Paystack verification with paystackRef first
    let paystackData: any = null;
    let successfulRefUsed: string = '';

    if (paystackRef) {
      console.log(`📡 Calling Paystack Verify URL: https://api.paystack.co/transaction/verify/${encodeURIComponent(paystackRef)}`);
      try {
        paystackData = await verifyPaystackTransaction(paystackRef);
        successfulRefUsed = paystackRef;
        console.log('✅ Paystack Response (Primary Ref):', paystackData);
      } catch (err: any) {
        console.warn(`⚠️ Paystack verify failed for paystackRef [${paystackRef}]:`, err.message);
      }
    }

    // Step B: Fallback to primaryAtlasRef if primary attempt failed or paystackRef was missing
    if ((!paystackData || paystackData.status !== 'success') && primaryAtlasRef && primaryAtlasRef !== paystackRef) {
      console.log(`📡 Fallback Verify URL: https://api.paystack.co/transaction/verify/${encodeURIComponent(primaryAtlasRef)}`);
      try {
        paystackData = await verifyPaystackTransaction(primaryAtlasRef);
        successfulRefUsed = primaryAtlasRef;
        console.log('✅ Paystack Response (Fallback Ref):', paystackData);
      } catch (err: any) {
        console.warn(`⚠️ Paystack verify failed for fallback atlasRef [${primaryAtlasRef}]:`, err.message);
      }
    }

    if (!paystackData || paystackData.status !== 'success') {
      return NextResponse.json({ 
        success: false, 
        message: `Paystack status: ${paystackData?.status || 'unverified'} (${paystackData?.gateway_response || 'Transaction reference not found'})` 
      }, { status: 400 });
    }

    console.log(`🎉 Paystack Verification Succeeded using reference [${successfulRefUsed}]!`);

    const metadata = paystackData.metadata || {};
    let userId = metadata.userId;
    
    // Parse tier from metadata or fallback to ref string (e.g. atlas_pro_... -> pro, atlas_elite_... -> elite)
    let tier = (metadata.tier || '').toLowerCase();
    if (!tier) {
      if (primaryAtlasRef?.includes('_elite_')) tier = 'elite';
      else tier = 'pro';
    }

    const billing = metadata.billing || 'monthly';
    const finalReference = primaryAtlasRef || successfulRefUsed;

    // Lookup user by customer email if metadata.userId is missing
    if (!userId && paystackData.customer?.email) {
      const foundUser = await prisma.user.findUnique({
        where: { email: paystackData.customer.email },
      });
      if (foundUser) {
        userId = foundUser.id;
      }
    }

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
          reference: finalReference,
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
          reference: finalReference,
          localAmount: paystackData.amount / 100,
          currency: paystackData.currency,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      // 3. Create or update UsageLimits record
      const maxSaves = 999999;
      await prisma.usageLimit.upsert({
        where: { userId },
        update: { maxSaves },
        create: { userId, maxSaves },
      });

      // 4. Set HTTP-only cookie for fast UI rendering
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
      message: `Payment verified and subscription activated successfully! Welcome to Atlas ${tier.toUpperCase()}.`,
    });
  } catch (error: any) {
    console.error('Paystack Verify Endpoint Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
