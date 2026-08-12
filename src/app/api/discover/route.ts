import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

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
      verificationStatus: 'verified',
      scamFlag: false,
    };

    if (type && type !== 'ALL') where.type = type;
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
        { disciplines: { has: search } },
      ];
    }

    let [opportunities, totalCount] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy: { deadline: 'asc' },
        skip,
        take: limit,
      }),
      prisma.opportunity.count({ where }),
    ]);

    // Fallback if zero found and it was filtered by verified
    if (totalCount === 0 && where.verificationStatus === 'verified') {
      delete where.verificationStatus;
      const fallbackResult = await Promise.all([
        prisma.opportunity.findMany({
          where,
          orderBy: { deadline: 'asc' },
          skip,
          take: limit,
        }),
        prisma.opportunity.count({ where }),
      ]);
      opportunities = fallbackResult[0];
      totalCount = fallbackResult[1];
    }

    return NextResponse.json({
      opportunities,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Discover API error:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}
