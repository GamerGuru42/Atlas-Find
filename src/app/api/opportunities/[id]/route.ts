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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing opportunity ID' }, { status: 400 });
    }

    let opportunity: any = null;
    let related: any[] = [];

    try {
      opportunity = await prisma.opportunity.findUnique({
        where: { id },
      });

      if (opportunity) {
        related = await prisma.opportunity.findMany({
          where: {
            id: { not: id },
            type: opportunity.type,
            NOT: { scamFlag: true }
          },
          take: 3,
          orderBy: { deadline: 'asc' }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma ID lookup error, using seed fallback:', dbErr);
    }

    // Fallback to seed dataset
    if (!opportunity) {
      const matchSeed = seedOpportunities.find(o => o.id === id);
      if (matchSeed) {
        opportunity = normalizeSeedOpportunity(matchSeed);
        related = seedOpportunities
          .filter(o => o.id !== id && (o.type || '').toLowerCase() === (matchSeed.type || '').toLowerCase())
          .slice(0, 3)
          .map(normalizeSeedOpportunity);
      }
    }

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ opportunity, related });
  } catch (error) {
    console.error('API Error fetching opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
