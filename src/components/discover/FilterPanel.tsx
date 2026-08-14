'use client';

import React from 'react';
import { CheckCircle2, Filter, X } from 'lucide-react';
import styles from '@/app/discover/page.module.css';

interface FilterPanelProps {
  filterOptions: {
    hostCountries?: string[];
    degreeLevels?: string[];
    fundingTypes?: string[];
    orgTypes?: string[];
    disciplines?: string[];
    continents?: string[];
  };
  selectedFunding: string[];
  selectedCountries: string[];
  selectedLevels: string[];
  selectedDisciplines: string[];
  selectedOrgTypes: string[];
  onToggleFilter: (type: string, value: string) => void;
  onClearAll: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function FilterPanel({
  filterOptions,
  selectedFunding,
  selectedCountries,
  selectedLevels,
  selectedDisciplines,
  selectedOrgTypes,
  onToggleFilter,
  onClearAll,
  isOpenMobile,
  onCloseMobile
}: FilterPanelProps) {

  const renderFilterSection = (
    title: string,
    options: string[] | undefined,
    selected: string[],
    paramKey: string
  ) => {
    if (!options || options.length === 0) return null;
    return (
      <div className={styles.filterSection}>
        <h4 className={styles.filterSectionTitle}>{title}</h4>
        <div className={styles.filterList}>
          {options.map((opt: string) => {
            const isChecked = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className={`${styles.filterLabel} ${isChecked ? styles.filterLabelChecked : ''}`}
                onClick={() => onToggleFilter(paramKey, opt)}
              >
                <div className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}>
                  {isChecked && <CheckCircle2 size={12} />}
                </div>
                <span className={styles.filterTextLabel}>{opt.replace('_', ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const hasAnyActiveFilter = 
    selectedFunding.length > 0 ||
    selectedCountries.length > 0 ||
    selectedLevels.length > 0 ||
    selectedDisciplines.length > 0 ||
    selectedOrgTypes.length > 0;

  const content = (
    <div className={styles.filterPanelContent}>
      <div className={styles.filtersTitle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} />
          <span>Filters</span>
        </div>
        {hasAnyActiveFilter && (
          <button onClick={onClearAll} className={styles.clearAllBtn}>
            Clear All
          </button>
        )}
      </div>

      {renderFilterSection('Funding', filterOptions.fundingTypes, selectedFunding, 'fundingType')}
      {renderFilterSection('Host Country', filterOptions.hostCountries, selectedCountries, 'hostCountry')}
      {renderFilterSection('Degree Level', filterOptions.degreeLevels, selectedLevels, 'level')}
      {renderFilterSection('Discipline', filterOptions.disciplines, selectedDisciplines, 'discipline')}
      {renderFilterSection('Org Type', filterOptions.orgTypes, selectedOrgTypes, 'orgType')}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <div className={`${styles.sidebar} ${styles.desktopOnly}`}>
        {content}
      </div>

      {/* Mobile Bottom Sheet Layout */}
      {isOpenMobile && (
        <div className={styles.bottomSheetOverlay} onClick={onCloseMobile}>
          <div className={styles.bottomSheet} onClick={e => e.stopPropagation()}>
            <div className={styles.bottomSheetHeader}>
              <div className={styles.bottomSheetBar} />
              <button className={styles.bottomSheetClose} onClick={onCloseMobile}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.bottomSheetBody}>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
