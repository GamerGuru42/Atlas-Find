import React from 'react';
import prisma from '@/lib/db/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getPricing } from '@/lib/pricing/currencies';
import { CurrentPlanCard, UpgradeCards } from '@/components/subscription/SubscriptionCard';
import { UsageStats, UsageStatsData } from '@/components/subscription/UsageStats';
import { redirect } from 'next/navigation';
import styles from '@/components/subscription/Subscription.module.css';

export default async function SubscriptionPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch user data
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { usageLimit: true }
  });

  if (!user) {
    // Should exist if onboarding is complete, but fallback just in case
    redirect('/onboarding');
  }

  const countryCode = user.countryCode || 'US';
  const tier = user.tier || 'free';

  // Get localized pricing
  const userPricing = {
    PRO: getPricing('PRO', countryCode),
    ELITE: getPricing('ELITE', countryCode)
  };

  // Mock usage stats if missing (typically created on upgrade/signup via webhooks)
  const defaultUsage = {
    savedOpportunitiesCount: 0,
    documentsUploadedCount: 0,
    essaysDraftedThisMonth: 0,
    mentorCallsThisMonth: 0,
    essayReviewsThisMonth: 0,
  };

  const limits = user.usageLimit || defaultUsage;

  const getLimit = (tier: string, feature: string) => {
    switch(tier) {
      case 'elite':
        return {
          saves: -1, docs: -1, essays: -1, calls: 1, reviews: 2
        }[feature];
      case 'pro':
        return {
          saves: -1, docs: 5, essays: 0, calls: 0, reviews: 0
        }[feature];
      default:
        return {
          saves: 20, docs: 0, essays: 0, calls: 0, reviews: 0
        }[feature];
    }
  };

  const usageStatsData: UsageStatsData = {
    savedOpportunities: { current: limits.savedOpportunitiesCount, max: getLimit(tier, 'saves') as number },
    documentsUploaded: { current: limits.documentsUploadedCount, max: getLimit(tier, 'docs') as number },
    essaysDrafted: { current: limits.essaysDraftedThisMonth, max: getLimit(tier, 'essays') as number },
    mentorCalls: { current: limits.mentorCallsThisMonth, max: getLimit(tier, 'calls') as number },
    essayReviews: { current: limits.essayReviewsThisMonth, max: getLimit(tier, 'reviews') as number },
  };

  return (
    <div className={styles.container}>
      <CurrentPlanCard 
        tier={tier} 
        renewsOn="Oct 14, 2026" // Placeholder date
        nextPayment={tier === 'pro' ? userPricing.PRO.monthly : userPricing.ELITE.monthly} 
        symbol={userPricing.PRO.symbol}
      />
      
      <UsageStats stats={usageStatsData} tier={tier} />
      
      <div style={{ marginTop: '24px' }}>
        <UpgradeCards userPricing={userPricing} currentTier={tier} />
      </div>
    </div>
  );
}
