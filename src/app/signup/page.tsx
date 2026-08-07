import React from 'react';
import Link from 'next/link';
import { LoginButton } from '@/components/auth/LoginButton';
import styles from '@/components/auth/Auth.module.css';

export default function SignupPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />
      <div className={styles.authCard}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Join AtlasFind and let your AI research agent find verified pathways for you.
        </p>
        
        <div className={styles.buttonWrapper}>
          <LoginButton />
        </div>
        
        <p className={styles.footerText}>
          Already have an account?
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
