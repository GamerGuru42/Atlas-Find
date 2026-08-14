'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, RotateCcw, Clock } from 'lucide-react';
import styles from '@/app/discover/page.module.css';

interface SearchBarProps {
  initialSearch: string;
  onSearch: (query: string) => void;
  isLoading: boolean;
  searchError: boolean;
  onRetry: () => void;
  isLoggedIn: boolean;
}

export default function SearchBar({
  initialSearch,
  onSearch,
  isLoading,
  searchError,
  onRetry,
  isLoggedIn
}: SearchBarProps) {
  const [query, setQuery] = useState(initialSearch);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if initial value changes
  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atlas_search_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Debounce the query change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== initialSearch) {
        onSearch(query);
        // Add to history if not empty and not already there
        if (query.trim() && isLoggedIn) {
          saveToHistory(query.trim());
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const saveToHistory = (q: string) => {
    try {
      const updated = [q, ...history.filter(item => item !== q)].slice(0, 5);
      setHistory(updated);
      localStorage.setItem('atlas_search_history', JSON.stringify(updated));
    } catch {}
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSelectHistory = (selected: string) => {
    setQuery(selected);
    onSearch(selected);
    setShowHistory(false);
  };

  // Close history dropdown on click outside
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <div className={styles.searchBarWrapper} ref={containerRef}>
      <div className={`${styles.searchContainer} ${isFocused ? styles.searchFocused : ''}`}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search scholarships, countries, fields..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (history.length > 0) setShowHistory(true);
          }}
          onBlur={() => setIsFocused(false)}
          className={styles.searchInput}
        />
        
        {isLoading && (
          <Loader2 className={`${styles.spinnerIcon} ${styles.spin}`} size={16} />
        )}
        
        {query && !isLoading && (
          <button className={styles.clearSearchBtn} onClick={handleClear} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search History Dropdown */}
      {showHistory && history.length > 0 && (
        <div className={styles.historyDropdown}>
          <div className={styles.historyHeader}>
            <Clock size={12} />
            <span>Recent Searches</span>
          </div>
          {history.map((item, idx) => (
            <button
              key={idx}
              className={styles.historyItem}
              onMouseDown={() => handleSelectHistory(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error Alert Box */}
      {searchError && (
        <div className={styles.searchErrorBox}>
          <span>⚠️ Search unavailable. Showing all opportunities.</span>
          <button className={styles.searchRetryBtn} onClick={onRetry}>
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
