/**
 * Paystack Payment Helper Module (Africa: NG, GH, KE, ZA, UG, TZ, RW, etc.)
 */

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '';
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export const IS_PAYSTACK_CONFIGURED = Boolean(PAYSTACK_SECRET_KEY);
export const IS_PAYSTACK_TEST_MODE = PAYSTACK_SECRET_KEY.startsWith('sk_test_') || PAYSTACK_PUBLIC_KEY.startsWith('pk_test_');

export interface PaystackInitParams {
  email: string;
  amount: number; // in lowest currency unit (kobo/cents), e.g. NGN 5000 => 500000
  currency?: string; // NGN, GHS, KES, ZAR, USD, etc.
  callback_url: string;
  metadata?: Record<string, any>;
}

export async function initializePaystackTransaction(params: PaystackInitParams) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key (PAYSTACK_SECRET_KEY) is not configured.');
  }

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
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key (PAYSTACK_SECRET_KEY) is not configured.');
  }

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
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key (PAYSTACK_SECRET_KEY) is not configured.');
  }

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
