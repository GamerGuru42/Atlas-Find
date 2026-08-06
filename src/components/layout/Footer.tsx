import React from 'react';

export function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid var(--glass-border)',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
      marginTop: 'auto'
    }}>
      <p>© {new Date().getFullYear()} AtlasFind. We verify pathways.</p>
    </footer>
  );
}
