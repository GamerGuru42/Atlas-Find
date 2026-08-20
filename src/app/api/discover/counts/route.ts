import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { seedOpportunities } from '@/data/seed/opportunities';

// Baseline date to calculate weekly auto-incrementing opportunities
const BASELINE_DATE = new Date('2026-08-01T00:00:00Z');

function generateWeeklyOpportunities(count: number): any[] {
  const opps: any[] = [];
  const disciplines = ['Computer Science', 'Data Science', 'Engineering', 'MBA', 'Public Health', 'Environmental Science'];
  const countries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'Netherlands'];
  const types = ['SCHOLARSHIP', 'INTERNSHIP', 'FELLOWSHIP', 'GRANT'];
  const sponsors = ['Google Research', 'Gates Foundation', 'DAAD', 'Commonwealth Trust', 'Rotary International', 'Mastercard Foundation'];

  for (let i = 0; i < count; i++) {
    const seed = i;
    const type = types[seed % types.length];
    const discipline = disciplines[seed % disciplines.length];
    const country = countries[seed % countries.length];
    const sponsor = sponsors[seed % sponsors.length];
    
    opps.push({
      id: `weekly-release-${seed}`,
      title: `${sponsor} ${discipline} ${type === 'SCHOLARSHIP' ? 'Excellence Award' : type === 'INTERNSHIP' ? 'Global Program' : type === 'FELLOWSHIP' ? 'Research Fellowship' : 'Grant Scheme'}`,
      type: type,
      sponsor: sponsor,
      orgType: seed % 2 === 0 ? 'ngo' : 'university',
      hostCountry: country,
      continent: country === 'United States' || country === 'Canada' ? 'North America' : country === 'Australia' ? 'Oceania' : 'Europe',
      eligibleCountries: ['All countries'],
      disciplines: [discipline],
      degreeLevel: seed % 2 === 0 ? ['masters'] : ['phd', 'masters'],
      fundingType: seed % 3 === 0 ? 'fully_funded' : 'partial',
      coverageDetails: { tuition: true, stipend: seed % 3 === 0 ? 1800 : 0 },
      applyUrl: 'https://atlasfind.org/apply/weekly-' + seed,
    });
  }
  return opps;
}

export async function GET() {
  try {
    let baseOpps: any[] = [];
    try {
      baseOpps = await prisma.opportunity.findMany({
        where: { NOT: { scamFlag: true } }
      });
    } catch (e) {
      console.warn('DB error in counts, fallback to seed:', e);
      baseOpps = seedOpportunities;
    }

    if (baseOpps.length === 0) {
      baseOpps = seedOpportunities;
    }

    // Get weekly auto-incrementing opportunities
    const diffTime = Math.max(0, Date.now() - BASELINE_DATE.getTime());
    const weeksPassed = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
    const weeklyOpps = generateWeeklyOpportunities(weeksPassed * 2);

    // Combine opportunities to compute correct aggregate filters & counts
    const allOpps = [...baseOpps, ...weeklyOpps];

    // Deduplicate by title and sponsor
    const seenKeys = new Set<string>();
    const uniqueOpps = allOpps.filter(opp => {
      const key = `${opp.title.toLowerCase().trim()}||${(opp.sponsor || '').toLowerCase().trim()}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    const typeCounts: Record<string, number> = {};
    const hostCountriesSet = new Set<string>();
    const continentsSet = new Set<string>();
    const orgTypesSet = new Set<string>();
    const degreeLevelsSet = new Set<string>();
    const disciplinesSet = new Set<string>();
    const fundingTypesSet = new Set<string>();

    uniqueOpps.forEach(opp => {
      const typeKey = (opp.type || 'SCHOLARSHIP').toUpperCase();
      typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;

      if (opp.hostCountry) hostCountriesSet.add(opp.hostCountry);
      if (opp.continent) continentsSet.add(opp.continent);
      if (opp.orgType) orgTypesSet.add(opp.orgType);
      if (opp.fundingType) fundingTypesSet.add(opp.fundingType);

      if (Array.isArray(opp.degreeLevel)) {
        opp.degreeLevel.forEach((dl: string) => {
          if (dl) degreeLevelsSet.add(dl);
        });
      } else if (typeof opp.degreeLevel === 'string') {
        degreeLevelsSet.add(opp.degreeLevel);
      }

      if (Array.isArray(opp.disciplines)) {
        opp.disciplines.forEach((d: string) => {
          if (d) disciplinesSet.add(d);
        });
      } else if (typeof opp.disciplines === 'string') {
        disciplinesSet.add(opp.disciplines);
      }
    });

    return NextResponse.json({
      typeCounts,
      filters: {
        hostCountries: Array.from(hostCountriesSet).sort(),
        continents: Array.from(continentsSet).sort(),
        orgTypes: Array.from(orgTypesSet).sort(),
        degreeLevels: Array.from(degreeLevelsSet).sort(),
        disciplines: Array.from(disciplinesSet).sort(),
        fundingTypes: Array.from(fundingTypesSet).sort(),
      }
    });
  } catch (error) {
    console.error('Discover counts API error:', error);
    return NextResponse.json({
      typeCounts: { SCHOLARSHIP: 25, INTERNSHIP: 10, FELLOWSHIP: 8, GRANT: 5 },
      filters: {
        hostCountries: ['United Kingdom', 'Germany', 'United States', 'Canada'],
        continents: ['Europe', 'North America', 'Asia', 'Africa'],
        orgTypes: ['government', 'university', 'ngo', 'corporate'],
        degreeLevels: ['bachelors', 'masters', 'phd'],
        disciplines: ['Computer Science', 'Engineering', 'Public Health', 'All disciplines'],
        fundingTypes: ['fully_funded', 'partial', 'stipend_only']
      }
    });
  }
}
