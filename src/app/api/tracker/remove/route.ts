import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

export async function POST(req: Request) {
  try {
    const verifiedUser = await getVerifiedUser();
    if (!verifiedUser.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { savedOpportunityId } = await req.json();

    if (!savedOpportunityId) {
      return NextResponse.json({ error: 'savedOpportunityId is required' }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await prisma.savedOpportunity.findFirst({
      where: {
        id: savedOpportunityId,
        userId: verifiedUser.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Tracker item not found or unauthorized' }, { status: 404 });
    }

    // Delete associated activities first
    await prisma.opportunityActivity.deleteMany({
      where: { savedOpportunityId },
    });

    await prisma.savedOpportunity.delete({
      where: { id: savedOpportunityId },
    });

    return NextResponse.json({ success: true, message: 'Removed from tracker successfully' });
  } catch (error: any) {
    console.error('Error removing tracker item:', error?.stack || error);
    return NextResponse.json({ error: 'Failed to remove item from tracker' }, { status: 500 });
  }
}
