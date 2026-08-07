"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { seedOpportunities } from '@/data/seed/opportunities';

const REGIONS: Record<string, string[]> = {
  'Europe': ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Italy', 'Spain', 'Czech Republic', 'Poland', 'Hungary'],
  'North America': ['United States', 'Canada'],
  'Asia': ['Japan', 'South Korea', 'China', 'Singapore', 'Malaysia', 'India'],
  'Oceania': ['Australia', 'New Zealand'],
  'Africa': ['South Africa', 'Nigeria', 'Ghana', 'Kenya', 'Egypt'],
  'Middle East': ['Turkey', 'UAE', 'Saudi Arabia', 'Qatar'],
};

function getRegion(country: string): string {
  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.includes(country)) return region;
  }
  return 'Other';
}

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [selectedFunding, setSelectedFunding] = useState<string | null>(null);

  const allRegions = useMemo(() => {
    const set = new Set(seedOpportunities.map(o => getRegion(o.hostCountry)));
    return Array.from(set).sort();
  }, []);

  const allDegrees = useMemo(() => {
    const set = new Set(seedOpportunities.flatMap(o => o.degreeLevel));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return seedOpportunities.filter(opp => {
      const matchesSearch = !search || 
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.sponsor.toLowerCase().includes(search.toLowerCase()) ||
        opp.hostCountry.toLowerCase().includes(search.toLowerCase()) ||
        opp.disciplines.some(d => d.toLowerCase().includes(search.toLowerCase()));
      
      const matchesRegion = !selectedRegion || getRegion(opp.hostCountry) === selectedRegion;
      const matchesDegree = !selectedDegree || opp.degreeLevel.includes(selectedDegree as any);
      const matchesFunding = !selectedFunding || opp.fundingType === selectedFunding;

      return matchesSearch && matchesRegion && matchesDegree && matchesFunding;
    });
  }, [search, selectedRegion, selectedDegree, selectedFunding]);

  const clearFilters = () => {
    setSearch('');
    setSelectedRegion(null);
    setSelectedDegree(null);
    setSelectedFunding(null);
  };

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
          value={selectedRegion || ''}
          onChange={(e) => setSelectedRegion(e.target.value || null)}
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
          <option value="">All Regions</option>
          {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
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
          {allDegrees.map(d => <option key={d} value={d} style={{ textTransform: 'capitalize' }}>{d}</option>)}
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
          <option value="tuition_only">Tuition Only</option>
        </select>
        {(search || selectedRegion || selectedDegree || selectedFunding) && (
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
        Showing {filtered.length} of {seedOpportunities.length} verified opportunities
      </p>

      {/* Opportunity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="glass-card"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{opp.title}</h3>
              <span style={{
                flexShrink: 0,
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: opp.fundingType === 'fully_funded' ? 'var(--accent-primary-dim)' : 'var(--accent-secondary-dim)',
                color: opp.fundingType === 'fully_funded' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                border: `1px solid ${opp.fundingType === 'fully_funded' ? 'var(--border-accent)' : 'rgba(88,166,255,0.25)'}`,
              }}>
                {opp.fundingType.replace('_', ' ')}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{opp.sponsor}</p>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span>📍 {opp.hostCountry}</span>
              <span>🎓 {opp.degreeLevel.join(', ')}</span>
            </div>

            {/* Coverage */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {opp.coverage.tuition && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>✓ Tuition</span>}
              {opp.coverage.travel && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>✓ Travel</span>}
              {opp.coverage.living && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>✓ Living</span>}
              {opp.coverage.insurance && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>✓ Insurance</span>}
            </div>

            {opp.coverage.stipendAmount && (
              <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{opp.coverage.stipendAmount}</p>
            )}

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {opp.description}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 6px var(--accent-primary-glow)' }} />
                Verified · {opp.sourceDomain}
              </div>
              <div>⏰ {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer" style={{
                flex: 1,
                background: 'var(--accent-primary)',
                color: 'var(--bg-base)',
                textAlign: 'center',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
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
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}>
                View Source
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No opportunities match your filters.</p>
          <p>Try adjusting your search or <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>clear all filters</button>.</p>
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Can&apos;t find what you&apos;re looking for?</p>
        <Link href="/chat" style={{
          display: 'inline-block',
          background: 'var(--accent-primary)',
          color: 'var(--bg-base)',
          padding: '0.75rem 2rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          Ask Atlas — your AI strategist →
        </Link>
      </div>
    </div>
  );
}
