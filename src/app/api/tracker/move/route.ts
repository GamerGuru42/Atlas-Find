import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { savedOpportunityId, fromColumn, toColumn, userId = 'default_user' } = await req.json();

    if (!savedOpportunityId || !toColumn) {
      return NextResponse.json({ error: 'savedOpportunityId and toColumn are required' }, { status: 400 });
    }

    // Update status in SavedOpportunity table
    const updatedRecord = await prisma.savedOpportunity.update({
      where: { id: savedOpportunityId },
      data: {
        status: toColumn.toLowerCase(),
      },
      include: {
        opportunity: true,
      },
    });

    // Log activity in OpportunityActivity table
    await prisma.opportunityActivity.create({
      data: {
        savedOpportunityId,
        userId: updatedRecord.userId || userId,
        action: 'moved',
        fromStatus: fromColumn || 'saved',
        toStatus: toColumn.toLowerCase(),
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    }).catch(err => console.error('Activity log error:', err));

    return NextResponse.json({ success: true, updatedRecord });
  } catch (error) {
    console.error('Error moving opportunity card:', error);
    return NextResponse.json({ error: 'Failed to update status. Please try again.' }, { status: 500 });
  }
}
