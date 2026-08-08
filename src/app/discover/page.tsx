"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface CoverageDetails {
  tuition?: boolean;
  travel?: boolean;
  living?: boolean;
  insurance?: boolean;
  accommodation?: boolean;
  visa?: boolean;
  stipendAmount?: string;
}

interface Opportunity {
  id: string;
  title: string;
  sponsor: string;
  orgType: string;
  hostCountry: string;
  eligibleCountries: string[];
  disciplines: string[];
  degreeLevel: string[];
  fundingType: string;
  coverageDetails: CoverageDetails;
  deadline: string;
  opensDate?: string;
  updatedAt: string;
  applyUrl: string;
  sourceUrl: string;
  sourceDomain: string;
  trustTier: number;
  verificationStatus: string;
  description: string;
  eligibility: string;
  tags: string[];
}

const COUNTRIES = [
  'United Kingdom', 'Germany', 'France', 'Netherlands', 'Sweden', 'Switzerland',
  'Hungary', 'Turkey', 'United States', 'Canada', 'Japan', 'South Korea', 'China',
  'Saudi Arabia', 'Australia', 'New Zealand',
];

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [selectedFunding, setSelectedFunding] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const fetchOpportunities = useCallback(async (newOffset = 0, append = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCountry) params.set('country', selectedCountry);
      if (selectedDegree) params.set('level', selectedDegree);
      if (selectedFunding) params.set('fundingType', selectedFunding);
      params.set('limit', String(LIMIT));
      params.set('offset', String(newOffset));

      const res = await fetch(`/api/discover?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        console.error('API error:', data.error);
        return;
      }

      setOpportunities(prev => append ? [...prev, ...data.opportunities] : data.opportunities);
      setTotalCount(data.count);
      setHasMore(data.hasMore);
      setOffset(newOffset);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCountry, selectedDegree, selectedFunding]);

  // Fetch on mount and when filters change
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchOpportunities(0, false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchOpportunities]);

  const loadMore = () => {
    fetchOpportunities(offset + LIMIT, true);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCountry(null);
    setSelectedDegree(null);
    setSelectedFunding(null);
  };

  const hasActiveFilters = search || selectedCountry || selectedDegree || selectedFunding;

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Discover Opportunities
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Browse our verified database of scholarships, fellowships, and funded programs. Every listing is checked against its original source.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, country, field..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1 1 250px',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <select
          value={selectedCountry || ''}
          onChange={(e) => setSelectedCountry(e.target.value || null)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <option value="">All Countries</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={selectedDegree || ''}
          onChange={(e) => setSelectedDegree(e.target.value || null)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <option value="">All Degrees</option>
          <option value="bachelors">Bachelors</option>
          <option value="masters">Masters</option>
          <option value="phd">PhD</option>
          <option value="postdoc">Postdoc</option>
        </select>
        <select
          value={selectedFunding || ''}
          onChange={(e) => setSelectedFunding(e.target.value || null)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <option value="">All Funding</option>
          <option value="fully_funded">Fully Funded</option>
          <option value="partial">Partial</option>
          <option value="stipend_only">Stipend Only</option>
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        {isLoading ? 'Searching...' : `Showing ${opportunities.length} of ${totalCount} verified opportunities`}
      </p>

      {/* Loading skeleton */}
      {isLoading && opportunities.length === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '1.5rem',
                height: '280px',
                animation: 'pulse 1.5s ease-in-out infinite',
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Opportunity Grid */}
      {opportunities.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
          {opportunities.map((opp) => {
            const coverage = opp.coverageDetails as CoverageDetails;
            
            // Calculate Days Left
            const now = new Date();
            const deadline = new Date(opp.deadline);
            now.setHours(0,0,0,0);
            deadline.setHours(0,0,0,0);
            const timeDiff = deadline.getTime() - now.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            let urgencyColor = 'var(--text-secondary)';
            let urgencyBg = 'transparent';
            let urgencyText = '';
            let countdownText = '';
            
            if (daysLeft < 0) {
              urgencyColor = '#8b949e'; // Gray
              urgencyBg = 'rgba(139, 148, 158, 0.1)';
              urgencyText = 'Closed';
              countdownText = `Closed on ${deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
            } else if (daysLeft < 14) {
              urgencyColor = '#ff6b6b'; // Red
              urgencyBg = 'rgba(255, 107, 107, 0.1)';
              urgencyText = 'Closing Soon';
              countdownText = `${daysLeft} days left`;
            } else if (daysLeft <= 30) {
              urgencyColor = '#ffab00'; // Orange
              urgencyBg = 'rgba(255, 171, 0, 0.1)';
              urgencyText = 'Apply Soon';
              countdownText = `${daysLeft} days left`;
            } else {
              urgencyColor = 'var(--accent-primary, #00ff87)'; // Green
              urgencyBg = 'rgba(0, 255, 135, 0.1)';
              urgencyText = 'Plenty of Time';
              countdownText = `${daysLeft} days left`;
            }

            // Calculate hours since last verification
            const hoursSinceVerified = Math.max(1, Math.floor((new Date().getTime() - new Date(opp.updatedAt).getTime()) / (1000 * 60 * 60)));

            return (
              <div
                key={opp.id}
                className="glass-card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                    {opp.title}
                    {opp.verificationStatus !== 'verified' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.4rem',
                        background: 'rgba(255, 171, 0, 0.1)',
                        color: '#ffab00',
                        border: '1px solid rgba(255, 171, 0, 0.3)',
                        borderRadius: '4px',
                        marginLeft: '0.5rem',
                        verticalAlign: 'middle',
                      }}>
                        ⚠️ Under Review
                      </span>
                    )}
                  </h3>
                  <span style={{
                    flexShrink: 0,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: opp.fundingType === 'fully_funded' ? 'var(--accent-primary-dim, rgba(0,255,135,0.1))' : 'rgba(88,166,255,0.1)',
                    color: opp.fundingType === 'fully_funded' ? 'var(--accent-primary, #00ff87)' : 'var(--accent-secondary, #58a6ff)',
                    border: `1px solid ${opp.fundingType === 'fully_funded' ? 'rgba(0,255,135,0.25)' : 'rgba(88,166,255,0.25)'}`,
                  }}>
                    {opp.fundingType.replace(/_/g, ' ')}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{opp.sponsor}</p>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <span>📍 {opp.hostCountry}</span>
                  <span>🎓 {opp.degreeLevel.join(', ')}</span>
                </div>

                {/* Coverage */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {coverage.tuition && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary, #00ff87)', fontWeight: 500 }}>✓ Tuition</span>}
                  {coverage.travel && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary, #00ff87)', fontWeight: 500 }}>✓ Travel</span>}
                  {coverage.living && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary, #00ff87)', fontWeight: 500 }}>✓ Living</span>}
                  {coverage.insurance && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary, #00ff87)', fontWeight: 500 }}>✓ Insurance</span>}
                </div>

                {coverage.stipendAmount && (
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{coverage.stipendAmount}</p>
                )}

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {opp.description}
                </p>
                
                {/* Dates Section */}
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.8rem' }}>
                  {opp.opensDate && new Date(opp.opensDate) > new Date() && (
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <strong>Opens:</strong> {new Date(opp.opensDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Apply by:</strong> {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <span style={{
                      color: urgencyColor,
                      background: urgencyBg,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}>
                      {urgencyText} · {countdownText}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--accent-primary, #00ff87)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary, #00ff87)', display: 'inline-block' }} />
                    Verified {hoursSinceVerified}h ago
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>{opp.sourceDomain}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1,
                    background: 'var(--accent-primary, #00ff87)',
                    color: 'var(--bg-base, #0a0a0f)',
                    textAlign: 'center',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                  }}>
                    Apply →
                  </a>
                  <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1,
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-default)',
                    textAlign: 'center',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                  }}>
                    View Source
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && opportunities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No opportunities match your filters.</p>
          <p>Try adjusting your search or <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-primary, #00ff87)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>clear all filters</button>.</p>
        </div>
      )}

      {/* Load More */}
      {hasMore && !isLoading && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={loadMore}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-full, 50px)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Load More Opportunities
          </button>
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Can&apos;t find what you&apos;re looking for?</p>
        <Link href="/chat" style={{
          display: 'inline-block',
          background: 'var(--accent-primary, #00ff87)',
          color: 'var(--bg-base, #0a0a0f)',
          padding: '0.75rem 2rem',
          borderRadius: 'var(--radius-full, 50px)',
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          Ask Atlas — your AI strategist →
        </Link>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
