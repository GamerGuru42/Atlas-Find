import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // If this is the root route and there's a code parameter, Supabase OAuth fell back
  // to the Site URL because the callback URL isn't configured in the dashboard.
  // We can seamlessly forward the user to the correct callback endpoint.
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/callback';
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')
  
  if (!user) {
    // If trying to access protected routes, redirect to login
    if (isOnboardingPage || request.nextUrl.pathname.startsWith('/discover') || request.nextUrl.pathname.startsWith('/chat')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  // User is authenticated
  const hasOnboardingCookie = request.cookies.get('atlas_onboarding_completed')?.value === 'true'
  const hasCompletedOnboarding = hasOnboardingCookie || user.user_metadata?.onboarding_completed === true || user.user_metadata?.onboarding_completed === 'true'
  
  const hasCountryCookie = !!request.cookies.get('atlas_country_code')?.value
  const hasCountryCode = hasCountryCookie || !!user.user_metadata?.country_code

  // If user hasn't completed onboarding or is missing country_code, force them to onboarding
  if (!hasCompletedOnboarding || !hasCountryCode) {
    if (!isOnboardingPage) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/onboarding'
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // If user HAS completed onboarding and is trying to access onboarding, redirect them away
    if (isOnboardingPage) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/discover' // or '/chat'
      return NextResponse.redirect(redirectUrl)
    }
    // Also redirect authenticated users away from auth pages
    if (isAuthPage) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/discover'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
