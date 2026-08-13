'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.mobileMenuWrapper}>
      <button 
        className={styles.hamburger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <nav className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Menu</span>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.drawerLinks}>
              <Link href="/discover" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Discover</Link>
              <Link href="/dashboard/tracker" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Tracker</Link>
              <Link href="/transparency" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Transparency</Link>
              <Link href="/pricing" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Pricing</Link>
            </div>
            
            <div className={styles.drawerActions}>
              {isLoggedIn ? (
                <Link href="/chat" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" style={{ width: '100%' }}>Talk to Agent</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" style={{ width: '100%', marginBottom: '1rem', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" style={{ width: '100%' }}>Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
