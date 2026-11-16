import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

export async function POST(req: Request) {
  try {
    const verifiedUser = await getVerifiedUser();
    if (!verifiedUser.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { savedOpportunityId, notes, checklistProgress, documents, reminderDays, reminderSet, status } = await req.json();

    if (!savedOpportunityId) {
      return NextResponse.json({ error: 'savedOpportunityId is required' }, { status: 400 });
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

    const updateData: any = {};
    if (notes !== undefined) updateData.notes = notes;
    if (checklistProgress !== undefined) updateData.checklistProgress = checklistProgress;
    if (documents !== undefined) updateData.documents = documents;
    if (reminderDays !== undefined) updateData.reminderDays = reminderDays;
    if (reminderSet !== undefined) updateData.reminderSet = reminderSet;
    if (status !== undefined) updateData.status = status;

    const updatedRecord = await prisma.savedOpportunity.update({
      where: { id: savedOpportunityId },
      data: updateData,
      include: {
        opportunity: true,
      },
    });

    // Log activity
    await prisma.opportunityActivity.create({
      data: {
        savedOpportunityId,
        userId: verifiedUser.id,
        action: notes !== undefined ? 'updated_notes' : 'updated_details',
        metadata: updateData,
      },
    }).catch((err: any) => console.error('Activity log error:', err));

    return NextResponse.json({ success: true, updatedRecord });
  } catch (error: any) {
    console.error('Error updating tracker item details:', error?.stack || error);
    return NextResponse.json({ error: 'Failed to update details' }, { status: 500 });
  }
}
