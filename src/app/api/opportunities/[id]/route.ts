import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing opportunity ID' }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Fetch related opportunities based on type and degreeLevel
    const related = await prisma.opportunity.findMany({
      where: {
        id: { not: id },
        type: opportunity.type,
        verificationStatus: 'verified',
        scamFlag: false
      },
      take: 3,
      orderBy: { deadline: 'asc' }
    });

    return NextResponse.json({ opportunity, related });
  } catch (error) {
    console.error('API Error fetching opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
