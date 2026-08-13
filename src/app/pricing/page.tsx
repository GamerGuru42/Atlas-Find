import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import prisma from '@/lib/db/prisma';
import { getPricing } from '@/lib/pricing/currencies';
import { PricingTable } from '@/components/pricing/PricingTable';
import { FeatureComparison } from '@/components/pricing/FeatureComparison';
import styles from '@/components/pricing/Pricing.module.css';
import Link from 'next/link';

export default async function PricingPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  let countryCode = 'US';
  let isLoggedIn = !!session;
  
  if (isLoggedIn) {
    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { countryCode: true }
    });
    if (user?.countryCode) {
      countryCode = user.countryCode;
    }
  } else {
    // Attempt to get country from Vercel headers if not logged in
    const headersList = await headers();
    const vercelCountry = headersList.get('x-vercel-ip-country');
    if (vercelCountry) {
      countryCode = vercelCountry;
    }
  }

  const userPricing = {
    PRO: getPricing('PRO', countryCode),
    ELITE: getPricing('ELITE', countryCode)
  };

  const countryNotFound = userPricing.PRO.currency === 'USD' && countryCode !== 'US';

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>AtlasFind is free to use. Upgrade to unlock tools that help you win.</h1>
        <p className={styles.subtitle}>
          Our AI advisor is unlimited. Pay only for the tools that turn advice into action.
        </p>
      </div>

      <PricingTable 
        userPricing={userPricing} 
        isLoggedIn={isLoggedIn} 
        countryNotFound={countryNotFound} 
      />

      <FeatureComparison />

      <div className={styles.faqSection}>
        <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <div className={styles.faqQuestion}>Is the AI chat really unlimited?</div>
            <div className={styles.faqAnswer}>Yes. Ask Atlas anything, anytime. We don't limit conversations.</div>
          </div>
          <div className={styles.faqItem}>
            <div className={styles.faqQuestion}>Can I cancel anytime?</div>
            <div className={styles.faqAnswer}>Yes. No contracts. Cancel in your settings and keep access until your period ends.</div>
          </div>
          <div className={styles.faqItem}>
            <div className={styles.faqQuestion}>What currency am I charged in?</div>
            <div className={styles.faqAnswer}>Your local currency based on your country. No hidden conversion fees.</div>
          </div>
          <div className={styles.faqItem}>
            <div className={styles.faqQuestion}>Can I earn Pro for free?</div>
            <div className={styles.faqAnswer}>Yes! Our Community Program lets you earn credits by helping other students. Coming soon.</div>
          </div>
          <div className={styles.faqItem}>
            <div className={styles.faqQuestion}>What if I can't afford it?</div>
            <div className={styles.faqAnswer}>AtlasFind works great for free. The AI chat, search, and advice are unlimited. Only upgrade if the tools help you.</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>
          <Link href="/chat" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            Still have questions? Ask Atlas.
          </Link>
        </p>
        <p>
          <Link href="/discover" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            Not ready to upgrade? No problem. AtlasFind is free forever.
          </Link>
        </p>
      </div>
    </div>
  );
}
