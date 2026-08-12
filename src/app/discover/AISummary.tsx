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

  return (
    <div className={styles.aiContainer}>
      <div className={styles.aiHeader}>
        <Sparkles size={18} className={styles.aiIcon} />
        <h3>AI Analysis</h3>
      </div>
      
      <div className={styles.aiContent}>
        {isGenerating ? (
          <div className={styles.loadingContainer}>
            <span className={styles.pulseDot}></span>
            <span className={styles.pulseDot}></span>
            <span className={styles.pulseDot}></span>
            <span style={{ marginLeft: '8px' }}>Analyzing opportunities...</span>
          </div>
        ) : error ? (
          <div className={styles.errorText}>Failed to generate summary. Please try again.</div>
        ) : content ? (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div>Analyzing opportunities...</div>
        )}
      </div>
    </div>
  );
}
