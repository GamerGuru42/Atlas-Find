"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Briefcase, GraduationCap, DollarSign, Filter, CheckCircle2, Calendar } from 'lucide-react';
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

  // Advanced Filters State
  const [selectedContinents, setSelectedContinents] = useState<string[]>(searchParams.get('continent')?.split(',').filter(Boolean) || []);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(searchParams.get('hostCountry')?.split(',').filter(Boolean) || []);
  const [selectedFunding, setSelectedFunding] = useState<string[]>(searchParams.get('fundingType')?.split(',').filter(Boolean) || []);
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>(searchParams.get('orgType')?.split(',').filter(Boolean) || []);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(searchParams.get('level')?.split(',').filter(Boolean) || []);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(searchParams.get('discipline')?.split(',').filter(Boolean) || []);

  // Data State
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Sync state to URL
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

  // Fetch counts and dynamic filters on mount
  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch('/api/discover/counts');
        if (res.ok) {
          const data = await res.json();
          setTypeCounts(data.typeCounts);
          setFilterOptions(data.filters);
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    }
    fetchCounts();
  }, []);

  // Fetch opportunities when params change
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/discover?${searchParams.toString()}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOpportunities(data.opportunities);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateURL({ search: e.target.value, page: '1' });
  };

  const handleTypeChange = (type: string) => {
    updateURL({ type: type === 'ALL' ? null : type, page: '1' });
  };

  const toggleArrayFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], value: string, paramKey: string) => {
    const updated = current.includes(value) ? current.filter(c => c !== value) : [...current, value];
    setter(updated);
    updateURL({ [paramKey]: updated.length > 0 ? updated.join(',') : null, page: '1' });
  };

  const clearAllFilters = () => {
    setSelectedContinents([]);
    setSelectedCountries([]);
    setSelectedFunding([]);
    setSelectedOrgTypes([]);
    setSelectedLevels([]);
    setSelectedDisciplines([]);
    updateURL({ continent: null, hostCountry: null, fundingType: null, orgType: null, level: null, discipline: null, search: null, type: null, page: '1' });
  };

  return (
    <div className={styles.container}>
      
      {/* Header & Sticky Tabs */}
      <div className={styles.header}>
        <h1 className={styles.title}>Discover</h1>
        <p className={styles.subtitle}>
          Browse our verified database of global opportunities. Use the tabs and filters to find the perfect match for your profile.
        </p>
      </div>

      <div className={styles.tabsScroll}>
        {OPPORTUNITY_TABS.map(tab => {
          const isActive = typeParam === tab.key;
          const count = tab.key === 'ALL' ? Object.values(typeCounts).reduce((a, b) => a + b, 0) : typeCounts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => handleTypeChange(tab.key)}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
            >
              {tab.emoji && <span>{tab.emoji}</span>}
              {tab.label}
              {count > 0 && (
                <span className={styles.tabCount}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.mainLayout}>
        
        {/* Sidebar Filters */}
        <div className={`${styles.sidebar} ${showFilters ? '' : styles.hiddenMobile}`}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchParam}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filtersTitle}>
            <Filter size={18}/> Filters
            <button onClick={clearAllFilters} className={styles.clearAllBtn}>Clear All</button>
          </div>

          {/* Funding Filter */}
          {filterOptions.fundingTypes && (
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Funding</h4>
              <div className={styles.filterList}>
                {filterOptions.fundingTypes.map((ft: string) => (
                  <label key={ft} className={styles.filterLabel} onClick={() => toggleArrayFilter(setSelectedFunding, selectedFunding, ft, 'fundingType')}>
                    <div className={`${styles.checkbox} ${selectedFunding.includes(ft) ? styles.checked : ''}`}>
                      {selectedFunding.includes(ft) && <CheckCircle2 size={12} />}
                    </div>
                    <span style={{ textTransform: 'capitalize' }}>{ft.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Country Filter */}
          {filterOptions.hostCountries && (
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Host Country</h4>
              <div className={styles.filterList}>
                {filterOptions.hostCountries.map((c: string) => (
                  <label key={c} className={styles.filterLabel} onClick={() => toggleArrayFilter(setSelectedCountries, selectedCountries, c, 'hostCountry')}>
                    <div className={`${styles.checkbox} ${selectedCountries.includes(c) ? styles.checked : ''}`}>
                      {selectedCountries.includes(c) && <CheckCircle2 size={12} />}
                    </div>
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

           {/* Degree Level Filter */}
           {filterOptions.degreeLevels && (
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Degree Level</h4>
              <div className={styles.filterList}>
                {filterOptions.degreeLevels.map((dl: string) => (
                  <label key={dl} className={styles.filterLabel} onClick={() => toggleArrayFilter(setSelectedLevels, selectedLevels, dl, 'level')}>
                    <div className={`${styles.checkbox} ${selectedLevels.includes(dl) ? styles.checked : ''}`}>
                      {selectedLevels.includes(dl) && <CheckCircle2 size={12} />}
                    </div>
                    <span style={{ textTransform: 'capitalize' }}>{dl}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.mobileHeader}>
            <button onClick={() => setShowFilters(!showFilters)} className={styles.mobileFilterToggle}>
              <Filter size={16} /> Filters
            </button>
            <span className={styles.resultsCount}>{totalCount} results</span>
          </div>

          {isLoading ? (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={styles.loadingCard} />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className={styles.emptyState}>
              <Search className={styles.emptyIcon} size={48} />
              <h3 className={styles.emptyTitle}>No opportunities match your filters</h3>
              <p className={styles.emptyDesc}>
                Try clearing your search or ask Atlas to find something for you.
              </p>
              <div className={styles.emptyActions}>
                <button onClick={clearAllFilters} className={styles.primaryBtn}>
                  Clear Filters
                </button>
                <Link href="/chat" className={styles.secondaryBtn}>
                  Ask Atlas AI
                </Link>
              </div>
            </div>
          ) : (
            <>
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
              <div className={styles.resultsCount} style={{ marginBottom: '1rem' }}>
                Showing {opportunities.length} of {totalCount} opportunities
              </div>
              <div className={styles.grid}>
                {opportunities.map((opp) => (
                  <div key={opp.id} className={styles.card} onClick={() => updateURL({ modal: opp.id })}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardType}>
                        {opp.type.replace('_', ' ')}
                      </span>
                      {opp.trustTier === 1 && (
                        <span title="Verified Source" className={styles.cardVerified}>
                          <CheckCircle2 size={16} />
                        </span>
                      )}
                    </div>
                    
                    <h3 className={styles.cardTitle}>{opp.title}</h3>
                    <p className={styles.cardSponsor}><Briefcase size={14}/> {opp.sponsor}</p>
                    
                    <div className={styles.cardDetails}>
                      <div className={styles.cardDetailItem}>
                        <MapPin size={14} className={styles.cardDetailIcon} />
                        {opp.hostCountry}
                      </div>
                      <div className={styles.cardDetailItem}>
                        <DollarSign size={14} className={styles.cardDetailIcon} />
                        <span style={{ textTransform: 'capitalize' }}>{opp.fundingType?.replace('_', ' ')}</span>
                      </div>
                      <div className={styles.cardDetailItem} title="Verified Application Deadline">
                        <Calendar size={14} className={styles.cardDetailIcon} />
                        <span style={{ fontWeight: 600, marginRight: '4px' }}>Deadline:</span> 
                        {new Date(opp.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {new Date(opp.deadline) < new Date() ? (
                          <span style={{ marginLeft: '8px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                            Closed
                          </span>
                        ) : opp.opensDate && new Date(opp.opensDate) > new Date() ? (
                          <span style={{ marginLeft: '8px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                            Opens {new Date(opp.opensDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        ) : (
                          <span style={{ marginLeft: '8px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                            Applications Open
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardDate}>Added {new Date(opp.createdAt).toLocaleDateString()}</span>
                      <button className={styles.cardButton}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    disabled={pageParam <= 1}
                    onClick={() => updateURL({ page: String(pageParam - 1) })}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  <div className={styles.pageInfo}>
                    Page {pageParam} of {totalPages}
                  </div>
                  <button 
                    disabled={pageParam >= totalPages}
                    onClick={() => updateURL({ page: String(pageParam + 1) })}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalId && <OpportunityModal id={modalId} onClose={() => updateURL({ modal: null })} />}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Discover...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
