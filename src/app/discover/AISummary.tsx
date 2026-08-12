'use client';

import { useChat } from 'ai/react';
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
  const { messages, append, isLoading, error } = useChat({
    api: '/api/discover/summary',
  });
  
  // Track changes in search parameters to trigger new summaries
  const prevParamsStr = useRef(JSON.stringify(searchParams));

  useEffect(() => {
    const currentParamsStr = JSON.stringify(searchParams);
    
    // Auto-fetch summary when component mounts or when filters change
    if (!hasStarted || prevParamsStr.current !== currentParamsStr) {
      setHasStarted(true);
      prevParamsStr.current = currentParamsStr;
      
      append({
        role: 'user',
        content: JSON.stringify({ searchParams, opportunitiesCount, topOpportunities }),
      });
    }
  }, [searchParams, opportunitiesCount, topOpportunities, append, hasStarted]);

  const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isGenerating = isLoading && (!latestMessage || latestMessage.role !== 'assistant' || latestMessage.content === '');

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
        ) : latestMessage && latestMessage.role === 'assistant' ? (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{latestMessage.content}</ReactMarkdown>
          </div>
        ) : (
          <div>Analyzing opportunities...</div>
        )}
      </div>
    </div>
  );
}
