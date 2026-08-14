"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useTierSync } from '@/lib/auth/useTierSync';
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

  // ─── Cross-tab tier sync ───
  const { currentTier, broadcastTier } = useTierSync(tier, (newTier, event) => {
    if (event === 'upgrade') {
      toast.success(`Your account has been upgraded to ${newTier === 'elite' ? 'Elite' : 'Pro'}! 🎉`);
    } else if (event === 'logout') {
      // Another tab logged out — force this tab to refresh
      router.push('/');
      router.refresh();
    } else if (newTier !== tier) {
      // Silent sync — just update (tier badge re-renders automatically)
      toast.info(`Account updated to ${newTier === 'elite' ? 'Elite' : newTier === 'pro' ? 'Pro' : 'Free'}.`);
    }
  });

  // Use the live tier from the sync hook
  const liveTier = currentTier;

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
    setIsOpen(false);

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear all AtlasFind cookies
    const cookiesToClear = [
      'atlas_user_tier',
      'atlas_onboarding_completed',
      'atlas_country_code',
      'atlas_return_url',
    ];
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; path=/; max-age=0`;
    });

    // Clear storage
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}

    // Broadcast logout to other tabs
    broadcastTier('free', 'logout');

    // Redirect to homepage
    toast.success("You've been logged out.");
    router.push('/');
    router.refresh();
  };

  const getBadgeClass = () => {
    switch (liveTier.toLowerCase()) {
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
                <Link href="/dashboard/tracker" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>📊</span> Application Tracker
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/settings/subscription" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                  <div className={styles.dropdownItemLeft}>
                    <span>⭐</span> Subscription
                  </div>
                  <span className={`${styles.badge} ${getBadgeClass()}`}>
                    {liveTier}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/settings/profile" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
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
