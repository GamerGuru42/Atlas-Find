/**
 * AtlasFind - Secure Cron Job Authorization Guard
 *
 * Verifies that scheduled requests originating from Vercel Cron
 * (or authorized orchestrators) carry a valid CRON_SECRET Bearer token.
 * Uses constant-time comparison (crypto.timingSafeEqual) to prevent timing attacks.
 */

import crypto from 'crypto';

export function verifyCronAuthorization(req: Request): { authorized: boolean; reason?: string } {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In production, an explicit CRON_SECRET MUST be set
  if (process.env.NODE_ENV === 'production' || cronSecret) {
    if (!cronSecret) {
      console.error('[Cron Auth] CRITICAL: CRON_SECRET is not configured in production.');
      return { authorized: false, reason: 'CRON_SECRET is not configured' };
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, reason: 'Missing or malformed Authorization header' };
    }

    const providedToken = authHeader.slice(7).trim();

    try {
      const expectedBuffer = Buffer.from(cronSecret, 'utf8');
      const providedBuffer = Buffer.from(providedToken, 'utf8');

      if (expectedBuffer.length !== providedBuffer.length) {
        return { authorized: false, reason: 'Invalid authorization token length' };
      }

      const isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
      return {
        authorized: isValid,
        reason: isValid ? undefined : 'Invalid authorization token',
      };
    } catch {
      return { authorized: false, reason: 'Token comparison failure' };
    }
  }

  // Local development without configured CRON_SECRET
  return { authorized: true };
}

