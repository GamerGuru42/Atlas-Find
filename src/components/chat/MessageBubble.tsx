'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { toast } from 'sonner';
import { ShieldCheck, Calendar, Star, Compass, HelpCircle, Save, Sparkles, Check, CheckCheck } from 'lucide-react';
import styles from './Chat.module.css';

interface OpportunityData {
  id: string;
  title: string;
  sponsor: string;
  score: number;
  deadline: string;
  applyUrl: string;
}

interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    status?: 'sending' | 'sent' | 'error';
  };
  onRetryLastMsg?: () => void;
  onAskMore?: (oppTitle: string) => void;
}

export function MessageBubble({ message, onRetryLastMsg, onAskMore }: MessageBubbleProps) {
  const { role, content, status } = message;
  const [collapsed, setCollapsed] = useState(true);

  // Parse structured :::opportunity blocks
  const parseContent = (text: string) => {
    const cleanText = text.replace(/:::profile\s*([\s\S]*?)\s*:::/g, '').trim();
    const regex = /:::opportunity\s*([\s\S]*?)\s*:::/g;
    const parts: ({ type: 'text'; content: string } | { type: 'opportunity'; data: OpportunityData })[] = [];
    
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(cleanText)) !== null) {
      // Add preceding text
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: cleanText.slice(lastIndex, match.index),
        });
      }
      
      // Parse opportunity JSON
      try {
        const data = JSON.parse(match[1].trim());
        parts.push({
          type: 'opportunity',
          data: {
            id: data.id || 'unknown',
            title: data.title || 'Opportunity',
            sponsor: data.sponsor || 'Unknown Sponsor',
            score: data.score || 85,
            deadline: data.deadline || 'Rolling',
            applyUrl: data.applyUrl || '#',
          },
        });
      } catch (err) {
        console.error('Failed to parse opportunity json:', err);
        // Fallback: treat match raw string as text
        parts.push({
          type: 'text',
          content: match[0],
        });
      }
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < cleanText.length) {
      parts.push({
        type: 'text',
        content: cleanText.slice(lastIndex),
      });
    }
    
    return parts;
  };

  const parsedParts = parseContent(content);

  // Group multiple opportunities together to make them collapsible
  const renderMessageContent = () => {
    const elements: React.ReactNode[] = [];
    let consecutiveOpps: OpportunityData[] = [];
    
    const flushOpps = (keyPrefix: string) => {
      if (consecutiveOpps.length === 0) return;
      
      const oppsToRender = consecutiveOpps;
      consecutiveOpps = [];
      
      const limit = 3;
      const hasMany = oppsToRender.length > limit;
      const visibleOpps = hasMany && collapsed ? oppsToRender.slice(0, limit) : oppsToRender;
      
      elements.push(
        <div key={`opp-group-${keyPrefix}`} className={styles.opportunityGroup}>
          <div className={styles.opportunitiesGrid}>
            {visibleOpps.map((opp, idx) => (
              <InlineOpportunityCard
                key={opp.id || idx}
                opp={opp}
                onAskMore={onAskMore}
              />
            ))}
          </div>
          {hasMany && (
            <button
              className={styles.collapseToggle}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed 
                ? `Show ${oppsToRender.length - limit} more opportunities` 
                : 'Show fewer'
              }
            </button>
          )}
        </div>
      );
    };

    parsedParts.forEach((part, index) => {
      if (part.type === 'text') {
        flushOpps(`text-${index}`);
        elements.push(
          <div key={`text-${index}`} className={styles.messageTextMarkdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {part.content}
            </ReactMarkdown>
          </div>
        );
      } else {
        consecutiveOpps.push(part.data);
      }
    });

    flushOpps(`end`);
    return elements;
  };

  return (
    <div className={`${styles.messageRow} ${role === 'user' ? styles.messageUser : styles.messageAgent}`}>
      <div className={styles.messageContent}>
        {role !== 'user' && (
          <div className={styles.agentAvatar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
        )}

        <div className={`${styles.messageBubble} ${role === 'user' ? styles.bubbleUser : styles.bubbleAgent}`}>
          {renderMessageContent()}

          {role === 'user' && (
            <div className={styles.statusIndicator}>
              {status === 'sending' && <Check className={styles.checkIconSending} size={13} />}
              {status === 'sent' && <CheckCheck className={styles.checkIconSent} size={13} />}
              {status === 'error' && <span className={styles.msgErrorDot}>⚠️ Failed to send</span>}
            </div>
          )}
        </div>
      </div>

      {status === 'error' && onRetryLastMsg && (
        <div className={styles.inlineRetryContainer}>
          <span>⚠️ Connection interrupted.</span>
          <button className={styles.inlineRetryBtn} onClick={onRetryLastMsg}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Inline Opportunity Card
function InlineOpportunityCard({ opp, onAskMore }: { opp: OpportunityData; onAskMore?: (oppTitle: string) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/tracker/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opp.id,
          status: 'saved'
        })
      });

      const data = await res.json();
      if (res.status === 403 && data.error === 'limit_reached') {
        setShowUpsell(true);
      } else if (data.success) {
        setIsSaved(true);
        toast.success(`"${opp.title}" saved to application tracker!`);
      } else {
        toast.error(data.error || 'Failed to save opportunity.');
      }
    } catch {
      toast.error('Network error. Unable to save opportunity.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.oppCard}>
      <div className={styles.oppHeader}>
        <div>
          <h4 className={styles.oppTitle}>{opp.title}</h4>
          <span className={styles.oppSponsor}>{opp.sponsor}</span>
        </div>
        <div className={styles.scoreBadge} title="Atlas Match Score">
          <Sparkles size={12} className={styles.scoreIcon} />
          <span>{opp.score}%</span>
        </div>
      </div>

      <div className={styles.oppMeta}>
        <div className={styles.metaItem}>
          <Calendar size={13} />
          <span>{opp.deadline}</span>
        </div>
      </div>

      {showUpsell && (
        <div className={styles.inlineUpsell}>
          <div className={styles.upsellBadge}>⭐ PRO UPGRADE REQUIRED</div>
          <p>You have reached the limit of 20 saved opportunities. Upgrade to save unlimited opportunities.</p>
          <Link href="/settings/subscription" className={styles.upsellBtn}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      <div className={styles.oppActions}>
        <button
          className={`${styles.oppActionBtn} ${isSaved ? styles.oppActionBtnSaved : ''}`}
          onClick={handleSave}
          disabled={isSaving || isSaved}
        >
          <Save size={12} />
          <span>{isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <a
          href={opp.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.oppActionBtn}
        >
          <Compass size={12} />
          <span>View</span>
        </a>

        <button
          className={styles.oppActionBtn}
          onClick={() => onAskMore?.(opp.title)}
        >
          <HelpCircle size={12} />
          <span>Ask More</span>
        </button>
      </div>
    </div>
  );
}
