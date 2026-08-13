export const PRICING = {
  PRO: {
    NGN: { monthly: 7500, yearly: 55000, symbol: "₦", currency: "NGN" },
    GHS: { monthly: 65, yearly: 500, symbol: "GH₵", currency: "GHS" },
    KES: { monthly: 750, yearly: 5500, symbol: "KSh", currency: "KES" },
    ZAR: { monthly: 95, yearly: 750, symbol: "R", currency: "ZAR" },
    USD: { monthly: 4.99, yearly: 39.99, symbol: "$", currency: "USD" },
    GBP: { monthly: 3.99, yearly: 31.99, symbol: "£", currency: "GBP" },
    EUR: { monthly: 4.49, yearly: 35.99, symbol: "€", currency: "EUR" },
    INR: { monthly: 399, yearly: 2999, symbol: "₹", currency: "INR" },
    CAD: { monthly: 6.49, yearly: 51.99, symbol: "C$", currency: "CAD" },
    DEFAULT: { monthly: 4.99, yearly: 39.99, symbol: "$", currency: "USD" }
  },
  ELITE: {
    NGN: { monthly: 22500, yearly: 165000, symbol: "₦", currency: "NGN" },
    GHS: { monthly: 195, yearly: 1500, symbol: "GH₵", currency: "GHS" },
    KES: { monthly: 2250, yearly: 16500, symbol: "KSh", currency: "KES" },
    ZAR: { monthly: 285, yearly: 2250, symbol: "R", currency: "ZAR" },
    USD: { monthly: 14.99, yearly: 119.99, symbol: "$", currency: "USD" },
    GBP: { monthly: 11.99, yearly: 95.99, symbol: "£", currency: "GBP" },
    EUR: { monthly: 13.49, yearly: 107.99, symbol: "€", currency: "EUR" },
    INR: { monthly: 1199, yearly: 8999, symbol: "₹", currency: "INR" },
    CAD: { monthly: 19.49, yearly: 155.99, symbol: "C$", currency: "CAD" },
    DEFAULT: { monthly: 14.99, yearly: 119.99, symbol: "$", currency: "USD" }
  }
} as const;

export type Tier = 'PRO' | 'ELITE';

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  NG: "NGN",
  GH: "GHS",
  KE: "KES",
  ZA: "ZAR",
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IN: "INR",
  CA: "CAD"
};

export function getPricing(tier: Tier, countryCode?: string | null) {
  const currencyCode = countryCode ? COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] : null;
  
  const tierPricing = PRICING[tier];
  
  if (currencyCode && currencyCode in tierPricing) {
    return tierPricing[currencyCode as keyof typeof tierPricing];
  }
  
  return tierPricing.DEFAULT;
}
