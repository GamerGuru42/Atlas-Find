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
    AUD: { monthly: 6.99, yearly: 54.99, symbol: "A$", currency: "AUD" },
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
    AUD: { monthly: 20.99, yearly: 169.99, symbol: "A$", currency: "AUD" },
    DEFAULT: { monthly: 14.99, yearly: 119.99, symbol: "$", currency: "USD" }
  }
} as const;

export type Tier = 'PRO' | 'ELITE';

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // Africa
  NG: "NGN", NIGERIA: "NGN", NGN: "NGN",
  GH: "GHS", GHANA: "GHS", GHS: "GHS",
  KE: "KES", KENYA: "KES", KES: "KES",
  ZA: "ZAR", "SOUTH AFRICA": "ZAR", ZAR: "ZAR",
  EG: "USD", EGYPT: "USD",
  MA: "USD", MOROCCO: "USD",
  TZ: "USD", TANZANIA: "USD",
  UG: "USD", UGANDA: "USD",
  RW: "USD", RWANDA: "USD",

  // Americas
  US: "USD", "UNITED STATES": "USD", USA: "USD", USD: "USD",
  CA: "CAD", CANADA: "CAD", CAD: "CAD",
  MX: "USD", MEXICO: "USD",
  BR: "USD", BRAZIL: "USD",

  // Europe
  GB: "GBP", UK: "GBP", "UNITED KINGDOM": "GBP", GBP: "GBP",
  DE: "EUR", GERMANY: "EUR",
  FR: "EUR", FRANCE: "EUR",
  ES: "EUR", SPAIN: "EUR",
  IT: "EUR", ITALY: "EUR",
  NL: "EUR", NETHERLANDS: "EUR",
  BE: "EUR", BELGIUM: "EUR",
  AT: "EUR", AUSTRIA: "EUR",
  PT: "EUR", PORTUGAL: "EUR",
  IE: "EUR", IRELAND: "EUR",
  FI: "EUR", FINLAND: "EUR",
  GR: "EUR", GREECE: "EUR",
  SE: "EUR", SWEDEN: "EUR",
  DK: "EUR", DENMARK: "EUR",
  NO: "EUR", NORWAY: "EUR",
  CH: "EUR", SWITZERLAND: "EUR",
  EUR: "EUR",

  // Asia-Pacific
  IN: "INR", INDIA: "INR", INR: "INR",
  AU: "AUD", AUSTRALIA: "AUD", AUD: "AUD",
  NZ: "AUD", "NEW ZEALAND": "AUD",
  SG: "USD", SINGAPORE: "USD",
  MY: "USD", MALAYSIA: "USD",
  PH: "USD", PHILIPPINES: "USD",
  JP: "USD", JAPAN: "USD",
  KR: "USD", KOREA: "USD", "SOUTH KOREA": "USD",
  CN: "USD", CHINA: "USD",
  HK: "USD", "HONG KONG": "USD"
};

export function normalizeCountryCode(countryInput?: string | null): string {
  if (!countryInput) return 'US';
  const clean = countryInput.trim().toUpperCase();

  // Known country aliases to ISO 2-char code
  if (clean === 'NG' || clean === 'NIGERIA' || clean === 'NGN') return 'NG';
  if (clean === 'GH' || clean === 'GHANA' || clean === 'GHS') return 'GH';
  if (clean === 'KE' || clean === 'KENYA' || clean === 'KES') return 'KE';
  if (clean === 'ZA' || clean === 'SOUTH AFRICA' || clean === 'ZAR') return 'ZA';
  if (clean === 'GB' || clean === 'UK' || clean === 'UNITED KINGDOM' || clean === 'GBP') return 'GB';
  if (clean === 'IN' || clean === 'INDIA' || clean === 'INR') return 'IN';
  if (clean === 'CA' || clean === 'CANADA' || clean === 'CAD') return 'CA';
  if (clean === 'AU' || clean === 'AUSTRALIA' || clean === 'AUD') return 'AU';
  if (clean === 'US' || clean === 'USA' || clean === 'UNITED STATES' || clean === 'USD') return 'US';

  // Europe / EUR mapping
  if (['DE', 'GERMANY', 'FR', 'FRANCE', 'ES', 'SPAIN', 'IT', 'ITALY', 'NL', 'NETHERLANDS', 'BE', 'BELGIUM', 'AT', 'AUSTRIA', 'PT', 'PORTUGAL', 'IE', 'IRELAND', 'FI', 'FINLAND', 'GR', 'GREECE', 'EUR'].includes(clean)) {
    return 'DE';
  }

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
