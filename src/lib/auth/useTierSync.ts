'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type TierValue = 'free' | 'pro' | 'elite';

interface TierSyncMessage {
  tier: TierValue;
  event: 'upgrade' | 'logout' | 'sync';
}

/**
 * Cross-tab tier synchronisation hook.
 * 
 * Uses BroadcastChannel API (with cookie-polling fallback every 30s)
 * to detect when atlas_user_tier changes in another tab.
 * 
 * Returns the live tier value and a broadcast function to notify other tabs.
 */
export function useTierSync(
  initialTier: TierValue,
  onTierChange?: (newTier: TierValue, event: string) => void
) {
  const [currentTier, setCurrentTier] = useState<TierValue>(initialTier);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastKnownTier = useRef<TierValue>(initialTier);

  // Read tier from cookie
  const readCookieTier = useCallback((): TierValue => {
    if (typeof document === 'undefined') return 'free';
    const match = document.cookie.match(/(?:^|; )atlas_user_tier=([^;]*)/);
    if (match && (match[1] === 'pro' || match[1] === 'elite')) {
      return match[1] as TierValue;
    }
    return 'free';
  }, []);

  // Broadcast tier change to other tabs
  const broadcastTier = useCallback((tier: TierValue, event: 'upgrade' | 'logout' | 'sync' = 'sync') => {
    try {
      channelRef.current?.postMessage({ tier, event } as TierSyncMessage);
    } catch {
      // BroadcastChannel not supported or closed
    }
  }, []);

  useEffect(() => {
    // Setup BroadcastChannel
    try {
      const channel = new BroadcastChannel('atlas_tier');
      channelRef.current = channel;

      channel.onmessage = (event: MessageEvent<TierSyncMessage>) => {
        const { tier, event: tierEvent } = event.data;
        if (tier !== lastKnownTier.current) {
          lastKnownTier.current = tier;
          setCurrentTier(tier);
          onTierChange?.(tier, tierEvent);
        }
      };
    } catch {
      // BroadcastChannel not supported (older browsers) — cookie poll handles it
    }

    // Cookie polling fallback (every 30s)
    const pollInterval = setInterval(() => {
      const cookieTier = readCookieTier();
      if (cookieTier !== lastKnownTier.current) {
        lastKnownTier.current = cookieTier;
        setCurrentTier(cookieTier);
        onTierChange?.(cookieTier, 'sync');
        // Also broadcast so BroadcastChannel-aware tabs catch up
        broadcastTier(cookieTier, 'sync');
      }
    }, 30_000);

    // Initial cookie check (covers case where cookie was set before this hook mounted)
    const initialCookieTier = readCookieTier();
    if (initialCookieTier !== initialTier && initialCookieTier !== 'free') {
      lastKnownTier.current = initialCookieTier;
      setCurrentTier(initialCookieTier);
    }

    return () => {
      clearInterval(pollInterval);
      try { channelRef.current?.close(); } catch {}
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { currentTier, broadcastTier };
}
