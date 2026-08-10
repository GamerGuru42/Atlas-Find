import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const types = await prisma.opportunity.groupBy({
      by: ['type'],
      _count: { type: true }
    });

    // Dynamic filters
    const [hostCountries, continents, orgTypes, degreeLevels, disciplines, fundingTypes] = await Promise.all([
      prisma.opportunity.findMany({ select: { hostCountry: true }, distinct: ['hostCountry'] }),
      prisma.opportunity.findMany({ select: { continent: true }, distinct: ['continent'] }),
      prisma.opportunity.findMany({ select: { orgType: true }, distinct: ['orgType'] }),
      prisma.opportunity.findMany({ select: { degreeLevel: true } }), // Need to flatten array
      prisma.opportunity.findMany({ select: { disciplines: true } }), // Need to flatten array
      prisma.opportunity.findMany({ select: { fundingType: true }, distinct: ['fundingType'] })
    ]);

    const typeCounts = types.reduce((acc, curr) => {
      acc[curr.type] = curr._count.type;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      typeCounts,
      filters: {
        hostCountries: hostCountries.map(o => o.hostCountry).filter(Boolean),
        continents: continents.map(o => o.continent).filter(Boolean),
        orgTypes: orgTypes.map(o => o.orgType).filter(Boolean),
        degreeLevels: Array.from(new Set(degreeLevels.flatMap(o => o.degreeLevel))).filter(Boolean),
        disciplines: Array.from(new Set(disciplines.flatMap(o => o.disciplines))).filter(Boolean),
        fundingTypes: fundingTypes.map(o => o.fundingType).filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Discover counts API error:', error);
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
