"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Briefcase, GraduationCap, DollarSign, Filter, ChevronDown, CheckCircle2, Calendar } from 'lucide-react';
import { OpportunityModal } from './OpportunityModal';

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
    <div style={{ minHeight: 'calc(100vh - 72px)' }} className="bg-black text-white pb-20">
      
      {/* Header & Sticky Tabs */}
      <div className="sticky top-[72px] z-30 bg-black/80 backdrop-blur-xl border-b border-[var(--border-default)] pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Discover</h1>
              <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
                Browse our verified database of global opportunities. Use the tabs and filters to find the perfect match for your profile.
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {OPPORTUNITY_TABS.map(tab => {
              const isActive = typeParam === tab.key;
              const count = tab.key === 'ALL' ? Object.values(typeCounts).reduce((a, b) => a + b, 0) : typeCounts[tab.key] || 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTypeChange(tab.key)}
                  className={`snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-semibold
                    ${isActive 
                      ? 'bg-[rgba(0,255,135,0.1)] border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                      : 'bg-transparent border-[var(--border-default)] text-[var(--text-secondary)] hover:text-white hover:border-white/20'}`}
                >
                  {tab.emoji && <span>{tab.emoji}</span>}
                  {tab.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ml-1 ${isActive ? 'bg-[rgba(0,255,135,0.2)] text-[var(--accent-primary)]' : 'bg-white/10 text-white'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-[200px] space-y-6">
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchParam}
                onChange={handleSearch}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-default)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--accent-primary)] transition"
              />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                <Filter size={14}/> Filters
              </h3>
              <button onClick={clearAllFilters} className="text-xs text-[var(--accent-primary)] hover:underline">Clear All</button>
            </div>

            {/* Funding Filter */}
            {filterOptions.fundingTypes && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Funding</h4>
                <div className="space-y-2">
                  {filterOptions.fundingTypes.map((ft: string) => (
                    <label key={ft} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedFunding.includes(ft) ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-black' : 'border-[var(--border-default)] group-hover:border-white/40'}`}>
                        {selectedFunding.includes(ft) && <CheckCircle2 size={12} />}
                      </div>
                      <span className="capitalize">{ft.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Country Filter */}
            {filterOptions.hostCountries && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Host Country</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {filterOptions.hostCountries.map((c: string) => (
                    <label key={c} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedCountries.includes(c) ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-black' : 'border-[var(--border-default)] group-hover:border-white/40'}`}>
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
              <div>
                <h4 className="text-sm font-semibold mb-2">Degree Level</h4>
                <div className="space-y-2">
                  {filterOptions.degreeLevels.map((dl: string) => (
                    <label key={dl} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedLevels.includes(dl) ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-black' : 'border-[var(--border-default)] group-hover:border-white/40'}`}>
                        {selectedLevels.includes(dl) && <CheckCircle2 size={12} />}
                      </div>
                      <span className="capitalize">{dl}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center md:hidden">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm border border-[var(--border-default)] px-4 py-2 rounded-lg">
              <Filter size={16} /> Filters
            </button>
            <span className="text-sm text-[var(--text-secondary)]">{totalCount} results</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-default)] animate-pulse" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface-elevated)]">
              <Search className="mx-auto text-[var(--text-secondary)] mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">No opportunities found</h3>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
              <button onClick={clearAllFilters} className="mt-6 px-6 py-2 bg-[var(--accent-primary)] text-black font-semibold rounded-lg hover:bg-[#00e67a] transition">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:block mb-4 text-sm text-[var(--text-secondary)]">
                Showing {opportunities.length} of {totalCount} opportunities
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="flex flex-col bg-[var(--bg-surface-elevated)] rounded-2xl p-5 border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,255,135,0.1)] group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-white/5 rounded-md text-[var(--text-secondary)]">
                        {opp.type.replace('_', ' ')}
                      </span>
                      {opp.trustTier === 1 && <span title="Verified Source"><CheckCircle2 size={16} className="text-blue-400" /></span>}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-[var(--accent-primary)] transition-colors">{opp.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 flex items-center gap-1.5"><Briefcase size={14}/> {opp.sponsor}</p>
                    
                    <div className="mt-auto space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <MapPin size={14} className="text-white/50" />
                        {opp.hostCountry}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <DollarSign size={14} className="text-white/50" />
                        <span className="capitalize">{opp.fundingType?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Calendar size={14} className="text-white/50" />
                        Due: {new Date(opp.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    <button 
                      onClick={() => updateURL({ modal: opp.id })}
                      className="w-full py-2.5 rounded-xl border border-[var(--border-default)] font-semibold text-sm hover:bg-[var(--accent-primary)] hover:text-black hover:border-[var(--accent-primary)] transition-all"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button 
                    disabled={pageParam <= 1}
                    onClick={() => updateURL({ page: String(pageParam - 1) })}
                    className="px-4 py-2 border border-[var(--border-default)] rounded-lg disabled:opacity-50 hover:bg-white/5"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-4 font-semibold text-sm">
                    Page {pageParam} of {totalPages}
                  </div>
                  <button 
                    disabled={pageParam >= totalPages}
                    onClick={() => updateURL({ page: String(pageParam + 1) })}
                    className="px-4 py-2 border border-[var(--border-default)] rounded-lg disabled:opacity-50 hover:bg-white/5"
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
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[var(--accent-primary)]">Loading Discover...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
