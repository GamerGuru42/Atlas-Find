'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Search } from 'lucide-react'
import styles from './Onboarding.module.css'

const REGIONS = ['Popular', 'Africa', 'Europe', 'North America', 'Asia', 'Oceania', 'South America'] as const

const COUNTRIES = [
  // Popular
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Popular' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Popular' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Popular' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Popular' },
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Popular' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'Popular' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Popular' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Popular' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Popular' },
  
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa' },
  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  // North America
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  // Asia
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  // Oceania
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  // South America
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
]

interface CountrySelectorProps {
  onContinue: (countryCode: string) => void
}

export default function CountrySelector({ onContinue }: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    // Attempt auto-detect
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data?.country_code && !selectedCountry) {
          // Only select if it exists in our list (could expand list in real app)
          const exists = COUNTRIES.find(c => c.code === data.country_code)
          if (exists) {
            setSelectedCountry(data.country_code)
          }
        }
      })
      .catch(() => {})
  }, [selectedCountry])

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = REGIONS.map(region => ({
    region,
    countries: filteredCountries.filter(c => c.region === region)
  })).filter(g => g.countries.length > 0)

  const selectedData = COUNTRIES.find(c => c.code === selectedCountry)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.selectorContainer}
    >
      <div className={styles.headerText}>
        <h2 className={styles.title} style={{ fontSize: '1.875rem' }}>Where are you based?</h2>
        <p className={styles.subtitle}>This helps us show you relevant opportunities and local pricing.</p>
      </div>

      <div className={styles.relativeContainer}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.dropdownButton}
        >
          {selectedData ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{selectedData.flag}</span>
              <span style={{ fontWeight: 500 }}>{selectedData.name}</span>
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Select your country...</span>
          )}
          <ChevronDown style={{ width: '1.25rem', height: '1.25rem', opacity: 0.5 }} />
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input 
                type="text" 
                placeholder="Search countries..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {grouped.map(group => (
              <div key={group.region} style={{ marginBottom: '1rem' }}>
                <div className={styles.regionTitle}>
                  {group.region}
                </div>
                {group.countries.map(country => (
                  <button
                    key={`${group.region}-${country.code}`}
                    onClick={() => {
                      setSelectedCountry(country.code)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`${styles.countryOption} ${selectedCountry === country.code ? styles.countryOptionActive : ''}`}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.125rem' }}>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                    {selectedCountry === country.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        disabled={!selectedCountry}
        onClick={() => selectedCountry && onContinue(selectedCountry)}
        className={styles.buttonPrimary}
      >
        Continue
      </button>
    </motion.div>
  )
}
