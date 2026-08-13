'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './Onboarding.module.css'

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
      className={styles.selectorContainer}
    >
      <div className={styles.headerText}>
        <h2 className={styles.title} style={{ fontSize: '1.875rem' }}>Tell us a bit about you</h2>
        <p className={styles.subtitle}>This helps us personalize your experience. (Optional)</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Field of Study */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Field of study</label>
          <div className={styles.relativeContainer}>
            <select 
              className={styles.input}
              value={formData.field_of_study || ''}
              onChange={(e) => handleChange('field_of_study', e.target.value)}
            >
              <option value="" disabled>Select field</option>
              {FIELDS_OF_STUDY.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <ChevronDown className={styles.chevronIcon} size={16} />
          </div>
        </div>

        {/* Level */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Current level</label>
          <div className={styles.relativeContainer}>
            <select 
              className={styles.input}
              value={formData.level || ''}
              onChange={(e) => handleChange('level', e.target.value)}
            >
              <option value="" disabled>Select level</option>
              {LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            <ChevronDown className={styles.chevronIcon} size={16} />
          </div>
        </div>

        {/* Institution */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Current institution</label>
          <input 
            type="text"
            placeholder="e.g. Harvard University"
            className={styles.input}
            value={formData.institution || ''}
            onChange={(e) => handleChange('institution', e.target.value)}
          />
        </div>

        {/* Graduation Year */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Graduation year</label>
          <input 
            type="number"
            placeholder="e.g. 2026"
            min="1950"
            max="2040"
            className={styles.input}
            value={formData.graduation_year || ''}
            onChange={(e) => handleChange('graduation_year', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <button
          disabled={isSubmitting}
          onClick={() => onSave(formData)}
          className={styles.buttonPrimary}
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </button>
        <button
          disabled={isSubmitting}
          onClick={onSkip}
          className={styles.buttonSecondary}
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  )
}
