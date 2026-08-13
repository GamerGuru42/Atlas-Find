"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Pricing.module.css';

interface PricingTableProps {
  userPricing: {
    PRO: any;
    ELITE: any;
  };
  isLoggedIn: boolean;
  countryNotFound: boolean;
}

export function PricingTable({ userPricing, isLoggedIn, countryNotFound }: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);

  const proPrice = isYearly ? userPricing.PRO.yearly : userPricing.PRO.monthly;
  const elitePrice = isYearly ? userPricing.ELITE.yearly : userPricing.ELITE.monthly;
  const period = isYearly ? 'year' : 'mo';

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
              <span className={styles.checkIcon}>✓</span> Unlimited AI Chat
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
              <span className={styles.checkIcon}>✓</span> Unlimited Saved Opportunities
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Application Tracker (Kanban Board)
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Smart Deadline Alerts (Email + SMS)
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> AI Application Checklist
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Document Vault (5 files)
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Export Timeline as PDF
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Priority Support
            </li>
          </ul>
          
          <Link href={isLoggedIn ? "/settings/subscription" : "/signup"} className={`${styles.ctaButton} ${styles.btnPro}`}>
            Upgrade
          </Link>
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
              <span className={styles.checkIcon}>✓</span> AI Essay Drafting & Tailoring
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> AI Essay Review & Feedback
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Human Essay Review (2/month)
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Mock Interview Practice
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Mentor Matching (1 call/month)
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Resume/CV AI Builder
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Unlimited Document Vault
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Quarterly Strategy Session
            </li>
          </ul>
          
          <Link href={isLoggedIn ? "/settings/subscription" : "/signup"} className={`${styles.ctaButton} ${styles.btnElite}`}>
            Upgrade
          </Link>
        </div>
      </div>
    </>
  );
}
