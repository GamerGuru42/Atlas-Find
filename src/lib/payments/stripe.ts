/**
 * Stripe Payment Helper Module (Global: US, UK, EU, CA, AU, etc.)
 */
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_stripe';

export const stripe = new Stripe(stripeSecret, {
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
  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
}

export async function cancelStripeSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}
