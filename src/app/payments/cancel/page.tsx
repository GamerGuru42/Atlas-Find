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

        <h1 className={styles.heading}>No worries — upgrade whenever you're ready</h1>
        <p className={styles.subheading}>
          Your payment was canceled. No charges were made to your account.
        </p>

        <div className={styles.featureBox} style={{ background: '#fff7ed', borderColor: '#ffedd5' }}>
          <h3 style={{ color: '#9a3412', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> AtlasFind is 100% Free for core search & AI chat
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#7c2d12', margin: '4px 0 0 0', lineHeight: 1.5 }}>
            You still have unlimited access to our AI Advisor, opportunity search, community reviews, and basic saved items.
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
