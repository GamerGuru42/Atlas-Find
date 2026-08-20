import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import prisma from '@/lib/db/prisma';

export interface VerifiedUser {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'elite';
  countryCode?: string;
  isLoggedIn: boolean;
}

export async function getVerifiedUser(): Promise<VerifiedUser> {
  let userId: string | null = null;
  let userEmail: string | null = null;
  let cookieTier: 'free' | 'pro' | 'elite' = 'free';

  try {
    const cookieStore = await cookies();
    const tierCookie = cookieStore.get('atlas_user_tier')?.value;
    if (tierCookie === 'pro' || tierCookie === 'elite') {
      cookieTier = tierCookie;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {}
        },
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userId = session.user.id;
        userEmail = session.user.email || null;
      }
    }
  } catch (e) {
    console.error('getVerifiedUser session error:', e);
  }

  if (!userId) {
    return {
      id: 'demo_user',
      email: 'demo@atlasfind.com',
      tier: 'free',
      countryCode: 'US',
      isLoggedIn: false
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    });

    if (!user) {
      return {
        id: userId,
        email: userEmail || 'user@atlasfind.com',
        tier: cookieTier,
        countryCode: 'US',
        isLoggedIn: true
      };
    }

    // Database is source of truth, but cookie tier serves as fail-safe for transient DB writes
    let activeTier: 'free' | 'pro' | 'elite' = (user.tier as 'free' | 'pro' | 'elite') || cookieTier;

    // Only revert if subscription status is explicitly canceled
    if (user.subscription && user.subscription.status === 'canceled') {
      activeTier = 'free';
      await prisma.user.update({
        where: { id: user.id },
        data: { tier: 'free' }
      }).catch(() => {});
    }

    // Keep cookie in sync (removed cookieStore.set here because it is not allowed in GET requests; cookies are set on authentication/payment callbacks instead)

    return {
      id: user.id,
      email: user.email || userEmail || 'user@atlasfind.com',
      tier: activeTier,
      countryCode: user.countryCode || 'US',
      isLoggedIn: true
    };
  } catch (e) {
    console.error('getVerifiedUser DB lookup error:', e);
    // Fallback to cookie tier during DB connection errors
    return {
      id: userId,
      email: userEmail || 'user@atlasfind.com',
      tier: cookieTier,
      countryCode: 'US',
      isLoggedIn: true
    };
  }
}
