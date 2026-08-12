'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <Compass size={64} style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Lost in the Atlas?
      </h2>
      <p style={{ maxWidth: '500px', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The opportunity or page you&apos;re looking for doesn&apos;t exist, has been removed, or might be temporarily unavailable.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
        <Link href="/discover">
          <Button variant="primary">Discover Opportunities</Button>
        </Link>
      </div>
    </div>
  );
}
