import React from 'react';

export function Footer() {
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
      <p>
        We don&apos;t list scholarships. We verify pathways.
      </p>
      <p style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
        Built by a student, for students. No fake teams. No paywalls on access.
      </p>
    </footer>
  );
}
