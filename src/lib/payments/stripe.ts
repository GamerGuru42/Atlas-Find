/**
 * Stripe Payment Helper Module (Global: US, UK, EU, CA, AU, etc.)
 */
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';

export const IS_STRIPE_CONFIGURED = Boolean(stripeSecret);

export const stripe = new Stripe(stripeSecret || 'dummy_key_unconfigured', {
  apiVersion: '2025-02-24.acacia' as any,
});

export interface StripeCheckoutParams {
  customerEmail: string;
  priceId: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
  stripeCustomerId?: string;
}

export async function createStripeCheckoutSession(params: StripeCheckoutParams) {
  if (!IS_STRIPE_CONFIGURED) {
    throw new Error('Stripe is not configured. STRIPE_SECRET_KEY is missing.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer: params.stripeCustomerId,
    customer_email: params.stripeCustomerId ? undefined : params.customerEmail,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    metadata: params.metadata,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

export async function createStripeCustomer(email: string, name?: string) {
  if (!IS_STRIPE_CONFIGURED) {
    throw new Error('Stripe is not configured. STRIPE_SECRET_KEY is missing.');
  }

  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
}

export async function cancelStripeSubscription(subscriptionId: string) {
  if (!IS_STRIPE_CONFIGURED) {
    throw new Error('Stripe is not configured. STRIPE_SECRET_KEY is missing.');
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}
