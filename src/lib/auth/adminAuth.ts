/**
 * AtlasFind - Secure Administrative Authentication & Authorization Guard
 */

import crypto from 'crypto';

export function verifyAdminAccess(request: Request): { authorized: boolean; reviewer: string } {
  const authHeader = request.headers.get('authorization');

  // Canonical environment variable is ADMIN_SECRET_KEY, with legacy fallbacks for backwards compatibility
  const configuredSecret = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_API_KEY || process.env.ADMIN_PASSWORD;

  if (!configuredSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Admin Auth] CRITICAL: ADMIN_SECRET_KEY is not configured in production.');
      return { authorized: false, reviewer: 'unauthorized' };
    }
    // In local development, require at least a non-empty header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, reviewer: 'unauthorized' };
    }
    return { authorized: true, reviewer: 'dev_admin' };
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, reviewer: 'unauthorized' };
  }

  const providedToken = authHeader.slice(7).trim();

  try {
    const expectedBuffer = Buffer.from(configuredSecret, 'utf8');
    const providedBuffer = Buffer.from(providedToken, 'utf8');

    if (expectedBuffer.length !== providedBuffer.length) {
      return { authorized: false, reviewer: 'unauthorized' };
    }

    const isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    return { authorized: isValid, reviewer: isValid ? 'system_admin' : 'unauthorized' };
  } catch (err) {
    return { authorized: false, reviewer: 'unauthorized' };
  }
}

