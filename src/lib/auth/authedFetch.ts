'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Authenticated fetch wrapper with silent 401 token refresh.
 * 
 * Drop-in replacement for `fetch()` in client components.
 * On 401: attempts one silent Supabase session refresh, retries the request.
 * If refresh fails: redirects to /login with returnUrl preserving user intent.
 */
export async function authedFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  let res = await fetch(url, options);

  if (res.status === 401) {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.refreshSession();

      if (!error) {
        // Refresh succeeded — retry the original request once
        res = await fetch(url, options);
      } else {
        // Refresh failed — session is truly expired
        if (typeof window !== 'undefined') {
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?returnUrl=${returnUrl}`;
        }
        throw new Error('Session expired. Redirecting to login.');
      }
    } catch (refreshError) {
      // Network error during refresh — redirect to login
      if (typeof window !== 'undefined' && !(refreshError instanceof Error && refreshError.message.includes('Redirecting'))) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?returnUrl=${returnUrl}`;
      }
      throw refreshError;
    }
  }

  return res;
}
