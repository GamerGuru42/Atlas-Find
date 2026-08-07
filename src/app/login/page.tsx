import React from 'react';
import Link from 'next/link';
import { LoginButton } from '@/components/auth/LoginButton';
import styles from '@/components/auth/Auth.module.css';

export default function LoginPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />
      <div className={styles.authCard}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Log in to continue your research journey with AtlasFind.
        </p>
        
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
