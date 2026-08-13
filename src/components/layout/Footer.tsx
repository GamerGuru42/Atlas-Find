'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/chat') return null;

  return (
    <footer style={{
      padding: '2rem',
      textAlign: 'center',
      borderTop: '1px solid var(--border-default)',
      background: 'var(--bg-surface)',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
    }}>
      <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        AtlasFind
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
        <Link href="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</Link>
        <Link href="/transparency" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Transparency</Link>
      </div>
      <p>
        Verify Pathways to Global Opportunities.
      </p>
      <p style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
        Built by a student, for students. No fake teams. No paywalls on access.
      </p>
    </footer>
  );
}
