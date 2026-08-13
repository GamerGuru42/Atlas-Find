import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { seedOpportunities } from '@/data/seed/opportunities';

function normalizeSeedOpportunity(opp: any) {
  return {
    id: opp.id,
    title: opp.title,
    type: (opp.type || 'SCHOLARSHIP').toUpperCase(),
    sponsor: opp.sponsor || 'Global Sponsor',
    orgType: opp.orgType || 'organization',
    hostCountry: opp.hostCountry || 'Global',
    continent: opp.continent || 'Global',
    eligibleCountries: opp.eligibleCountries || [],
    disciplines: opp.disciplines || [],
    degreeLevel: opp.degreeLevel || [],
    fundingType: opp.fundingType || 'fully_funded',
    coverageDetails: opp.coverage || opp.coverageDetails || {},
    deadline: opp.deadline || '2027-12-31',
    opensDate: opp.opensDate || null,
    applyUrl: opp.applyUrl || '#',
    sourceUrl: opp.sourceUrl || '#',
    sourceDomain: opp.sourceDomain || 'atlasfind.org',
    trustTier: opp.trustTier || 1,
    verificationStatus: 'verified',
    scamFlag: false,
    description: opp.description || '',
    eligibility: opp.eligibility || '',
    createdAt: opp.lastVerifiedAt || new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const continent = searchParams.get('continent');
  const hostCountry = searchParams.get('hostCountry');
  const fundingType = searchParams.get('fundingType');
  const orgType = searchParams.get('orgType');
  const level = searchParams.get('level');
  const discipline = searchParams.get('discipline');
  const search = searchParams.get('search');
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '21');
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, any> = {
      NOT: { scamFlag: true }
    };

    if (type && type !== 'ALL') {
      where.type = {
        in: [type, type.toLowerCase(), type.toUpperCase()]
      };
    }
    if (continent) {
      const continents = continent.split(',').filter(Boolean);
      if (continents.length > 0) where.continent = { in: continents };
    }
    if (hostCountry) {
      const countries = hostCountry.split(',').filter(Boolean);
      if (countries.length > 0) where.hostCountry = { in: countries };
    }
    if (fundingType) {
      const fundingTypes = fundingType.split(',').filter(Boolean);
      if (fundingTypes.length > 0) where.fundingType = { in: fundingTypes };
    }
    if (orgType) {
      const orgTypes = orgType.split(',').filter(Boolean);
      if (orgTypes.length > 0) where.orgType = { in: orgTypes };
    }
    if (level) {
      const levels = level.split(',').filter(Boolean);
      if (levels.length > 0) where.degreeLevel = { hasSome: levels };
    }
    if (discipline) {
      const disciplines = discipline.split(',').filter(Boolean);
      if (disciplines.length > 0) where.disciplines = { hasSome: disciplines };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { sponsor: { contains: search, mode: 'insensitive' } },
        { hostCountry: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let opportunities: any[] = [];
    let totalCount = 0;

    try {
      [opportunities, totalCount] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          orderBy: { deadline: 'asc' },
          skip,
          take: limit,
        }),
        prisma.opportunity.count({ where }),
      ]);
    } catch (dbErr) {
      console.warn('Prisma DB query error, using seed fallback:', dbErr);
    }

    // If database returned 0 opportunities, fallback to seed dataset
    if (totalCount === 0) {
      const allSeed = seedOpportunities.map(normalizeSeedOpportunity);
      
      const filtered = allSeed.filter((opp) => {
        if (type && type !== 'ALL' && opp.type.toUpperCase() !== type.toUpperCase()) {
          return false;
        }
        if (continent) {
          const continents = continent.split(',').filter(Boolean).map(c => c.toLowerCase());
          if (continents.length > 0 && !continents.includes(opp.continent.toLowerCase())) {
            return false;
          }
        }
        if (hostCountry) {
          const countries = hostCountry.split(',').filter(Boolean).map(c => c.toLowerCase());
          if (countries.length > 0 && !countries.includes(opp.hostCountry.toLowerCase())) {
            return false;
          }
        }
        if (fundingType) {
          const fundingTypes = fundingType.split(',').filter(Boolean).map(f => f.toLowerCase());
          if (fundingTypes.length > 0 && !fundingTypes.includes(opp.fundingType.toLowerCase())) {
            return false;
          }
        }
        if (orgType) {
          const orgTypes = orgType.split(',').filter(Boolean).map(o => o.toLowerCase());
          if (orgTypes.length > 0 && !orgTypes.includes(opp.orgType.toLowerCase())) {
            return false;
          }
        }
        if (level) {
          const levels = level.split(',').filter(Boolean).map(l => l.toLowerCase());
          if (levels.length > 0 && !opp.degreeLevel.some((dl: string) => levels.includes(dl.toLowerCase()))) {
            return false;
          }
        }
        if (discipline) {
          const disciplines = discipline.split(',').filter(Boolean).map(d => d.toLowerCase());
          if (disciplines.length > 0 && !opp.disciplines.some((dp: string) => disciplines.some(d => dp.toLowerCase().includes(d)))) {
            return false;
          }
        }
        if (search) {
          const q = search.toLowerCase();
          const matches =
            opp.title.toLowerCase().includes(q) ||
            opp.sponsor.toLowerCase().includes(q) ||
            opp.hostCountry.toLowerCase().includes(q) ||
            opp.description.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      });

      totalCount = filtered.length;
      opportunities = filtered.slice(skip, skip + limit);
    } else {
      // Ensure returned DB opportunities have uppercase type format for UI consistency
      opportunities = opportunities.map(opp => ({
        ...opp,
        type: (opp.type || 'SCHOLARSHIP').toUpperCase()
      }));
    }

    return NextResponse.json({
      opportunities,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error) {
    console.error('Discover API error:', error);
    // Ultimate safety net fallback
    const fallbackList = seedOpportunities.slice(skip, skip + limit).map(normalizeSeedOpportunity);
    return NextResponse.json({
      opportunities: fallbackList,
      totalCount: seedOpportunities.length,
      page: 1,
      totalPages: Math.ceil(seedOpportunities.length / limit) || 1,
    });
  }
}
