'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Compass, Sparkles } from 'lucide-react';
import styles from '../success/Success.module.css';

export default function PaymentCancelPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconCircle} style={{ background: '#fef3c7' }}>
          <Shield size={44} style={{ color: '#d97706' }} />
        </div>

        <span className={styles.badge} style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
          Payment Canceled
        </span>

        <h1 className={styles.heading}>Payment canceled. No worries!</h1>
        <p className={styles.subheading}>
          No charges were made to your account. You can upgrade to Pro or Elite whenever you are ready.
        </p>

        <div className={styles.featureBox} style={{ background: '#fff7ed', borderColor: '#ffedd5' }}>
          <h3 style={{ color: '#9a3412', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> AtlasFind works great for free!
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#7c2d12', margin: '6px 0 0 0', lineHeight: 1.5 }}>
            The AI chat, opportunity search, and personalized advice are 100% unlimited on the free plan.
          </p>
        </div>

        <div className={styles.btnRow}>
          <Link href="/discover" className={styles.primaryBtn}>
            <Compass size={16} />
            <span>Back to Discover</span>
          </Link>
          <Link href="/pricing" className={styles.secondaryBtn}>
            <span>See Pricing Plans</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
