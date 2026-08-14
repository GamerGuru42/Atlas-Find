import { headers } from 'next/headers';

export interface GeoLocation {
  countryCode: string | null;
  region: string | null;
  city: string | null;
  ip: string | null;
}

export async function detectCountry(): Promise<GeoLocation> {
  try {
    const headersList = await headers();

    const countryCode =
      headersList.get('x-vercel-ip-country') ||
      headersList.get('cf-ipcountry') ||
      headersList.get('x-country-code') ||
      null;

    const region =
      headersList.get('x-vercel-ip-country-region') ||
      headersList.get('cf-region') ||
      null;

    const city =
      headersList.get('x-vercel-ip-city') ||
      headersList.get('cf-ipcity') ||
      null;

    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      null;

    return {
      countryCode: countryCode ? countryCode.toUpperCase() : null,
      region,
      city,
      ip,
    };
  } catch (e) {
    console.error('detectCountry error:', e);
    return { countryCode: null, region: null, city: null, ip: null };
  }
}
