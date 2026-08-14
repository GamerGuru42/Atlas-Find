/**
 * Paystack Payment Helper Module (Africa: NG, GH, KE, ZA, UG, TZ, RW, etc.)
 */

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_cf9b63d9d316de054f6e37fe9f4c59a6aee8fff3';
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_d46c5a5e10f199c8a5dff6e113215e510650fd8a';

export const IS_PAYSTACK_TEST_MODE = PAYSTACK_SECRET_KEY.startsWith('sk_test_') || PAYSTACK_PUBLIC_KEY.startsWith('pk_test_');

if (IS_PAYSTACK_TEST_MODE) {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Using Paystack Test Mode keys. Replace with live keys in Vercel before accepting production payments.');
  }
}

export interface PaystackInitParams {
  email: string;
  amount: number; // in lowest currency unit (kobo/cents), e.g. NGN 5000 => 500000
  currency?: string; // NGN, GHS, KES, ZAR, USD, etc.
  callback_url: string;
  metadata?: Record<string, any>;
}

export async function initializePaystackTransaction(params: PaystackInitParams) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount),
      currency: params.currency || 'NGN',
      callback_url: params.callback_url,
      metadata: params.metadata,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Failed to initialize Paystack transaction');
  }

  return {
    authorization_url: data.data.authorization_url,
    access_code: data.data.access_code,
    reference: data.data.reference,
  };
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Failed to verify Paystack transaction');
  }

  return data.data;
}

export async function cancelPaystackSubscription(subscriptionCode: string, emailToken: string) {
  const response = await fetch('https://api.paystack.co/subscription/disable', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: subscriptionCode,
      token: emailToken,
    }),
  });

  const data = await response.json();
  return data.status;
}
