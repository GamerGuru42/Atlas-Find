import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { savedOpportunityId, notes, checklistProgress, documents, reminderDays, reminderSet, status } = await req.json();

    if (!savedOpportunityId) {
      return NextResponse.json({ error: 'savedOpportunityId is required' }, { status: 400 });
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
        userId: updatedRecord.userId,
        action: notes !== undefined ? 'updated_notes' : 'updated_details',
        metadata: updateData,
      },
    }).catch(err => console.error('Activity log error:', err));

    return NextResponse.json({ success: true, updatedRecord });
  } catch (error) {
    console.error('Error updating tracker item details:', error);
    return NextResponse.json({ error: 'Failed to update details' }, { status: 500 });
  }
}
