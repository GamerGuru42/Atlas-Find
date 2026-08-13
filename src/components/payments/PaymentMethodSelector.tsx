'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Zap, Lock, Building2, Smartphone } from 'lucide-react';
import styles from './Payment.module.css';

interface PaymentMethodSelectorProps {
  tier: 'PRO' | 'ELITE';
  billing: 'monthly' | 'yearly';
  countryCode?: string; // NG, GH, KE, ZA, US, UK, etc.
  currency?: string;
  onSuccess?: () => void;
}

const AFRICAN_COUNTRIES = ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'RW', 'SN', 'CI', 'CM', 'EG', 'MA'];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  tier,
  billing,
  countryCode = 'NG',
  currency = 'NGN',
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAfricanCountry = AFRICAN_COUNTRIES.includes(countryCode.toUpperCase());
  const processor = isAfricanCountry ? 'paystack' : 'stripe';

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const endpoint = processor === 'paystack'
        ? '/api/payments/paystack/initialize'
        : '/api/payments/stripe/checkout';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          billing,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize payment checkout.');
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.selectorCard}>
      <div className={styles.processorHeader}>
        <div className={styles.processorTitle}>
          <CreditCard size={20} style={{ color: '#2563eb' }} />
          <span>Payment Gateway: {processor === 'paystack' ? 'Paystack (Africa)' : 'Stripe (Global)'}</span>
        </div>
        <span className={styles.secBadge}>
          <Lock size={12} />
          SSL 256-Bit Encrypted
        </span>
      </div>

      <div className={styles.methodDetails}>
        {processor === 'paystack' ? (
          <div className={styles.badgeRow}>
            <span className={styles.methodBadge}><Building2 size={13} /> Bank Transfer</span>
            <span className={styles.methodBadge}><CreditCard size={13} /> Debit Card</span>
            <span className={styles.methodBadge}><Smartphone size={13} /> USSD Code</span>
          </div>
        ) : (
          <div className={styles.badgeRow}>
            <span className={styles.methodBadge}><CreditCard size={13} /> Credit / Debit Card</span>
            <span className={styles.methodBadge}> Apple Pay</span>
            <span className={styles.methodBadge}>G Pay</span>
          </div>
        )}
      </div>

      {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}

      <button
        className={styles.checkoutBtn}
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading ? (
          <span>Connecting securely...</span>
        ) : (
          <>
            <Zap size={16} />
            <span>Proceed to Checkout ({tier} {billing})</span>
          </>
        )}
      </button>

      <div className={styles.guaranteeText}>
        <ShieldCheck size={14} style={{ color: '#16a34a' }} />
        <span>Zero risk. Cancel anytime from your account settings.</span>
      </div>
    </div>
  );
};
