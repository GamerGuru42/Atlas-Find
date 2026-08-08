import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const level = searchParams.get('level');
  const country = searchParams.get('country');
  const fundingType = searchParams.get('fundingType');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Build Prisma where clause
    const where: Record<string, unknown> = {
      verificationStatus: 'verified',
      scamFlag: false,
    };

    if (level) {
      where.degreeLevel = { has: level };
    }
    if (country) {
      where.hostCountry = country;
    }
    if (fundingType) {
      where.fundingType = fundingType;
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

    let [opportunities, count] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy: { deadline: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.opportunity.count({ where }),
    ]);

    // Fallback: If no verified opportunities match, try fetching unverified ones (but not scams)
    if (count === 0 && where.verificationStatus === 'verified') {
      delete where.verificationStatus;
      const fallbackResult = await Promise.all([
        prisma.opportunity.findMany({
          where,
          orderBy: { deadline: 'asc' },
          skip: offset,
          take: limit,
        }),
        prisma.opportunity.count({ where }),
      ]);
      opportunities = fallbackResult[0];
      count = fallbackResult[1];
    }

    return NextResponse.json({
      opportunities,
      count,
      hasMore: (offset + limit) < count,
    });
  } catch (error) {
    console.error('Discover API error:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}
