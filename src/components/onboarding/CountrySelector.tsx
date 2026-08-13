'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Search } from 'lucide-react'

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
      className="w-full max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Where are you based?</h2>
        <p className="text-muted-foreground">This helps us show you relevant opportunities and local pricing.</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-card border rounded-xl hover:bg-accent transition-colors"
        >
          {selectedData ? (
            <span className="flex items-center gap-2">
              <span className="text-xl">{selectedData.flag}</span>
              <span className="font-medium">{selectedData.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select your country...</span>
          )}
          <ChevronDown className="w-5 h-5 opacity-50" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-popover border rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto">
            <div className="flex items-center px-3 pb-2 border-b sticky top-0 bg-popover z-10 mb-2">
              <Search className="w-4 h-4 mr-2 opacity-50" />
              <input 
                type="text" 
                placeholder="Search countries..." 
                className="w-full bg-transparent outline-none text-sm py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {grouped.map(group => (
              <div key={group.region} className="mb-4 last:mb-0">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedCountry === country.code ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                    {selectedCountry === country.code && <Check className="w-4 h-4" />}
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
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        Continue
      </button>
    </motion.div>
  )
}
