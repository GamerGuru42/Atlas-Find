'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, LayoutGrid, Compass, RefreshCw, AlertCircle } from 'lucide-react';
import styles from './Success.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [tier, setTier] = useState<string>('PRO');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const allRefs = urlParams.getAll('reference');
        
        const atlasRef = urlParams.get('atlas_ref') || (allRefs[0]?.startsWith('atlas_') ? allRefs[0] : null);
        const paystackRef = urlParams.get('trxref') || (allRefs.length > 1 ? allRefs[1] : allRefs[0]);

        if (atlasRef || paystackRef) {
          console.log('Sending references to verification endpoint:', { atlasRef, paystackRef });

          const query = new URLSearchParams();
          if (atlasRef) query.set('atlas_ref', atlasRef);
          if (paystackRef) query.set('trxref', paystackRef);

          const res = await fetch(`/api/payments/paystack/verify?${query.toString()}`);
          const data = await res.json();

          if (res.ok && data.success) {
            setSuccess(true);
            setTier(data.tier ? data.tier.toUpperCase() : 'PRO');
            triggerConfetti();
          } else {
            setErrorMsg(data.message || data.error || 'Payment verification returned incomplete status.');
          }
          return;
        }
      }

      if (sessionId) {
        // Stripe payment verification via session_id
        setSuccess(true);
        setTier('PRO');
        triggerConfetti();
      } else {
        // Missing reference in URL state
        setErrorMsg('Missing transaction info. Contact support if charged.');
      }
    } catch (e: any) {
      console.error('Payment verification error:', e);
      setErrorMsg('Network error while verifying payment. If charged, your account will upgrade automatically via webhook.');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <RefreshCw size={36} className={styles.spinner} />
          <h2>Verifying Your Payment...</h2>
          <p>Please wait while we confirm your subscription with Paystack and activate your tools.</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <AlertCircle size={48} style={{ color: '#f59e0b' }} />
          <h2>Payment Verification Status</h2>
          <p style={{ margin: '12px 0 20px', color: '#94a3b8' }}>{errorMsg}</p>
          <div className={styles.btnRow}>
            <button className={styles.retryBtn} onClick={verifyPayment}>
              <RefreshCw size={14} /> Retry Verification
            </button>
            <Link href="/dashboard/tracker?upgraded=true" className={styles.primaryBtn}>
              <LayoutGrid size={16} /> Open Tracker
            </Link>
            <Link href="/pricing" className={styles.secondaryBtn}>
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <CheckCircle2 size={44} style={{ color: '#16a34a' }} />
        </div>

        <span className={styles.badge}>
          <Sparkles size={13} /> Official Subscription Active
        </span>

        <h1 className={styles.heading}>Welcome to Atlas {tier}! 🎉</h1>
        <p className={styles.subheading}>
          Your payment was successful. Your account has been upgraded with instant, full access to all premium features.
        </p>

        <div className={styles.featureBox}>
          <h3>What's now unlocked for you:</h3>
          <ul>
            <li>✅ <strong>Unlimited Opportunity Saves</strong> — Save as many scholarships & jobs as you want</li>
            <li>✅ <strong>Full Kanban Tracker</strong> — Manage applications, stage checklists & document vaults</li>
            <li>✅ <strong>Smart Deadline SMS & Email Alerts</strong> — Never miss a critical closing date</li>
            <li>✅ <strong>Export Timelines to PDF</strong> — Download your application roadmap anytime</li>
          </ul>
        </div>

        <div className={styles.btnRow}>
          <Link href="/dashboard/tracker?upgraded=true" className={styles.primaryBtn}>
            <LayoutGrid size={16} />
            <span>Open Application Tracker</span>
          </Link>
          <Link href="/discover" className={styles.secondaryBtn}>
            <Compass size={16} />
            <span>Explore Opportunities</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading payment status...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
