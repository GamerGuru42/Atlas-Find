'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FIELDS_OF_STUDY = [
  'Engineering', 'Computer Science', 'Medicine', 'Business', 'Law', 'Arts', 'Science', 'Other'
]

const LEVELS = [
  'Undergraduate', 'Masters', 'PhD', 'Professional/Working'
]

export interface ProfileData {
  field_of_study?: string
  level?: string
  institution?: string
  graduation_year?: string
}

interface ProfileBuilderProps {
  onSave: (data: ProfileData) => void
  onSkip: () => void
  isSubmitting?: boolean
}

export default function ProfileBuilder({ onSave, onSkip, isSubmitting }: ProfileBuilderProps) {
  const [formData, setFormData] = useState<ProfileData>({})

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tell us a bit about you</h2>
        <p className="text-muted-foreground">This helps us personalize your experience. (Optional)</p>
      </div>

      <div className="space-y-4">
        {/* Field of Study */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Field of study</label>
          <div className="relative">
            <select 
              className="w-full appearance-none px-4 py-3 bg-card border rounded-xl hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.field_of_study || ''}
              onChange={(e) => handleChange('field_of_study', e.target.value)}
            >
              <option value="" disabled>Select field</option>
              {FIELDS_OF_STUDY.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Level */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Current level</label>
          <div className="relative">
            <select 
              className="w-full appearance-none px-4 py-3 bg-card border rounded-xl hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.level || ''}
              onChange={(e) => handleChange('level', e.target.value)}
            >
              <option value="" disabled>Select level</option>
              {LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Institution */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Current institution</label>
          <input 
            type="text"
            placeholder="e.g. Harvard University"
            className="w-full px-4 py-3 bg-card border rounded-xl hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={formData.institution || ''}
            onChange={(e) => handleChange('institution', e.target.value)}
          />
        </div>

        {/* Graduation Year */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Graduation year</label>
          <input 
            type="number"
            placeholder="e.g. 2026"
            min="1950"
            max="2040"
            className="w-full px-4 py-3 bg-card border rounded-xl hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={formData.graduation_year || ''}
            onChange={(e) => handleChange('graduation_year', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-3 pt-4">
        <button
          disabled={isSubmitting}
          onClick={() => onSave(formData)}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </button>
        <button
          disabled={isSubmitting}
          onClick={onSkip}
          className="w-full py-3.5 rounded-xl bg-transparent text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  )
}
