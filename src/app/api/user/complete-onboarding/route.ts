import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const CURRENCY_MAP: Record<string, string> = {
  NG: 'NGN',
  GH: 'GHS',
  KE: 'KES',
  ZA: 'ZAR',
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR',
  CA: 'CAD',
  IN: 'INR',
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore in API route
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { country_code, field_of_study, level, institution, graduation_year } = body

    if (!country_code) {
      return NextResponse.json({ error: 'Country code is required' }, { status: 400 })
    }

    const currency = CURRENCY_MAP[country_code] || 'USD'

    // 1. Update Supabase Auth user_metadata using Service Role key
    // This is much safer for server-side updates and avoids token sync issues with the browser
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() {}
        }
      }
    )

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        onboarding_completed: true,
        country_code,
      }
    })

    if (updateError) {
      console.error('Error updating supabase user metadata:', updateError)
      return NextResponse.json({ error: 'Failed to update user profile metadata' }, { status: 500 })
    }

    // 2. Update Prisma User table
    const updatedUser = await prisma.user.upsert({
      where: {
        id: user.id
      },
      update: {
        countryCode: country_code,
        currency,
        fieldOfStudy: field_of_study || null,
        level: level || null,
        institution: institution || null,
        graduationYear: graduation_year ? parseInt(graduation_year, 10) : null,
        onboardingCompleted: true
      },
      create: {
        id: user.id,
        email: user.email!,
        countryCode: country_code,
        currency,
        fieldOfStudy: field_of_study || null,
        level: level || null,
        institution: institution || null,
        graduationYear: graduation_year ? parseInt(graduation_year, 10) : null,
        onboardingCompleted: true
      }
    })

    // 3. Set explicit fallback cookies so middleware receives them immediately on redirect
    cookieStore.set('atlas_onboarding_completed', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    cookieStore.set('atlas_country_code', country_code, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (error: any) {
    console.error('Complete onboarding error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
