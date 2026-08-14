'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on outside click (for touch events on mobile)
  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(e: MouseEvent | TouchEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();

    // Clear all AtlasFind cookies
    ['atlas_user_tier', 'atlas_onboarding_completed', 'atlas_country_code', 'atlas_return_url'].forEach(name => {
      document.cookie = `${name}=; path=/; max-age=0`;
    });
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}

    // Broadcast logout
    try { new BroadcastChannel('atlas_tier').postMessage({ tier: 'free', event: 'logout' }); } catch {}

    toast.success("You've been logged out.");
    router.push('/');
    router.refresh();
  };

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
        <div className={styles.overlay}>
          <nav className={styles.drawer} ref={drawerRef} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Menu</span>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.drawerLinks}>
              {/* Always visible */}
              <Link href="/discover" className={styles.drawerLink} onClick={() => setIsOpen(false)}>🔍 Discover</Link>
              <Link href="/transparency" className={styles.drawerLink} onClick={() => setIsOpen(false)}>📊 Transparency</Link>
              <Link href="/pricing" className={styles.drawerLink} onClick={() => setIsOpen(false)}>💎 Pricing</Link>

              {/* Authenticated-only links */}
              {isLoggedIn && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-default)', margin: '0.5rem 0' }} />
                  <Link href="/dashboard/tracker" className={styles.drawerLink} onClick={() => setIsOpen(false)}>📋 Application Tracker</Link>
                  <Link href="/chat" className={styles.drawerLink} onClick={() => setIsOpen(false)}>💬 Atlas AI Chat</Link>
                  <Link href="/settings/profile" className={styles.drawerLink} onClick={() => setIsOpen(false)}>👤 Profile</Link>
                  <Link href="/settings/subscription" className={styles.drawerLink} onClick={() => setIsOpen(false)}>⭐ Subscription</Link>
                </>
              )}
            </div>
            
            <div className={styles.drawerActions}>
              {isLoggedIn ? (
                <>
                  <Link href="/chat" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" style={{ width: '100%', marginBottom: '0.75rem' }}>Talk to Agent</Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    onClick={handleLogout}
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    🚪 Log Out
                  </Button>
                </>
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
