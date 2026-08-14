'use client';

import React from 'react';

export function TestModeBanner() {
  const isTestMode = true; // Active during test key verification

  if (!isTestMode) return null;

  return (
    <div
      style={{
        background: '#fef08a',
        color: '#854d0e',
        fontSize: '0.8125rem',
        fontWeight: 600,
        textAlign: 'center',
        padding: '0.375rem 1rem',
        borderBottom: '1px solid #fde047',
        zIndex: 9999,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      <span>⚠️ TEST MODE — No real charges will be made.</span>
      <span style={{ opacity: 0.85, fontWeight: 500 }}>
        Test Card: <code style={{ background: '#fef9c3', padding: '1px 4px', borderRadius: '4px' }}>4084 0840 8408 4081</code> | CVV: <code>000</code> | PIN: <code>0000</code>
      </span>
    </div>
  );
}
export default TestModeBanner;
