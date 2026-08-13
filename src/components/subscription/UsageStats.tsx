"use client";

import React from 'react';
import styles from './Subscription.module.css';

export interface UsageStatsData {
  savedOpportunities: { current: number, max: number };
  documentsUploaded: { current: number, max: number };
  essaysDrafted: { current: number, max: number };
  mentorCalls: { current: number, max: number };
  essayReviews: { current: number, max: number };
}

export function UsageStats({ stats, tier }: { stats: UsageStatsData, tier: string }) {
  const renderStat = (label: string, data: { current: number, max: number }) => {
    const isUnlimited = data.max === -1;
    const progress = isUnlimited ? 100 : Math.min(100, (data.current / Math.max(data.max, 1)) * 100);
    const valueText = isUnlimited ? 'Unlimited' : `${data.current}/${data.max}`;
    
    return (
      <div className={styles.statItem}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>{label}</span>
          <span className={styles.statValue}>{valueText}</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%`, background: isUnlimited ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Usage Stats</h3>
          <p className={styles.cardDescription}>Reset monthly at midnight UTC</p>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        {renderStat('Saved Opportunities', stats.savedOpportunities)}
        {renderStat('Documents Uploaded', stats.documentsUploaded)}
        {renderStat('Essays Drafted', stats.essaysDrafted)}
        {renderStat('Mentor Calls', stats.mentorCalls)}
        {renderStat('Essay Reviews', stats.essayReviews)}
      </div>
    </div>
  );
}
