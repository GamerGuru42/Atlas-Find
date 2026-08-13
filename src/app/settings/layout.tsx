"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SettingsLayout.module.css';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Settings</h1>
      
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <Link 
              href="/settings/profile" 
              className={styles.navLink}
              data-active={pathname === '/settings/profile'}
            >
              👤 Profile
            </Link>
            <Link 
              href="/settings/subscription" 
              className={styles.navLink}
              data-active={pathname === '/settings/subscription'}
            >
              ⭐ Subscription
            </Link>
            <Link 
              href="/settings/notifications" 
              className={styles.navLink}
              data-active={pathname === '/settings/notifications'}
            >
              🔔 Notifications
            </Link>
            <Link 
              href="/settings/security" 
              className={styles.navLink}
              data-active={pathname === '/settings/security'}
            >
              🔒 Security
            </Link>
          </nav>
        </aside>
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
