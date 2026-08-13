import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import prisma from '@/lib/db/prisma';
import { getPricing, normalizeCountryCode } from '@/lib/pricing/currencies';
import { PricingTable } from '@/components/pricing/PricingTable';
import { FeatureComparison } from '@/components/pricing/FeatureComparison';
import styles from '@/components/pricing/Pricing.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  let countryCode = 'US';
  let isLoggedIn = false;

  try {
    const cookieStore = await cookies();
    
    // 1. Check saved country cookie first
    const cookieCountry = cookieStore.get('atlas_country_code')?.value;
    if (cookieCountry) {
      countryCode = normalizeCountryCode(cookieCountry);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {}
        },
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        isLoggedIn = true;

        // 2. Check metadata on session user
        const metaCountry = session.user.user_metadata?.country_code || session.user.user_metadata?.country;
        if (metaCountry) {
          countryCode = normalizeCountryCode(metaCountry);
        }

        // 3. Check database user record
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { countryCode: true }
        });
        if (user?.countryCode) {
          countryCode = normalizeCountryCode(user.countryCode);
        }
      }
    }
  } catch (e) {
    console.error('PricingPage session lookup error:', e);
  }

  // 4. Geolocation header fallback if not logged in or cookie missing
  if (countryCode === 'US') {
    try {
      const headersList = await headers();
      const ipCountry = headersList.get('x-vercel-ip-country') || 
                        headersList.get('cf-ipcountry') || 
                        headersList.get('x-country-code');
      if (ipCountry) {
        countryCode = normalizeCountryCode(ipCountry);
      }
    } catch (e) {
      console.error('PricingPage country header error:', e);
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
        countryCode={countryCode}
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
