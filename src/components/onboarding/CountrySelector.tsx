'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Search, MapPin } from 'lucide-react'
import styles from './Onboarding.module.css'

import COUNTRIES from '@/lib/countries.json'

const REGIONS = ['Popular', ...Array.from(new Set(COUNTRIES.map(c => c.region))).filter(r => r !== 'Popular')].sort((a, b) => {
  if (a === 'Popular') return -1
  if (b === 'Popular') return 1
  return a.localeCompare(b)
})

interface CountrySelectorProps {
  onContinue: (countryCode: string) => void
  initialCountryCode?: string | null
}

export default function CountrySelector({ onContinue, initialCountryCode }: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(initialCountryCode || null)
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    if (selectedCountry) return

    // 1. Try internal Vercel IP header detection first
    fetch('/api/geo/detect')
      .then(res => res.json())
      .then(data => {
        if (data?.countryCode) {
          const code = data.countryCode.toUpperCase()
          const exists = COUNTRIES.find(c => c.code === code)
          if (exists) {
            setSelectedCountry(code)
            setIsAutoDetected(true)
            return
          }
        }

        // 2. Secondary Fallback: If Vercel headers missing (e.g. dev/VPN/proxy), fallback to client-side IP lookup
        return fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(fallbackData => {
            if (fallbackData?.country_code) {
              const code = fallbackData.country_code.toUpperCase()
              const exists = COUNTRIES.find(c => c.code === code)
              if (exists) {
                setSelectedCountry(code)
                setIsAutoDetected(true)
              }
            }
          })
      })
      .catch((err) => {
        console.error('Geo detection error:', err)
      })
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

        {isAutoDetected && selectedData && (
          <p style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.8125rem', 
            color: '#64748b', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.375rem' 
          }}>
            <MapPin size={13} style={{ color: '#3b82f6' }} />
            Detected from your location. Change if incorrect.
          </p>
        )}

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
                      setIsAutoDetected(false)
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
