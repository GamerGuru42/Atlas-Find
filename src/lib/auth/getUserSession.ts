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

  try {
    const cookieStore = await cookies();
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
        tier: 'free',
        countryCode: 'US',
        isLoggedIn: true
      };
    }

    // Database is the absolute source of truth for user tier
    let activeTier: 'free' | 'pro' | 'elite' = (user.tier as 'free' | 'pro' | 'elite') || 'free';

    // Verify against subscription record status
    if (activeTier !== 'free' && (!user.subscription || user.subscription.status !== 'active')) {
      activeTier = 'free';
      // Revert user tier in DB if canceled
      await prisma.user.update({
        where: { id: user.id },
        data: { tier: 'free' }
      }).catch(() => {});
    }

    // Sync cookie for client performance
    try {
      const cookieStore = await cookies();
      cookieStore.set('atlas_user_tier', activeTier, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax'
      });
    } catch {}

    return {
      id: user.id,
      email: user.email || userEmail || 'user@atlasfind.com',
      tier: activeTier,
      countryCode: user.countryCode || 'US',
      isLoggedIn: true
    };
  } catch (e) {
    console.error('getVerifiedUser DB lookup error:', e);
    return {
      id: userId,
      email: userEmail || 'user@atlasfind.com',
      tier: 'free',
      countryCode: 'US',
      isLoggedIn: true
    };
  }
}
