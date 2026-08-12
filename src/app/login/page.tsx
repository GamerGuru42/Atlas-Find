'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoginButton } from '@/components/auth/LoginButton';
import styles from '@/components/auth/Auth.module.css';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className={styles.authContainer}>
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />
      <div className={styles.authCard}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Log in to continue your research journey with AtlasFind.
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
          <LoginButton />
        </div>
        
        <p className={styles.footerText}>
          Don&apos;t have an account?
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
