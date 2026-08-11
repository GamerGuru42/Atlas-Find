import { NextResponse } from 'next/server';

export async function GET() {
  // In a full implementation, this could read from a DB table of sources
  // or parse the scripts/scraper.py file to show what's being actively scraped.
  
  const sources = [
    { name: "Chevening", url: "https://www.chevening.org/scholarships/", active: true, lastRun: "2023-11-01" },
    { name: "DAAD", url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/", active: true, lastRun: "2023-11-01" },
    { name: "Fulbright", url: "https://foreign.fulbrightonline.org/", active: true, lastRun: "2023-11-01" },
    { name: "World Bank", url: "https://www.worldbank.org/en/programs/scholarships", active: true, lastRun: "2023-11-01" },
    { name: "UN YPP", url: "https://careers.un.org/lbw/home.aspx?viewtype=ypp", active: true, lastRun: "2023-11-01" },
    { name: "Mastercard Foundation", url: "https://mastercardfdn.org/all/scholars/", active: true, lastRun: "2023-11-01" },
    { name: "Commonwealth Scholarships", url: "https://cscuk.fcdo.gov.uk/scholarships/", active: true, lastRun: "2023-11-01" },
    { name: "Erasmus Mundus", url: "https://erasmus-plus.ec.europa.eu/", active: true, lastRun: "2023-11-01" },
    { name: "Rotary Peace Fellowships", url: "https://www.rotary.org/en/our-programs/peace-fellowships", active: true, lastRun: "2023-11-01" },
    { name: "Aga Khan Foundation", url: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme", active: true, lastRun: "2023-11-01" }
  ];

  return NextResponse.json({ sources });
}
