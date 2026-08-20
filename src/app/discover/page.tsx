'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, Sparkles } from 'lucide-react';
import SearchBar from '@/components/discover/SearchBar';
import FilterPanel from '@/components/discover/FilterPanel';
import OpportunityGrid from '@/components/discover/OpportunityGrid';
import { OpportunityModal } from './OpportunityModal';
import { AISummary } from './AISummary';
import styles from './page.module.css';

const OPPORTUNITY_TABS = [
  { key: 'ALL', label: 'All', emoji: '' },
  { key: 'SCHOLARSHIP', label: 'Scholarships', emoji: '🎓' },
  { key: 'INTERNSHIP', label: 'Internships', emoji: '💼' },
  { key: 'APPRENTICESHIP', label: 'Apprenticeships', emoji: '🔧' },
  { key: 'FELLOWSHIP', label: 'Fellowships', emoji: '🔬' },
  { key: 'GRANT', label: 'Grants', emoji: '💰' },
  { key: 'EXCHANGE', label: 'Exchanges', emoji: '🌍' },
  { key: 'RESEARCH_POSITION', label: 'Research', emoji: '🧪' },
  { key: 'WORK_STUDY', label: 'Work Study', emoji: '💼' }
] as const;

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params State
  const modalId = searchParams.get('modal');
  const typeParam = searchParams.get('type') || 'ALL';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  const sortParam = searchParams.get('sort') || '';

  // Advanced Filters State
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>([]);

  // Data State
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // User tracker & tier mappings
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTier, setUserTier] = useState('free');
  const [savedMap, setSavedMap] = useState<Record<string, string>>({}); // opportunityId -> savedOpportunityId

  // API latency handlers
  const [apiDelayed, setApiDelayed] = useState(false);
  const latencyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync state to URL params helper
  const updateURL = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/discover?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Initial authentication & tracked items load
  const loadUserTrackerData = async () => {
    try {
      const res = await fetch('/api/tracker');
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
        setUserTier(data.userTier || 'free');
        if (data.success && data.trackedItems) {
          const mapping: Record<string, string> = {};
          data.trackedItems.forEach((item: any) => {
            if (item.opportunityId) {
              mapping[item.opportunityId] = item.id;
            }
          });
          setSavedMap(mapping);
        }
      }
    } catch (e) {
      console.error('Error loading user tracker mapping:', e);
    }
  };

  useEffect(() => {
    loadUserTrackerData();
  }, []);

  // Fetch dynamic categories and distinct filter options once on mount
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await fetch('/api/discover/counts');
        if (res.ok) {
          const data = await res.json();
          setTypeCounts(data.typeCounts || {});
          setFilterOptions(data.filters || {});

          // Parse and validate URL filters against the valid options returned by the server
          const validFunding = data.filters.fundingTypes || [];
          const validCountries = data.filters.hostCountries || [];
          const validLevels = data.filters.degreeLevels || [];
          const validDisciplines = data.filters.disciplines || [];
          const validOrgTypes = data.filters.orgTypes || [];

          setSelectedFunding((searchParams.get('fundingType')?.split(',') || []).filter(v => validFunding.includes(v)));
          setSelectedCountries((searchParams.get('hostCountry')?.split(',') || []).filter(v => validCountries.includes(v)));
          setSelectedLevels((searchParams.get('level')?.split(',') || []).filter(v => validLevels.includes(v)));
          setSelectedDisciplines((searchParams.get('discipline')?.split(',') || []).filter(v => validDisciplines.includes(v)));
          setSelectedOrgTypes((searchParams.get('orgType')?.split(',') || []).filter(v => validOrgTypes.includes(v)));
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    }
    fetchMetadata();
  }, []);

  // Sync URL parameters changes to active selected state options
  useEffect(() => {
    if (!filterOptions.fundingTypes) return;

    const validFunding = filterOptions.fundingTypes || [];
    const validCountries = filterOptions.hostCountries || [];
    const validLevels = filterOptions.degreeLevels || [];
    const validDisciplines = filterOptions.disciplines || [];
    const validOrgTypes = filterOptions.orgTypes || [];

    setSelectedFunding((searchParams.get('fundingType')?.split(',') || []).filter(v => validFunding.includes(v)));
    setSelectedCountries((searchParams.get('hostCountry')?.split(',') || []).filter(v => validCountries.includes(v)));
    setSelectedLevels((searchParams.get('level')?.split(',') || []).filter(v => validLevels.includes(v)));
    setSelectedDisciplines((searchParams.get('discipline')?.split(',') || []).filter(v => validDisciplines.includes(v)));
    setSelectedOrgTypes((searchParams.get('orgType')?.split(',') || []).filter(v => validOrgTypes.includes(v)));
  }, [searchParams, filterOptions]);

  // Set default sorting based on guest vs user
  const effectiveSort = sortParam || (isLoggedIn ? 'atlas_score' : 'newest');

  // Cancel latency timers
  const clearLatencyTimer = () => {
    if (latencyTimerRef.current) {
      clearTimeout(latencyTimerRef.current);
      latencyTimerRef.current = null;
    }
    setApiDelayed(false);
  };

  // Fetch opportunities with debouncing + latency checks
  const fetchOpportunities = async (isLoadMore = false) => {
    clearLatencyTimer();
    setSearchError(false);

    // Cancel previous ongoing fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Start 3-second latency warning timer
    latencyTimerRef.current = setTimeout(() => {
      setApiDelayed(true);
    }, 3000);

    if (!isLoadMore) {
      setIsLoading(true);
    }

    try {
      const query = new URLSearchParams(searchParams.toString());
      // Ensure effective sorting parameter is in the payload
      query.set('sort', effectiveSort);

      const res = await fetch(`/api/discover?${query.toString()}`, {
        signal: controller.signal
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      // Validate page number
      if (pageParam > data.totalPages && data.totalPages > 0) {
        updateURL({ page: '1' });
        return;
      }

      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);

      if (isLoadMore) {
        // Infinite scroll: append results
        setOpportunities(prev => {
          const existingIds = new Set(prev.map(o => o.id));
          const newOpps = data.opportunities.filter((o: any) => !existingIds.has(o.id));
          return [...prev, ...newOpps];
        });
      } else {
        // Page navigation: replace results
        setOpportunities(data.opportunities);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Fetch request aborted');
        return;
      }
      console.error('Discover fetch error:', err);
      setSearchError(true);
      setOpportunities([]);
    } finally {
      clearLatencyTimer();
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Listen to parameters changes
  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      // If page is 1, replace data. If page > 1, check if mobile infinite scroll or desktop page change.
      // Since fetchOpportunities handles layout updates, we pass standard true/false based on width
      const isMobileLoadMore = typeof window !== 'undefined' && window.innerWidth <= 768 && pageParam > 1;
      fetchOpportunities(isMobileLoadMore);
    }, 50);

    return () => clearTimeout(debounceFetch);
  }, [searchParams, effectiveSort]);

  const handleSearchSubmit = (query: string) => {
    updateURL({ search: query ? query : null, page: '1' });
  };

  const handleToggleFilter = (key: string, value: string) => {
    let current: string[] = [];
    let setter: React.Dispatch<React.SetStateAction<string[]>>;

    if (key === 'fundingType') { current = selectedFunding; setter = setSelectedFunding; }
    else if (key === 'hostCountry') { current = selectedCountries; setter = setSelectedCountries; }
    else if (key === 'level') { current = selectedLevels; setter = setSelectedLevels; }
    else if (key === 'discipline') { current = selectedDisciplines; setter = setSelectedDisciplines; }
    else { current = selectedOrgTypes; setter = setSelectedOrgTypes; }

    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    setter(updated);
    updateURL({ [key]: updated.length > 0 ? updated.join(',') : null, page: '1' });
  };

  const clearAllFilters = () => {
    setSelectedFunding([]);
    setSelectedCountries([]);
    setSelectedLevels([]);
    setSelectedDisciplines([]);
    setSelectedOrgTypes([]);
    updateURL({
      fundingType: null,
      hostCountry: null,
      level: null,
      discipline: null,
      orgType: null,
      search: null,
      type: null,
      page: '1'
    });
  };

  const handleSaveOpportunity = async (oppId: string): Promise<boolean | 'limit_reached'> => {
    try {
      const res = await fetch('/api/tracker/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: oppId, status: 'saved' })
      });
      const data = await res.json();
      if (res.status === 403 && data.error === 'limit_reached') {
        return 'limit_reached';
      }
      if (data.success && data.savedRecord) {
        setSavedMap(prev => ({ ...prev, [oppId]: data.savedRecord.id }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleUnsaveOpportunity = async (savedOppId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/tracker/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedOpportunityId: savedOppId })
      });
      const data = await res.json();
      if (data.success) {
        setSavedMap(prev => {
          const next = { ...prev };
          const key = Object.keys(next).find(k => next[k] === savedOppId);
          if (key) delete next[key];
          return next;
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    clearLatencyTimer();
    setIsLoading(false);
  };

  const handleLoadMoreMobile = () => {
    const nextPage = pageParam + 1;
    updateURL({ page: String(nextPage) });
  };

  const activeChips: { key: string; value: string; label: string }[] = [];
  selectedFunding.forEach(v => activeChips.push({ key: 'fundingType', value: v, label: `Funding: ${v}` }));
  selectedCountries.forEach(v => activeChips.push({ key: 'hostCountry', value: v, label: `Country: ${v}` }));
  selectedLevels.forEach(v => activeChips.push({ key: 'level', value: v, label: `Level: ${v}` }));
  selectedDisciplines.forEach(v => activeChips.push({ key: 'discipline', value: v, label: `Discipline: ${v}` }));
  selectedOrgTypes.forEach(v => activeChips.push({ key: 'orgType', value: v, label: `Org: ${v}` }));

  // Scroll to results anchor on tab category change
  const handleCategorySelect = (key: string) => {
    updateURL({ type: key === 'ALL' ? null : key, page: '1' });
    const target = document.getElementById('results-view');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Discover Pathways</h1>
        <p className={styles.subtitle}>
          Search and sort our database of international fellowships, scholarships, and internship positions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className={styles.tabsScroll}>
        {OPPORTUNITY_TABS.map(tab => {
          const isActive = typeParam === tab.key;
          const count = tab.key === 'ALL' 
            ? Object.values(typeCounts).reduce((a, b) => a + b, 0) 
            : typeCounts[tab.key] || 0;
          
          return (
            <button
              key={tab.key}
              onClick={() => handleCategorySelect(tab.key)}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
            >
              {tab.emoji && <span>{tab.emoji}</span>}
              <span>{tab.label}</span>
              {count > 0 ? (
                <span className={styles.tabCount}>{count}</span>
              ) : (
                tab.key !== 'ALL' && <span className={styles.comingSoonBadge}>Coming soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Context Summary Panel */}
      {opportunities.length > 0 && (
        <AISummary
          searchParams={{
            q: searchParam || '',
            type: typeParam,
            funding: selectedFunding.join(','),
            hostCountry: selectedCountries.join(','),
            level: selectedLevels.join(',')
          }}
          opportunitiesCount={totalCount}
          topOpportunities={opportunities.slice(0, 5)}
        />
      )}

      {/* Main Discover Layout */}
      <div className={styles.mainLayout} id="results-view">
        
        {/* Left Side: Search & Desktop Filter Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <SearchBar
            initialSearch={searchParam}
            onSearch={handleSearchSubmit}
            isLoading={isLoading}
            searchError={searchError}
            onRetry={() => fetchOpportunities(false)}
            isLoggedIn={isLoggedIn}
          />
          
          <FilterPanel
            filterOptions={filterOptions}
            selectedFunding={selectedFunding}
            selectedCountries={selectedCountries}
            selectedLevels={selectedLevels}
            selectedDisciplines={selectedDisciplines}
            selectedOrgTypes={selectedOrgTypes}
            onToggleFilter={handleToggleFilter}
            onClearAll={clearAllFilters}
            isOpenMobile={showFilters}
            onCloseMobile={() => setShowFilters(false)}
          />
        </div>

        {/* Right Side: Opportunities list/grid & mobile toggles */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Mobile Filter actions trigger */}
          <div className={`${styles.mobileOnly} ${styles.mobileHeader}`} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowFilters(true)} className={styles.mobileFilterToggle}>
              <Filter size={16} /> Filters
            </button>
          </div>

          {/* Removable Active Chips Container */}
          {activeChips.length > 0 && (
            <div className={styles.activeChipsContainer}>
              {activeChips.map((chip, idx) => (
                <div key={idx} className={styles.filterChip}>
                  <span>{chip.label}</span>
                  <button onClick={() => handleToggleFilter(chip.key, chip.value)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button onClick={clearAllFilters} className={styles.clearFiltersChip}>
                Clear all filters
              </button>
            </div>
          )}

          {/* Unified listings Grid */}
          <OpportunityGrid
            opportunities={opportunities}
            totalCount={totalCount}
            currentPage={pageParam}
            totalPages={totalPages}
            isLoading={isLoading}
            userTier={userTier}
            isLoggedIn={isLoggedIn}
            savedMap={savedMap}
            onSaveOpp={handleSaveOpportunity}
            onUnsaveOpp={handleUnsaveOpportunity}
            onSelectOpp={(opp) => updateURL({ modal: opp.id })}
            onChangePage={(page) => updateURL({ page: String(page) })}
            sortValue={effectiveSort}
            onChangeSort={(sort) => updateURL({ sort, page: '1' })}
            searchQuery={searchParam}
            activeFilters={activeChips.map(c => c.label)}
            onClearFilters={clearAllFilters}
            apiDelayed={apiDelayed}
            onCancelRequest={handleCancelRequest}
            onLoadMore={handleLoadMoreMobile}
          />
        </div>
      </div>

      {/* Details View Modal */}
      {modalId && <OpportunityModal id={modalId} onClose={() => updateURL({ modal: null })} />}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading Discover Pathways...
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
