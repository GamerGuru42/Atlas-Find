// 2-ZONE LAUNCH PRICING ARCHITECTURE
// Zone A (Emerging Markets: Africa + South Asia): NGN ₦5,000 / ₦15,000 (3x Elite Ratio)
// Zone B (Global / Everyone Else): USD $9.99 / $29.99 (3x Elite Ratio)

export const PRICING = {
  PRO: {
    // Zone A (Emerging Markets)
    NGN: { monthly: 5000, yearly: 40000, symbol: "₦", currency: "NGN" },
    GHS: { monthly: 45, yearly: 360, symbol: "GH₵", currency: "GHS" },
    KES: { monthly: 500, yearly: 4000, symbol: "KSh", currency: "KES" },
    ZAR: { monthly: 95, yearly: 750, symbol: "R", currency: "ZAR" },
    INR: { monthly: 399, yearly: 3199, symbol: "₹", currency: "INR" },
    
    // Zone B (Global / Western / Standard USD)
    USD: { monthly: 9.99, yearly: 79.99, symbol: "$", currency: "USD" },
    GBP: { monthly: 7.99, yearly: 64.99, symbol: "£", currency: "GBP" },
    EUR: { monthly: 8.99, yearly: 71.99, symbol: "€", currency: "EUR" },
    CAD: { monthly: 12.99, yearly: 104.99, symbol: "C$", currency: "CAD" },
    AUD: { monthly: 14.99, yearly: 119.99, symbol: "A$", currency: "AUD" },
    DEFAULT: { monthly: 9.99, yearly: 79.99, symbol: "$", currency: "USD" }
  },
  ELITE: {
    // Zone A (Emerging Markets) — Strictly 3x Pro
    NGN: { monthly: 15000, yearly: 120000, symbol: "₦", currency: "NGN" },
    GHS: { monthly: 135, yearly: 1080, symbol: "GH₵", currency: "GHS" },
    KES: { monthly: 1500, yearly: 12000, symbol: "KSh", currency: "KES" },
    ZAR: { monthly: 285, yearly: 2250, symbol: "R", currency: "ZAR" },
    INR: { monthly: 1199, yearly: 9599, symbol: "₹", currency: "INR" },

    // Zone B (Global / Western) — Strictly 3x Pro
    USD: { monthly: 29.99, yearly: 239.99, symbol: "$", currency: "USD" },
    GBP: { monthly: 23.99, yearly: 189.99, symbol: "£", currency: "GBP" },
    EUR: { monthly: 26.99, yearly: 214.99, symbol: "€", currency: "EUR" },
    CAD: { monthly: 38.99, yearly: 309.99, symbol: "C$", currency: "CAD" },
    AUD: { monthly: 44.99, yearly: 359.99, symbol: "A$", currency: "AUD" },
    DEFAULT: { monthly: 29.99, yearly: 239.99, symbol: "$", currency: "USD" }
  }
} as const;

export type Tier = 'PRO' | 'ELITE';

// Complete Mapping across all Continents
export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // AFRICA (Zone A)
  NG: "NGN", NIGERIA: "NGN", NGN: "NGN",
  GH: "GHS", GHANA: "GHS", GHS: "GHS",
  KE: "KES", KENYA: "KES", KES: "KES",
  ZA: "ZAR", "SOUTH AFRICA": "ZAR", ZAR: "ZAR",
  UG: "USD", UGANDA: "USD",
  TZ: "USD", TANZANIA: "USD",
  RW: "USD", RWANDA: "USD",
  EG: "USD", EGYPT: "USD",
  MA: "USD", MOROCCO: "USD",
  SN: "USD", SENEGAL: "USD",
  CI: "USD", "IVORY COAST": "USD",
  CM: "USD", CAMEROON: "USD",
  ZM: "USD", ZAMBIA: "USD",
  ZW: "USD", ZIMBABWE: "USD",

  // SOUTH ASIA & SE ASIA (Zone A)
  IN: "INR", INDIA: "INR", INR: "INR",
  PK: "USD", PAKISTAN: "USD",
  BD: "USD", BANGLADESH: "USD",
  VN: "USD", VIETNAM: "USD",
  PH: "USD", PHILIPPINES: "USD",
  ID: "USD", INDONESIA: "USD",
  LK: "USD", "SRI LANKA": "USD",

  // NORTH AMERICA (Zone B)
  US: "USD", "UNITED STATES": "USD", USA: "USD", USD: "USD",
  CA: "CAD", CANADA: "CAD", CAD: "CAD",
  MX: "USD", MEXICO: "USD",

  // SOUTH AMERICA (Zone B)
  BR: "USD", BRAZIL: "USD",
  AR: "USD", ARGENTINA: "USD",
  CO: "USD", COLOMBIA: "USD",
  CL: "USD", CHILE: "USD",

  // EUROPE (Zone B)
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
  PL: "EUR", POLAND: "EUR",
  EUR: "EUR",

  // OCEANIA (Zone B)
  AU: "AUD", AUSTRALIA: "AUD", AUD: "AUD",
  NZ: "AUD", "NEW ZEALAND": "AUD",

  // MIDDLE EAST & EAST ASIA (Zone B)
  AE: "USD", UAE: "USD", "UNITED ARAB EMIRATES": "USD",
  SA: "USD", "SAUDI ARABIA": "USD",
  SG: "USD", SINGAPORE: "USD",
  MY: "USD", MALAYSIA: "USD",
  JP: "USD", JAPAN: "USD",
  KR: "USD", KOREA: "USD", "SOUTH KOREA": "USD",
  HK: "USD", "HONG KONG": "USD",
  CN: "USD", CHINA: "USD"
};

export function normalizeCountryCode(countryInput?: string | null): string {
  if (!countryInput) return 'US';
  const clean = countryInput.trim().toUpperCase();

  if (clean === 'NG' || clean === 'NIGERIA' || clean === 'NGN') return 'NG';
  if (clean === 'GH' || clean === 'GHANA' || clean === 'GHS') return 'GH';
  if (clean === 'KE' || clean === 'KENYA' || clean === 'KES') return 'KE';
  if (clean === 'ZA' || clean === 'SOUTH AFRICA' || clean === 'ZAR') return 'ZA';
  if (clean === 'IN' || clean === 'INDIA' || clean === 'INR') return 'IN';
  if (clean === 'GB' || clean === 'UK' || clean === 'UNITED KINGDOM' || clean === 'GBP') return 'GB';
  if (clean === 'CA' || clean === 'CANADA' || clean === 'CAD') return 'CA';
  if (clean === 'AU' || clean === 'AUSTRALIA' || clean === 'AUD') return 'AU';
  if (clean === 'US' || clean === 'USA' || clean === 'UNITED STATES' || clean === 'USD') return 'US';

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
