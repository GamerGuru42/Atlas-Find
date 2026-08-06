import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import styles from './Header.module.css';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { LoginButton } from '../auth/LoginButton';

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
          <circle cx="12" cy="12" r="10" stroke="var(--accent-primary)" strokeWidth="2.5" />
          <path d="M12 6V18M6 12H18" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 9L15 15M15 9L9 15" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Atlas<span className={styles.logoAccent}>Find</span>
      </Link>
      
      <nav className={styles.nav}>
        <Link href="/discover" className={styles.navLink}>Discover</Link>
        <Link href="/transparency" className={styles.navLink}>Transparency</Link>
      </nav>
      
      <div className={styles.actions}>
        {session ? (
          <Link href="/chat">
            <Button variant="primary" size="sm">Talk to Agent</Button>
          </Link>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}
