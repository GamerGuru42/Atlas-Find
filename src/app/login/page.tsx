import React from 'react';
import Link from 'next/link';
import { LoginButton } from '@/components/auth/LoginButton';

export default function LoginPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Log in to continue your research journey with AtlasFind.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <LoginButton />
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
