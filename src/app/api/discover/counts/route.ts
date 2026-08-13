import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { seedOpportunities } from '@/data/seed/opportunities';

export async function GET() {
  try {
    let typeCounts: Record<string, number> = {};
    let hostCountries: string[] = [];
    let continents: string[] = [];
    let orgTypes: string[] = [];
    let degreeLevels: string[] = [];
    let disciplines: string[] = [];
    let fundingTypes: string[] = [];

    try {
      const types = await prisma.opportunity.groupBy({
        by: ['type'],
        _count: { type: true }
      });

      if (types && types.length > 0) {
        types.forEach(curr => {
          const upperKey = (curr.type || '').toUpperCase();
          typeCounts[upperKey] = (typeCounts[upperKey] || 0) + curr._count.type;
        });

        const [hc, cont, ot, dl, disc, ft] = await Promise.all([
          prisma.opportunity.findMany({ select: { hostCountry: true }, distinct: ['hostCountry'] }),
          prisma.opportunity.findMany({ select: { continent: true }, distinct: ['continent'] }),
          prisma.opportunity.findMany({ select: { orgType: true }, distinct: ['orgType'] }),
          prisma.opportunity.findMany({ select: { degreeLevel: true } }),
          prisma.opportunity.findMany({ select: { disciplines: true } }),
          prisma.opportunity.findMany({ select: { fundingType: true }, distinct: ['fundingType'] })
        ]);

        hostCountries = hc.map(o => o.hostCountry).filter((x): x is string => Boolean(x));
        continents = cont.map(o => o.continent).filter((x): x is string => Boolean(x));
        orgTypes = ot.map(o => o.orgType).filter((x): x is string => Boolean(x));
        degreeLevels = Array.from(new Set(dl.flatMap(o => o.degreeLevel))).filter((x): x is string => Boolean(x));
        disciplines = Array.from(new Set(disc.flatMap(o => o.disciplines))).filter((x): x is string => Boolean(x));
        fundingTypes = ft.map(o => o.fundingType).filter((x): x is string => Boolean(x));
      }
    } catch (dbErr) {
      console.warn('Prisma count error, using seed fallback:', dbErr);
    }

    // Fallback to seedOpportunities if typeCounts is empty
    if (Object.keys(typeCounts).length === 0) {
      (seedOpportunities as any[]).forEach(opp => {
        const typeKey = (opp.type || 'SCHOLARSHIP').toUpperCase();
        typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;

        if (opp.hostCountry && !hostCountries.includes(opp.hostCountry)) hostCountries.push(opp.hostCountry);
        if (opp.continent && !continents.includes(opp.continent)) continents.push(opp.continent);
        if (opp.orgType && !orgTypes.includes(opp.orgType)) orgTypes.push(opp.orgType);
        if (opp.fundingType && !fundingTypes.includes(opp.fundingType)) fundingTypes.push(opp.fundingType);

        if (Array.isArray(opp.degreeLevel)) {
          opp.degreeLevel.forEach((dl: string) => {
            if (dl && !degreeLevels.includes(dl)) degreeLevels.push(dl);
          });
        }
        if (Array.isArray(opp.disciplines)) {
          opp.disciplines.forEach((d: string) => {
            if (d && !disciplines.includes(d)) disciplines.push(d);
          });
        }
      });
    }

    return NextResponse.json({
      typeCounts,
      filters: {
        hostCountries,
        continents,
        orgTypes,
        degreeLevels,
        disciplines,
        fundingTypes
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
