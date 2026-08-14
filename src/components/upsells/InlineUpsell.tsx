'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';
import styles from './InlineUpsell.module.css';

interface InlineUpsellProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function InlineUpsell({
  title = 'You have reached your free save limit (20/20)',
  description = 'Upgrade to Atlas Pro to save unlimited opportunities, access the Kanban application tracker, and receive smart deadline alerts.',
  ctaText = 'See Pro Plans',
  ctaLink = '/settings/subscription',
}: InlineUpsellProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Lock size={20} className={styles.lockIcon} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <Sparkles size={12} /> Atlas Pro Feature
          </span>
          <h4 className={styles.title}>{title}</h4>
        </div>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.action}>
        <Link href={ctaLink} className={styles.ctaButton}>
          <span>{ctaText}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
export default InlineUpsell;
