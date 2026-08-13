'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import CountrySelector from '@/components/onboarding/CountrySelector'
import ProfileBuilder, { ProfileData } from '@/components/onboarding/ProfileBuilder'
import { CheckCircle2 } from 'lucide-react'
import styles from '@/components/onboarding/Onboarding.module.css'

// Steps: 1 (Welcome), 2 (Country), 3 (Profile)

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCountrySelect = (code: string) => {
    setCountryCode(code)
    setStep(3)
  }

  const completeOnboarding = async (profileData?: ProfileData) => {
    if (!countryCode) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: countryCode,
          ...profileData
        })
      })

      if (!res.ok) {
        throw new Error('Failed to complete onboarding')
      }

      // Show subtle confetti effect using simple DOM creation or just the toast
      toast('Welcome to AtlasFind! 🎓', {
        description: 'Try asking Atlas to find scholarships for you.',
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
      })

      // Store in localStorage for instant client-side pricing & region detection
      localStorage.setItem('atlas_country_code', countryCode)
      localStorage.setItem('user_country', countryCode)

      // Also update browser session user_metadata directly so client-side token claims refresh immediately
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          country_code: countryCode
        }
      })

      // Use window.location.href to guarantee a full page load.
      // This ensures that the newly set Supabase auth cookies are 
      // picked up correctly by the server and middleware.
      window.location.href = '/discover'
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <motion.div 
          className={styles.progressBar}
          initial={{ width: '33%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className={styles.stepContainer}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.iconWrapper}>
                  <span>🌍</span>
                </div>
                <h1 className={styles.title}>
                  Welcome! Let's personalize your experience.
                </h1>
              </div>
              <button
                onClick={() => setStep(2)}
                className={styles.buttonPrimary}
              >
                Get Started
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <CountrySelector
              key="step2"
              onContinue={handleCountrySelect}
            />
          )}

          {step === 3 && (
            <ProfileBuilder
              key="step3"
              isSubmitting={isSubmitting}
              onSave={(data) => completeOnboarding(data)}
              onSkip={() => completeOnboarding()}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Step Indicators */}
      <div className={styles.indicators}>
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`${styles.indicator} ${
              step >= i ? styles.indicatorActive : styles.indicatorInactive
            }`} 
          />
        ))}
      </div>
    </div>
  )
}
