import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In a real app, verify admin session using Supabase auth here.
// For now, simple GET to fetch pending.

export async function GET(request: Request) {
  try {
    const pendingOpps = await prisma.opportunity.findMany({
      where: { verificationStatus: 'pending' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ opportunities: pendingOpps });
  } catch (error) {
    console.error('Error fetching admin opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, data } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    if (action === 'approve') {
      const updated = await prisma.opportunity.update({
        where: { id },
        data: { verificationStatus: 'verified', trustTier: 2 }, // Upgrade trust on approval
      });
      return NextResponse.json({ success: true, opportunity: updated });
    }
    
    if (action === 'reject') {
      const updated = await prisma.opportunity.update({
        where: { id },
        data: { verificationStatus: 'rejected' },
      });
      return NextResponse.json({ success: true, opportunity: updated });
    }

    if (action === 'edit' && data) {
      const updated = await prisma.opportunity.update({
        where: { id },
        data,
      });
      return NextResponse.json({ success: true, opportunity: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.opportunity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
