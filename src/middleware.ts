import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/settings',
  '/tracker',
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
  // If this is the root route and there's a code parameter, forward to callback
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/callback';
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase credentials not set yet on this environment
    return response;
  }

  let user = null;
  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.warn('[Middleware Supabase Auth Check]', err);
  }

  const pathname = request.nextUrl.pathname;
  const isOnboardingPage = pathname.startsWith('/onboarding');

  // ─── GUEST (not authenticated) ───
  if (!user) {
    if (isProtectedRoute(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';

      if (isSafeReturnUrl(pathname)) {
        redirectUrl.searchParams.set('returnUrl', pathname);
      }

      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // ─── AUTHENTICATED ───
  // Progressive onboarding: User is encouraged to complete onboarding, but not hard-blocked from discover
  const hasOnboardingCookie = request.cookies.get('atlas_onboarding_completed')?.value === 'true';
  const hasCompletedOnboarding = hasOnboardingCookie || user.user_metadata?.onboarding_completed === true || user.user_metadata?.onboarding_completed === 'true';

  // If user completed onboarding and is trying to access onboarding again, redirect to discover
  if (isOnboardingPage && hasCompletedOnboarding) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/discover';
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage(pathname)) {
    const returnUrl = request.nextUrl.searchParams.get('returnUrl');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = (returnUrl && isSafeReturnUrl(returnUrl)) ? returnUrl : '/discover';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
