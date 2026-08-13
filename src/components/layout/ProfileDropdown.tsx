"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useTheme } from 'next-themes';
import styles from './ProfileDropdown.module.css';

interface ProfileDropdownProps {
  firstName: string;
  avatarUrl?: string;
  tier: 'free' | 'pro' | 'elite';
}

export function ProfileDropdown({ firstName, avatarUrl, tier }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getBadgeClass = () => {
    switch (tier.toLowerCase()) {
      case 'pro': return styles.badgePro;
      case 'elite': return styles.badgeElite;
      default: return styles.badgeFree;
    }
  };

  const initial = firstName ? firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={firstName} className={styles.avatar} />
        ) : (
          <div className={styles.avatar}>{initial}</div>
        )}
        <span>{firstName || 'User'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.sheetHandle} />
            
            <ul className={styles.dropdownList}>
              <li>
                <Link href="/settings/profile" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>👤</span> Profile
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=shortlist" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>💾</span> My Shortlist
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>📊</span> Dashboard
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/settings/subscription" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>⭐</span> Subscription
                  </div>
                  <span className={`${styles.badge} ${getBadgeClass()}`}>
                    {tier}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>⚙️</span> Settings
                  </div>
                </Link>
              </li>
              
              <div className={styles.divider} />
              
              <li>
                <button 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                  }}
                >
                  <div className={styles.dropdownItemLeft}>
                    <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </div>
                </button>
              </li>
              
              <li>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <div className={styles.dropdownItemLeft}>
                    <span>🚪</span> Log Out
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
