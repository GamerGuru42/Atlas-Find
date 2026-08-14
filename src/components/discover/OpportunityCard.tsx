'use client';

import React, { useState } from 'react';
import { Heart, Share2, Sparkles, Calendar, MapPin, Award, ArrowUpRight, HelpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import styles from '@/app/discover/page.module.css';

interface OpportunityCardProps {
  opp: {
    id: string;
    title: string;
    sponsor: string;
    type: string;
    fundingType: string;
    hostCountry: string;
    deadline: string;
    matchScore: number;
    description: string;
    scoreBreakdown?: {
      fieldMatch: number;
      gpaMatch: number;
      degreeMatch: number;
    };
  };
  savedOpportunityId: string | null;
  onSave: (oppId: string) => Promise<boolean | 'limit_reached'>;
  onUnsave: (savedOppId: string) => Promise<boolean>;
  onSelect: () => void;
  isLoggedIn: boolean;
  userTier: string;
}

export default function OpportunityCard({
  opp,
  savedOpportunityId,
  onSave,
  onUnsave,
  onSelect,
  isLoggedIn,
  userTier
}: OpportunityCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  const isSaved = !!savedOpportunityId;

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.info('Please log in to save opportunities to your tracker.');
      return;
    }

    setIsSaving(true);
    setShowUpsell(false);

    try {
      if (isSaved) {
        const success = await onUnsave(savedOpportunityId!);
        if (success) {
          toast.success('Opportunity removed from tracker.');
        }
      } else {
        const res = await onSave(opp.id);
        if (res === 'limit_reached') {
          setShowUpsell(true);
        } else if (res) {
          toast.success('Opportunity saved to tracker!');
        }
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/discover?modal=${opp.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy share link.'));
  };

  const scoreBreakdown = opp.scoreBreakdown || { fieldMatch: 75, gpaMatch: 80, degreeMatch: 85 };

  return (
    <div className={styles.card} onClick={onSelect}>
      <div className={styles.cardHeader}>
        <div className={styles.sponsorInfo}>
          <span className={styles.sponsorName}>{opp.sponsor}</span>
          <span className={styles.oppTypeBadge}>{opp.type}</span>
        </div>

        {/* Atlas Score Tooltip */}
        <div className={styles.scoreWrapper}>
          <div className={styles.cardScoreBadge}>
            <Sparkles size={12} className={styles.sparkleIcon} />
            <span>{opp.matchScore}% Match</span>
            <HelpCircle size={10} className={styles.infoIcon} />
          </div>
          <div className={styles.tooltip}>
            <h5 className={styles.tooltipTitle}>Atlas Match Score Breakdown</h5>
            <div className={styles.tooltipRow}>
              <span>Field match:</span>
              <strong>{scoreBreakdown.fieldMatch}%</strong>
            </div>
            <div className={styles.tooltipRow}>
              <span>GPA requirement match:</span>
              <strong>{scoreBreakdown.gpaMatch}%</strong>
            </div>
            <div className={styles.tooltipRow}>
              <span>Degree level match:</span>
              <strong>{scoreBreakdown.degreeMatch}%</strong>
            </div>
          </div>
        </div>
      </div>

      <h3 className={styles.oppTitle}>{opp.title}</h3>
      <p className={styles.oppDesc}>{opp.description}</p>

      <div className={styles.cardMeta}>
        <div className={styles.metaBadge}>
          <MapPin size={13} />
          <span>{opp.hostCountry}</span>
        </div>
        <div className={styles.metaBadge}>
          <Award size={13} />
          <span style={{ textTransform: 'capitalize' }}>{opp.fundingType.replace('_', ' ')}</span>
        </div>
        <div className={styles.metaBadge}>
          <Calendar size={13} />
          <span>{new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {showUpsell && (
        <div className={styles.cardUpsell}>
          <span className={styles.upsellWarning}>⭐ UPGRADE REQUIRED</span>
          <p>Free users are limited to 20 saved opportunities. Upgrade to Pro for unlimited saves.</p>
          <Link href="/settings/subscription" className={styles.upsellLink} onClick={e => e.stopPropagation()}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
        <button
          className={`${styles.actionBtn} ${isSaved ? styles.actionBtnSaved : ''}`}
          onClick={handleSaveClick}
          disabled={isSaving}
          title={isSaved ? 'Unsave opportunity' : 'Save to tracker'}
        >
          {isSaving ? (
            <Loader2 className={styles.spin} size={14} />
          ) : (
            <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
          )}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleShare}
          title="Share opportunity"
        >
          <Share2 size={14} />
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>

        <button
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          onClick={onSelect}
        >
          <span>Details</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
