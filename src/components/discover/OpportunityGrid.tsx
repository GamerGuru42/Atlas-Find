'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, RefreshCw, Sparkles, XCircle } from 'lucide-react';
import Link from 'next/link';
import OpportunityCard from './OpportunityCard';
import styles from '@/app/discover/page.module.css';

interface OpportunityGridProps {
  opportunities: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  userTier: string;
  isLoggedIn: boolean;
  savedMap: Record<string, string>;
  onSaveOpp: (oppId: string) => Promise<boolean | 'limit_reached'>;
  onUnsaveOpp: (savedOppId: string) => Promise<boolean>;
  onSelectOpp: (opp: any) => void;
  onChangePage: (page: number) => void;
  sortValue: string;
  onChangeSort: (sort: string) => void;
  searchQuery: string;
  activeFilters: string[];
  onClearFilters: () => void;
  apiDelayed: boolean;
  onCancelRequest: () => void;
  onLoadMore: () => void;
}

export default function OpportunityGrid({
  opportunities,
  totalCount,
  currentPage,
  totalPages,
  isLoading,
  userTier,
  isLoggedIn,
  savedMap,
  onSaveOpp,
  onUnsaveOpp,
  onSelectOpp,
  onChangePage,
  sortValue,
  onChangeSort,
  searchQuery,
  activeFilters,
  onClearFilters,
  apiDelayed,
  onCancelRequest,
  onLoadMore
}: OpportunityGridProps) {
  
  const bottomObserverRef = useRef<HTMLDivElement>(null);

  // Setup infinite scroll observer for mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && currentPage < totalPages && !isLoading) {
          // If on mobile (screen width <= 768px), trigger load more
          if (window.innerWidth <= 768) {
            onLoadMore();
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = bottomObserverRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [currentPage, totalPages, isLoading, onLoadMore]);

  // Prefetch next page on hover of pagination button
  const handlePrefetchNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const query = new URLSearchParams(window.location.search);
      query.set('page', nextPage.toString());
      // Warm up browser cache
      fetch(`/api/discover?${query.toString()}`).catch(() => {});
    }
  };

  const renderEmptyState = () => {
    // 1. Database empty (0 total)
    if (totalCount === 0 && !searchQuery && activeFilters.length === 0) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyIllustration}>📦</div>
          <h3 className={styles.emptyTitle}>We&apos;re adding opportunities</h3>
          <p className={styles.emptyDesc}>
            Our verification agents are currently reviewing new listings. Check back shortly.
          </p>
          <Link href="/chat" className={styles.emptyCTA}>
            <MessageSquare size={16} />
            <span>Ask Atlas</span>
          </Link>
        </div>
      );
    }

    // 2. Search query returned no results
    if (searchQuery && opportunities.length === 0) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyIllustration}>🔍</div>
          <h3 className={styles.emptyTitle}>No matches for &quot;{searchQuery}&quot;</h3>
          <p className={styles.emptyDesc}>
            Try searching for other terms like &quot;Fully Funded&quot;, &quot;Europe&quot;, or &quot;Computer Science&quot;.
          </p>
          <div className={styles.emptyCTAGroup}>
            <button className={styles.suggestedTermBtn} onClick={onClearFilters}>
              Clear Search
            </button>
            <Link href="/chat" className={styles.emptyCTA}>
              <MessageSquare size={16} />
              <span>Ask Atlas</span>
            </Link>
          </div>
        </div>
      );
    }

    // 3. Filters returned no results
    if (activeFilters.length > 0 && opportunities.length === 0) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyIllustration}>❌</div>
          <h3 className={styles.emptyTitle}>Filters are too specific</h3>
          <p className={styles.emptyDesc}>
            No listings match your selected criteria. Try removing some filters.
          </p>
          <button className={styles.emptyCTA} onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      );
    }

    return null;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => onChangePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`${styles.pageNumber} ${currentPage === p ? styles.pageNumberActive : ''}`}
            onClick={() => onChangePage(p)}
          >
            {p}
          </button>
        ))}

        <button
          className={styles.pageBtn}
          onClick={() => onChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          onMouseEnter={handlePrefetchNextPage}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.gridContainer}>
      {/* Top Bar for Sorting & Summary */}
      <div className={styles.gridTopBar}>
        <span className={styles.resultsCount}>{totalCount} opportunities found</span>
        
        <div className={styles.sortContainer}>
          <span className={styles.sortLabel}>Sort by:</span>
          <select
            value={sortValue}
            onChange={(e) => onChangeSort(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="atlas_score">Atlas Score</option>
            <option value="deadline">Deadline (Soonest)</option>
            <option value="amount">Amount (Highest)</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* API Slow Delay Banner */}
      {apiDelayed && (
        <div className={styles.delayWarning}>
          <span>Taking longer than usual to fetch results...</span>
          <button className={styles.cancelRequestBtn} onClick={onCancelRequest}>
            Cancel
          </button>
        </div>
      )}

      {/* Opportunities Cards Grid */}
      {isLoading && opportunities.length === 0 ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonSponsor} />
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonBody} />
              <div className={styles.skeletonActions} />
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className={styles.grid}>
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                savedOpportunityId={savedMap[opp.id] || null}
                onSave={onSaveOpp}
                onUnsave={onUnsaveOpp}
                onSelect={() => onSelectOpp(opp)}
                isLoggedIn={isLoggedIn}
                userTier={userTier}
              />
            ))}
          </div>

          {/* Skeleton cards at bottom for mobile infinite scroll loading state */}
          {isLoading && opportunities.length > 0 && (
            <div className={styles.grid} style={{ marginTop: '1.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {/* Numbered pagination for desktop view */}
          <div className={styles.desktopOnly}>
            {renderPagination()}
          </div>

          {/* Observer tag at bottom of viewport */}
          <div ref={bottomObserverRef} style={{ height: '10px' }} />

          {/* Mobile end of content message */}
          {currentPage >= totalPages && totalPages > 1 && (
            <div className={`${styles.mobileOnly} ${styles.endOfContent}`}>
              You&apos;ve seen everything 🎉
            </div>
          )}
        </>
      )}
    </div>
  );
}
