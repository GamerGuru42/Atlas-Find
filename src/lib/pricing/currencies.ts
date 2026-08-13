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
  NIGERIA: "NGN",
  NGN: "NGN",
  GH: "GHS",
  GHANA: "GHS",
  GHS: "GHS",
  KE: "KES",
  KENYA: "KES",
  KES: "KES",
  ZA: "ZAR",
  "SOUTH AFRICA": "ZAR",
  ZAR: "ZAR",
  US: "USD",
  "UNITED STATES": "USD",
  USA: "USD",
  USD: "USD",
  GB: "GBP",
  UK: "GBP",
  "UNITED KINGDOM": "GBP",
  GBP: "GBP",
  DE: "EUR",
  GERMANY: "EUR",
  FR: "EUR",
  FRANCE: "EUR",
  EUR: "EUR",
  IN: "INR",
  INDIA: "INR",
  INR: "INR",
  CA: "CAD",
  CANADA: "CAD",
  CAD: "CAD"
};

export function normalizeCountryCode(countryInput?: string | null): string {
  if (!countryInput) return 'US';
  const clean = countryInput.trim().toUpperCase();
  if (clean === 'NG' || clean === 'NIGERIA' || clean === 'NGN') return 'NG';
  if (clean === 'GH' || clean === 'GHANA' || clean === 'GHS') return 'GH';
  if (clean === 'KE' || clean === 'KENYA' || clean === 'KES') return 'KE';
  if (clean === 'ZA' || clean === 'SOUTH AFRICA' || clean === 'ZAR') return 'ZA';
  if (clean === 'GB' || clean === 'UK' || clean === 'UNITED KINGDOM' || clean === 'GBP') return 'GB';
  if (clean === 'IN' || clean === 'INDIA' || clean === 'INR') return 'IN';
  if (clean === 'CA' || clean === 'CANADA' || clean === 'CAD') return 'CA';
  if (clean === 'DE' || clean === 'GERMANY' || clean === 'FR' || clean === 'FRANCE' || clean === 'EUR') return 'DE';
  return clean;
}

export function getPricing(tier: Tier, countryCode?: string | null) {
  if (!countryCode) return PRICING[tier].DEFAULT;
  const upper = countryCode.trim().toUpperCase();
  const currencyCode = COUNTRY_CURRENCY_MAP[upper];
  
  const tierPricing = PRICING[tier];
  
  if (currencyCode && currencyCode in tierPricing) {
    return tierPricing[currencyCode as keyof typeof tierPricing];
  }
  
  return tierPricing.DEFAULT;
}
