"use client";

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import styles from './Subscription.module.css';
import { RetentionModal } from './RetentionModal';

export function CurrentPlanCard({ tier, renewsOn, nextPayment, symbol }: { tier: string, renewsOn?: string, nextPayment?: number, symbol?: string }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Current Plan: <span style={{ textTransform: 'capitalize' }}>{tier}</span></h3>
            {tier === 'free' ? (
              <p className={styles.cardDescription}>
                You're on the Free plan. You get unlimited AI chat, browse, and search. Upgrade to unlock tools that help you apply and win.
              </p>
            ) : tier === 'pro' ? (
              <p className={styles.cardDescription}>
                Your Pro plan renews on {renewsOn || 'upcoming date'}. Next payment: {symbol}{nextPayment || 'amount'}.
              </p>
            ) : (
              <p className={styles.cardDescription}>
                Your Elite plan renews on {renewsOn || 'upcoming date'}.
              </p>
            )}
          </div>
          <span className={`${styles.badge} ${tier === 'free' ? styles.badgeFree : styles.badgeActive}`}>
            Active
          </span>
        </div>
        
        {tier !== 'free' && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button variant="primary" onClick={() => alert("Manage payment clicked")}>Manage Payment</Button>
            <button 
              className={styles.btnSecondary} 
              onClick={() => setModalOpen(true)}
              style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancel Plan
            </button>
          </div>
        )}
      </div>

      <RetentionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export function UpgradeCards({ userPricing, currentTier }: { userPricing: any, currentTier: string }) {
  const [isYearly, setIsYearly] = useState(false);

  const proPrice = isYearly ? userPricing.PRO.yearly : userPricing.PRO.monthly;
  const elitePrice = isYearly ? userPricing.ELITE.yearly : userPricing.ELITE.monthly;

  return (
    <div>
      {currentTier === 'pro' && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h3 className={styles.cardTitle}>You're on Pro. Want more power?</h3>
        </div>
      )}
      
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

      <div className={styles.upgradeGrid}>
        {/* PRO CARD */}
        {currentTier !== 'pro' && currentTier !== 'elite' && (
          <div className={styles.upgradeCard}>
            <div className={styles.planName}>Atlas Pro</div>
            <div className={styles.planPrice}>
              {userPricing.PRO.symbol}{proPrice.toLocaleString()}
            </div>
            <div className={styles.planPeriod}>per {isYearly ? 'year' : 'month'}</div>
            
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Unlimited saved opportunities
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> 5 document uploads for analysis
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Advanced matching algorithms
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Application tracking dashboard
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Priority email support
              </li>
            </ul>
            
            <Button variant="primary" style={{ width: '100%' }}>Upgrade to Pro</Button>
          </div>
        )}

        {/* ELITE CARD */}
        {currentTier !== 'elite' && (
          <div className={`${styles.upgradeCard} ${styles.upgradeElite}`} style={currentTier === 'pro' ? { gridColumn: '1 / -1', maxWidth: '600px', margin: '0 auto', width: '100%' } : {}}>
            <div className={`${styles.planName} ${styles.eliteText}`}>Atlas Elite</div>
            <div className={styles.planPrice}>
              {userPricing.ELITE.symbol}{elitePrice.toLocaleString()}
            </div>
            <div className={styles.planPeriod}>per {isYearly ? 'year' : 'month'}</div>
            
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Everything in Pro, plus:
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Unlimited document uploads
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> Unlimited AI essay drafting
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> 1 1-on-1 mentor call per month
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span> 2 human essay reviews per month
              </li>
            </ul>
            
            <Button variant="primary" style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: 'none' }}>
              Upgrade to Elite
            </Button>
          </div>
        )}
      </div>
      
      <div className={styles.paymentNote}>
        {['NGN', 'GHS', 'KES', 'ZAR'].includes(userPricing.PRO.currency) 
          ? "You'll pay securely via Paystack (Bank Transfer, Card, or USSD)"
          : "You'll pay securely via Stripe (Card, Apple Pay, Google Pay)"}
      </div>
    </div>
  );
}
