import { NextResponse } from 'next/server';
import { detectCountry } from '@/lib/geo/detect-country';

export async function GET() {
  const geo = await detectCountry();
  return NextResponse.json(geo);
}
