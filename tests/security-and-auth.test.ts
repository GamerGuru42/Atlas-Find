import test from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { verifyAdminAccess } from '../src/lib/auth/adminAuth.ts';

test('Security & Auth: Admin authorization defends against unauthenticated access and timing attacks', () => {
  const secretKey = 'atlas_prod_secret_admin_key_998877';
  process.env.ADMIN_SECRET_KEY = secretKey;

  // 1. Missing Authorization header
  const reqNoHeader = new Request('http://localhost:3000/api/admin/review');
  const res1 = verifyAdminAccess(reqNoHeader);
  assert.strictEqual(res1.authorized, false);

  // 2. Malformed Authorization header (no Bearer prefix)
  const reqMalformed = new Request('http://localhost:3000/api/admin/review', {
    headers: { authorization: `Basic ${secretKey}` },
  });
  const res2 = verifyAdminAccess(reqMalformed);
  assert.strictEqual(res2.authorized, false);

  // 3. Forged token with different length (timing-safe failure)
  const reqWrongLength = new Request('http://localhost:3000/api/admin/review', {
    headers: { authorization: 'Bearer wrong_short_token' },
  });
  const res3 = verifyAdminAccess(reqWrongLength);
  assert.strictEqual(res3.authorized, false);

  // 4. Forged token with same length but wrong characters
  const wrongSameLength = 'atlas_prod_secret_admin_key_000000';
  const reqWrongChars = new Request('http://localhost:3000/api/admin/review', {
    headers: { authorization: `Bearer ${wrongSameLength}` },
  });
  const res4 = verifyAdminAccess(reqWrongChars);
  assert.strictEqual(res4.authorized, false);

  // 5. Valid token
  const reqValid = new Request('http://localhost:3000/api/admin/review', {
    headers: { authorization: `Bearer ${secretKey}` },
  });
  const res5 = verifyAdminAccess(reqValid);
  assert.strictEqual(res5.authorized, true);
  assert.strictEqual(res5.reviewer, 'system_admin');

  delete process.env.ADMIN_SECRET_KEY;
  delete process.env.ADMIN_API_KEY;
});

test('Security & Auth: Webhook cryptographic HMAC signature verification', () => {
  const webhookSecret = 'sk_live_paystack_secret_key_12345';
  const payload = JSON.stringify({
    event: 'charge.success',
    data: {
      status: 'success',
      reference: 'ref_tx_998811',
      customer: { email: 'scholar@example.com' },
      metadata: { userId: 'usr_77221' },
    },
  });

  // Calculate genuine signature
  const validSignature = crypto.createHmac('sha512', webhookSecret).update(payload).digest('hex');

  // Helper verifying signature with constant-time equality
  function verifyWebhook(body: string, sigHeader: string | null, secret: string): boolean {
    if (!sigHeader || !secret) return false;
    const computed = crypto.createHmac('sha512', secret).update(body).digest('hex');
    const compBuf = Buffer.from(computed, 'utf8');
    const actualBuf = Buffer.from(sigHeader, 'utf8');
    if (compBuf.length !== actualBuf.length) return false;
    return crypto.timingSafeEqual(compBuf, actualBuf);
  }

  // 1. Valid signature passes
  assert.strictEqual(verifyWebhook(payload, validSignature, webhookSecret), true);

  // 2. Tampered payload is rejected
  const tamperedPayload = payload.replace('usr_77221', 'usr_attacker');
  assert.strictEqual(verifyWebhook(tamperedPayload, validSignature, webhookSecret), false);

  // 3. Forged signature is rejected
  assert.strictEqual(verifyWebhook(payload, 'deadbeef1234567890', webhookSecret), false);

  // 4. Missing signature is rejected
  assert.strictEqual(verifyWebhook(payload, null, webhookSecret), false);
});

test('Security & Auth: IDOR defense via compound user-resource ownership scoping', () => {
  // Mock repository with user scoping
  const database = [
    { id: 'item_101', userId: 'user_alice', status: 'saved' },
    { id: 'item_102', userId: 'user_bob', status: 'saved' },
  ];

  function deleteUserItem(itemId: string, authenticatedUserId: string): { success: boolean; affectedCount: number } {
    // Critical: WHERE id = itemId AND userId = authenticatedUserId
    const idx = database.findIndex((i) => i.id === itemId && i.userId === authenticatedUserId);
    if (idx === -1) {
      return { success: false, affectedCount: 0 };
    }
    database.splice(idx, 1);
    return { success: true, affectedCount: 1 };
  }

  // Bob attempts to delete Alice's record 'item_101'
  const attackerAttempt = deleteUserItem('item_101', 'user_bob');
  assert.strictEqual(attackerAttempt.success, false);
  assert.strictEqual(attackerAttempt.affectedCount, 0);
  assert.strictEqual(database.some((i) => i.id === 'item_101'), true, 'Alice record must remain untouched');

  // Alice deletes her own record 'item_101'
  const legitimateAttempt = deleteUserItem('item_101', 'user_alice');
  assert.strictEqual(legitimateAttempt.success, true);
  assert.strictEqual(legitimateAttempt.affectedCount, 1);
  assert.strictEqual(database.some((i) => i.id === 'item_101'), false, 'Alice record should be removed');
});

