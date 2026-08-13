'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import CountrySelector from '@/components/onboarding/CountrySelector'
import ProfileBuilder, { ProfileData } from '@/components/onboarding/ProfileBuilder'
import { CheckCircle2 } from 'lucide-react'

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

      router.push('/discover')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-accent">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: '33%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center space-y-8 max-w-lg"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">🌍</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Welcome! Let's personalize your experience.
                </h1>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-12 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-all active:scale-[0.98] hover:opacity-90"
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
      <div className="py-8 flex justify-center gap-2">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-colors ${
              step >= i ? 'bg-primary' : 'bg-primary/20'
            }`} 
          />
        ))}
      </div>
    </div>
  )
}
