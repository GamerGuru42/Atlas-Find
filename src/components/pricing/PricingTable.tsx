"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Pricing.module.css';
import { PartnerInquiryModal } from './PartnerInquiryModal';
import { getPricing, normalizeCountryCode } from '@/lib/pricing/currencies';

interface PricingTableProps {
  userPricing: {
    PRO: any;
    ELITE: any;
  };
  isLoggedIn: boolean;
  countryNotFound: boolean;
  countryCode?: string;
}

const AFRICAN_COUNTRIES = ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'RW', 'SN', 'CI', 'CM', 'EG', 'MA'];

export function PricingTable({ userPricing: initialUserPricing, isLoggedIn, countryNotFound: initialCountryNotFound, countryCode: initialCountryCode = 'US' }: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrgType, setSelectedOrgType] = useState('University');
  const [loadingTier, setLoadingTier] = useState<'PRO' | 'ELITE' | null>(null);

  const [effectiveCountryCode, setEffectiveCountryCode] = useState(initialCountryCode);
  const [effectivePricing, setEffectivePricing] = useState(initialUserPricing);

  useEffect(() => {
    let detectedCountry = initialCountryCode;

    // Check cookie
    const cookieMatch = document.cookie.match(/atlas_country_code=([^;]+)/);
    if (cookieMatch && cookieMatch[1]) {
      detectedCountry = cookieMatch[1];
    } else {
      // Check localStorage
      const localCountry = localStorage.getItem('atlas_country_code') || localStorage.getItem('user_country');
      if (localCountry) {
        detectedCountry = localCountry;
      }
    }

    const norm = normalizeCountryCode(detectedCountry);
    setEffectiveCountryCode(norm);
    setEffectivePricing({
      PRO: getPricing('PRO', norm),
      ELITE: getPricing('ELITE', norm)
    });
  }, [initialCountryCode]);

  const proPrice = isYearly ? effectivePricing.PRO.yearly : effectivePricing.PRO.monthly;
  const elitePrice = isYearly ? effectivePricing.ELITE.yearly : effectivePricing.ELITE.monthly;
  const period = isYearly ? 'year' : 'mo';

  const openPartnerModal = (orgType: string) => {
    setSelectedOrgType(orgType);
    setIsModalOpen(true);
  };

  const handleUpgradeClick = async (tier: 'PRO' | 'ELITE') => {
    if (!isLoggedIn) {
      window.location.href = '/signup';
      return;
    }

    setLoadingTier(tier);

    try {
      const isAfrican = AFRICAN_COUNTRIES.includes(effectiveCountryCode.toUpperCase());
      const endpoint = isAfrican
        ? '/api/payments/paystack/initialize'
        : '/api/payments/stripe/checkout';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          billing: isYearly ? 'yearly' : 'monthly',
        }),
      });

      const data = await res.json();

      if (!res.ok || (!data.authorization_url && !data.url)) {
        throw new Error(data.error || 'Failed to initialize payment checkout.');
      }

      const checkoutUrl = data.authorization_url || data.url;
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Payment initialization failed. Please try again.');
      setLoadingTier(null);
    }
  };

  const isUSD = effectivePricing.PRO.currency === 'USD';
  const countryNotFound = isUSD && effectiveCountryCode !== 'US';

  return (
    <>
      <div className={styles.toggleContainer}>
        <span 
          className={`${styles.toggleLabel} ${!isYearly ? styles.toggleLabelActive : ''}`}
          onClick={() => setIsYearly(false)}
        >
          Monthly
        </span>
        <div className={styles.toggleSwitch} onClick={() => setIsYearly(!isYearly)}>
          <div className={`${styles.toggleKnob} ${isYearly ? styles.toggleKnobYearly : ''}`} />
        </div>
        <span 
          className={`${styles.toggleLabel} ${isYearly ? styles.toggleLabelActive : ''}`}
          onClick={() => setIsYearly(true)}
        >
          Yearly <span className={styles.saveBadge}>Save 33%</span>
        </span>
      </div>

      {!isLoggedIn && !countryNotFound && (
        <div className={styles.footnote}>
          Sign in to confirm your local pricing
        </div>
      )}
      {countryNotFound && (
        <div className={styles.footnote}>
          We'll add local pricing for your country soon!
        </div>
      )}

      {/* STUDENT TIERS GRID */}
      <div className={styles.cardsGrid}>
        {/* FREE CARD */}
        <div className={`${styles.card} ${styles.cardFree}`}>
          <div className={styles.tierHeader}>
            <span className={styles.tierIcon}>🎓</span>
            <span className={styles.tierName}>Atlas Free</span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.price}>Free</span>
            <span className={styles.pricePeriod}>forever</span>
          </div>
          
          <ul className={styles.featureList}>
            <li className={`${styles.featureItem} ${styles.featureFirst}`}>
              <span className={styles.checkIcon}>✓</span> <strong>Unlimited AI Chat</strong>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Browse & Search All Opportunities
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Read Community Reviews
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> View Atlas Scores
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Save up to 20 Opportunities
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Basic Email Alerts
            </li>
          </ul>
          
          <Link href={isLoggedIn ? "/chat" : "/signup"} className={`${styles.ctaButton} ${styles.btnFree}`}>
            Continue Free
          </Link>
        </div>

        {/* PRO CARD */}
        <div className={`${styles.card} ${styles.cardPro}`}>
          <div className={styles.recommendedBadge}>Most Popular</div>
          <div className={styles.tierHeader}>
            <span className={styles.tierIcon}>⭐</span>
            <span className={styles.tierName}>Atlas Pro</span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              {effectivePricing.PRO.symbol}{proPrice.toLocaleString()}
            </span>
            <span className={styles.pricePeriod}>/{period}</span>
          </div>
          
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> <strong>Everything in Free, plus:</strong>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Application Kanban Board — track every stage visually
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Smart Deadline Alerts — SMS + Email so you never miss a date
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> AI Application Checklist — auto-generated per opportunity
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Document Vault — store 5 files securely
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Export Timeline as PDF
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Priority Support
            </li>
          </ul>
          
          <button 
            className={`${styles.ctaButton} ${styles.btnPro}`}
            onClick={() => handleUpgradeClick('PRO')}
            disabled={loadingTier !== null}
          >
            {loadingTier === 'PRO' ? '⚡ Connecting to Checkout...' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* ELITE CARD */}
        <div className={`${styles.card} ${styles.cardElite}`}>
          <div className={styles.tierHeader}>
            <span className={styles.tierIcon}>👑</span>
            <span className={styles.tierName}>Atlas Elite</span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              {effectivePricing.ELITE.symbol}{elitePrice.toLocaleString()}
            </span>
            <span className={styles.pricePeriod}>/{period}</span>
          </div>
          
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> <strong>Everything in Pro, plus:</strong>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> AI Essay Drafting — tailored to your profile and the opportunity
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> AI Essay Review — instant feedback on structure and tone
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Human Essay Review — 2 essays reviewed by experts monthly
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Mock Interview Practice — AI-powered with feedback
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Mentor Matching — 1 video call monthly with past winners
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Resume/CV AI Builder — ATS-optimized
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Unlimited Document Vault
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Quarterly 1-on-1 Strategy Session
            </li>
          </ul>
          
          <button 
            className={`${styles.ctaButton} ${styles.btnElite}`}
            onClick={() => handleUpgradeClick('ELITE')}
            disabled={loadingTier !== null}
          >
            {loadingTier === 'ELITE' ? '⚡ Connecting to Checkout...' : 'Upgrade to Elite'}
          </button>
        </div>
      </div>

      {/* ENTERPRISE TEASER SECTION */}
      <div className={styles.enterpriseContainer}>
        <div className={styles.enterpriseHeader}>
          <h2 className={styles.enterpriseTitle}>AtlasFind for Institutions</h2>
          <p className={styles.enterpriseSubtitle}>
            Universities, foundations, and corporate sponsors — partner with us to reach high-intent students worldwide.
          </p>
        </div>

        <div className={styles.enterpriseGrid}>
          {/* CARD 1 */}
          <div className={styles.enterpriseCard}>
            <div className={styles.enterpriseBadge}>🚀 Launching Q1 2027</div>
            <h3 className={styles.enterpriseCardTitle}>Scholarship Sponsors</h3>
            <p className={styles.enterpriseCardDesc}>
              List your opportunities to verified, engaged applicants. Get real-time analytics on who applies.
            </p>
            <button 
              className={styles.enterpriseCta}
              onClick={() => openPartnerModal('Corporate')}
            >
              Learn More
            </button>
          </div>

          {/* CARD 2 */}
          <div className={styles.enterpriseCard}>
            <div className={styles.enterpriseBadge}>Coming Soon</div>
            <h3 className={styles.enterpriseCardTitle}>Universities & Schools</h3>
            <p className={styles.enterpriseCardDesc}>
              Bulk Pro/Elite licenses for your graduating class. White-label AI advising for your career center.
            </p>
            <button 
              className={styles.enterpriseCta}
              onClick={() => openPartnerModal('University')}
            >
              Learn More
            </button>
          </div>

          {/* CARD 3 */}
          <div className={styles.enterpriseCard}>
            <div className={styles.enterpriseBadge}>Coming Soon</div>
            <h3 className={styles.enterpriseCardTitle}>Mentorship Networks</h3>
            <p className={styles.enterpriseCardDesc}>
              Connect your mentors with ambitious students in emerging markets. Verified, structured, impactful.
            </p>
            <button 
              className={styles.enterpriseCta}
              onClick={() => openPartnerModal('NGO')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <PartnerInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={selectedOrgType}
      />
    </>
  );
}
