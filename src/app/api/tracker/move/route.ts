import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

export async function POST(req: Request) {
  try {
    const verifiedUser = await getVerifiedUser();
    if (!verifiedUser.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { savedOpportunityId, fromColumn, toColumn } = await req.json();

    if (!savedOpportunityId || !toColumn) {
      return NextResponse.json({ error: 'savedOpportunityId and toColumn are required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.savedOpportunity.findFirst({
      where: {
        id: savedOpportunityId,
        userId: verifiedUser.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Tracker item not found or unauthorized' }, { status: 404 });
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
        userId: verifiedUser.id,
        action: 'moved',
        fromStatus: fromColumn || existing.status,
        toStatus: toColumn.toLowerCase(),
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    }).catch((err: any) => console.error('Activity log error:', err));

    return NextResponse.json({ success: true, updatedRecord });
  } catch (error: any) {
    console.error('Error moving opportunity card:', error?.stack || error);
    return NextResponse.json({ error: 'Failed to update status. Please try again.' }, { status: 500 });
  }
}
