'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from './AISummary.module.css';

interface AISummaryProps {
  searchParams: Record<string, string>;
  opportunitiesCount: number;
  topOpportunities: any[];
}

export function AISummary({ searchParams, opportunitiesCount, topOpportunities }: AISummaryProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const prevParamsStr = useRef(JSON.stringify(searchParams));
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const currentParamsStr = JSON.stringify(searchParams);
    
    if (!hasStarted || prevParamsStr.current !== currentParamsStr) {
      setHasStarted(true);
      prevParamsStr.current = currentParamsStr;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      const fetchSummary = async () => {
        setIsLoading(true);
        setContent('');
        setError(false);
        try {
          const res = await fetch('/api/discover/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchParams, opportunitiesCount, topOpportunities }),
            signal: abortControllerRef.current?.signal,
          });
          
          if (!res.ok) throw new Error('Failed');
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let done = false;
          
          while (reader && !done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              setContent((prev) => prev + decoder.decode(value, { stream: true }));
            }
          }
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            setError(true);
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSummary();
    }
  }, [searchParams, opportunitiesCount, topOpportunities, hasStarted]);

  const isGenerating = isLoading && content === '';

  if (opportunitiesCount === 0) return null;

  // Pre-compute instant stats
  const closingSoonCount = topOpportunities.filter(o => {
    if (!o.deadline) return false;
    const diffDays = (new Date(o.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 14;
  }).length;

  const fullyFundedCount = topOpportunities.filter(o => 
    o.fundingType === 'fully_funded' || o.fundingType === 'FULLY_FUNDED'
  ).length;

  return (
    <div className={styles.aiContainer}>
      <div className={styles.aiHeader}>
        <Sparkles size={18} className={styles.aiIcon} />
        <h3>AI Analysis</h3>
      </div>

      {/* INSTANT STATS HEADER */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
        <span style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
          📊 {opportunitiesCount} opportunities match filters
        </span>
        {closingSoonCount > 0 && (
          <span style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
            ⏰ {closingSoonCount} closing in 14 days
          </span>
        )}
        {fullyFundedCount > 0 && (
          <span style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
            💎 {fullyFundedCount} fully-funded
          </span>
        )}
      </div>
      
      <div className={styles.aiContent}>
        {isGenerating ? (
          <div className={styles.loadingContainer}>
            <span className={styles.pulseDot}></span>
            <span className={styles.pulseDot}></span>
            <span className={styles.pulseDot}></span>
            <span style={{ marginLeft: '8px' }}>Generating detailed insights...</span>
          </div>
        ) : content ? (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className={styles.markdownContent}>
            <p>
              Use the filter bar to narrow results by host country, degree level, or discipline. Select any opportunity to view full eligibility details and application links.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
