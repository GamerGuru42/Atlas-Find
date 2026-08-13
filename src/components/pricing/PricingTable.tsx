"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Pricing.module.css';
import { PartnerInquiryModal } from './PartnerInquiryModal';
import { PaymentMethodSelector } from '../payments/PaymentMethodSelector';

interface PricingTableProps {
  userPricing: {
    PRO: any;
    ELITE: any;
  };
  isLoggedIn: boolean;
  countryNotFound: boolean;
  countryCode?: string;
}

export function PricingTable({ userPricing, isLoggedIn, countryNotFound, countryCode = 'NG' }: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrgType, setSelectedOrgType] = useState('University');
  const [activeCheckoutTier, setActiveCheckoutTier] = useState<'PRO' | 'ELITE' | null>(null);

  const proPrice = isYearly ? userPricing.PRO.yearly : userPricing.PRO.monthly;
  const elitePrice = isYearly ? userPricing.ELITE.yearly : userPricing.ELITE.monthly;
  const period = isYearly ? 'year' : 'mo';

  const openPartnerModal = (orgType: string) => {
    setSelectedOrgType(orgType);
    setIsModalOpen(true);
  };

  const handleUpgradeClick = (tier: 'PRO' | 'ELITE') => {
    if (!isLoggedIn) {
      window.location.href = '/signup';
      return;
    }
    setActiveCheckoutTier(activeCheckoutTier === tier ? null : tier);
  };

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
              {userPricing.PRO.symbol}{proPrice.toLocaleString()}
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
          >
            {activeCheckoutTier === 'PRO' ? 'Close Checkout' : 'Upgrade to Pro'}
          </button>

          {activeCheckoutTier === 'PRO' && (
            <PaymentMethodSelector
              tier="PRO"
              billing={isYearly ? 'yearly' : 'monthly'}
              countryCode={countryCode}
            />
          )}
        </div>

        {/* ELITE CARD */}
        <div className={`${styles.card} ${styles.cardElite}`}>
          <div className={styles.tierHeader}>
            <span className={styles.tierIcon}>👑</span>
            <span className={styles.tierName}>Atlas Elite</span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              {userPricing.ELITE.symbol}{elitePrice.toLocaleString()}
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
          >
            {activeCheckoutTier === 'ELITE' ? 'Close Checkout' : 'Upgrade to Elite'}
          </button>

          {activeCheckoutTier === 'ELITE' && (
            <PaymentMethodSelector
              tier="ELITE"
              billing={isYearly ? 'yearly' : 'monthly'}
              countryCode={countryCode}
            />
          )}
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
