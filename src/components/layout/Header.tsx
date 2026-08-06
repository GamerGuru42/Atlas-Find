import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Atlas<span className={styles.logoAccent}>Find</span>
      </Link>
      
      <nav className={styles.nav}>
        <Link href="/discover" className={styles.navLink}>Discover</Link>
        <Link href="/transparency" className={styles.navLink}>Transparency</Link>
      </nav>
      
      <div className={styles.actions}>
        <Link href="/chat">
          <Button variant="primary" size="sm">Talk to Agent</Button>
        </Link>
      </div>
    </header>
  );
}
