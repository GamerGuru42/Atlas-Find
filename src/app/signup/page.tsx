'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoginButton } from '@/components/auth/LoginButton';
import styles from '@/components/auth/Auth.module.css';

function SignupContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const returnUrl = searchParams.get('returnUrl');

  return (
    <div className={styles.authContainer}>
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />
      <div className={styles.authCard}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Join AtlasFind and let your AI research agent find verified pathways for you.
        </p>

        {error && (
          <div style={{
            color: 'var(--status-danger)',
            fontSize: '0.85rem',
            textAlign: 'center',
            margin: '0 0 1.5rem 0',
            padding: '0.75rem 1rem',
            background: 'rgba(248, 81, 73, 0.08)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(248, 81, 73, 0.2)',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}
        
        <div className={styles.buttonWrapper}>
          <LoginButton mode="signup" returnUrl={returnUrl} />
        </div>
        
        <p className={styles.footerText}>
          Already have an account?
          <Link href={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'} className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
