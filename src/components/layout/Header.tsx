import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import styles from './Header.module.css';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';


import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { UserMenu } from './UserMenu';

export async function Header() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--accent-primary)" fillOpacity="0.2" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Atlas<span className={styles.logoAccent}>Find</span>
      </Link>
      
      <div className={styles.desktopNav}>
        <nav className={styles.nav}>
          <Link href="/discover" className={styles.navLink}>Discover</Link>
          <Link href="/transparency" className={styles.navLink}>Transparency</Link>
        </nav>
        
        <div className={styles.actions}>
          <ThemeToggle />
          {session ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/chat">
                <Button variant="primary" size="sm">Talk to Agent</Button>
              </Link>
              <UserMenu userEmail={session.user.email || 'User'} />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className={styles.mobileNavContainer}>
        <ThemeToggle />
        <MobileMenu isLoggedIn={!!session} />
      </div>
    </header>
  );
}
