import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { savedOpportunityId } = await req.json();

    if (!savedOpportunityId) {
      return NextResponse.json({ error: 'savedOpportunityId is required' }, { status: 400 });
    }

    await prisma.savedOpportunity.delete({
      where: { id: savedOpportunityId },
    });

    return NextResponse.json({ success: true, message: 'Removed from tracker successfully' });
  } catch (error) {
    console.error('Error removing tracker item:', error);
    return NextResponse.json({ error: 'Failed to remove item from tracker' }, { status: 500 });
  }
}
