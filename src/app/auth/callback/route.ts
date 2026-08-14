import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Routes that should never be used as post-login destination
const BLOCKED_DESTINATIONS = ['/login', '/signup', '/auth/callback'];

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[Auth Callback Error]', error);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    // ─── Determine post-login destination ───
    // Priority: atlas_return_url cookie > /discover (safe default)
    let destination = '/discover';

    const returnUrlCookie = cookieStore.get('atlas_return_url')?.value;
    if (returnUrlCookie && returnUrlCookie.startsWith('/') && !BLOCKED_DESTINATIONS.some(b => returnUrlCookie.startsWith(b))) {
      destination = returnUrlCookie;
    }

    // Clear the returnUrl cookie — it's single-use
    try {
      cookieStore.set('atlas_return_url', '', { path: '/', maxAge: 0 });
    } catch {}

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';
    
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${destination}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${destination}`);
    } else {
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=NoCodeProvided`);
}
