import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/settings',
  '/chat',
  '/onboarding',
  '/discover',
] as const;

// Routes that are auth pages (login/signup) — logged-in users shouldn't see these
const AUTH_PAGES = ['/login', '/signup'] as const;

// Routes that should never be used as returnUrl (prevents redirect loops)
const BLOCKED_RETURN_URLS = ['/login', '/signup', '/auth/callback'] as const;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some(prefix => pathname.startsWith(prefix));
}

function isSafeReturnUrl(pathname: string): boolean {
  return pathname.startsWith('/') && !BLOCKED_RETURN_URLS.some(blocked => pathname.startsWith(blocked));
}

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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  const pathname = request.nextUrl.pathname;
  const isOnboardingPage = pathname.startsWith('/onboarding');

  // ─── GUEST (not authenticated) ───
  if (!user) {
    if (isProtectedRoute(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';

      // Attach returnUrl so the user lands back here after login
      if (isSafeReturnUrl(pathname)) {
        redirectUrl.searchParams.set('returnUrl', pathname);
      }

      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // ─── AUTHENTICATED ───
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
      redirectUrl.pathname = '/discover'
      return NextResponse.redirect(redirectUrl)
    }
    // Also redirect authenticated users away from auth pages
    if (isAuthPage(pathname)) {
      // Honour returnUrl if present (e.g. user bookmarked /login?returnUrl=/pricing)
      const returnUrl = request.nextUrl.searchParams.get('returnUrl');
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = (returnUrl && isSafeReturnUrl(returnUrl)) ? returnUrl : '/discover';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
