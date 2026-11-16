import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAdminAccess } from '@/lib/auth/adminAuth';

export async function GET(request: Request) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        OR: [
          { verificationStatus: 'pending' },
          { verificationStatus: 'unverified' },
          { verificationStatus: 'flagged' },
        ],
      },
      include: {
        verificationLogs: {
          orderBy: { checkedAt: 'desc' },
          take: 3,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ opportunities });
  } catch (error: any) {
    console.error('Failed to fetch pending opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action, data, reason } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required opportunity id or action' }, { status: 400 });
    }

    const existing = await prisma.opportunity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    let newStatus = existing.verificationStatus;
    let trustTier = existing.trustTier;
    let scamFlag = existing.scamFlag;

    if (action === 'approve') {
      newStatus = 'verified';
      trustTier = Math.min(existing.trustTier, 2);
      scamFlag = false;
    } else if (action === 'reject') {
      newStatus = 'rejected';
      scamFlag = true;
    } else if (action === 'flag') {
      newStatus = 'flagged';
      scamFlag = true;
    } else if (action === 'update' && data) {
      if (data.verificationStatus) newStatus = data.verificationStatus;
    } else {
      return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
    }

    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        ...(action === 'update' && data ? data : {}),
        verificationStatus: newStatus,
        trustTier,
        scamFlag,
      },
    });

    // Record auditable verification log entry
    await prisma.verificationLog.create({
      data: {
        opportunityId: id,
        status: newStatus,
        details: JSON.stringify({
          action,
          reviewer: auth.reviewer,
          previousStatus: existing.verificationStatus,
          reason: reason || `Admin action: ${action}`,
          updatedAt: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json({ success: true, opportunity: updated });
  } catch (error: any) {
    console.error('Failed to update opportunity:', error);
    return NextResponse.json({ error: 'Failed to update opportunity' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Delete associated logs and intakes first to preserve referential integrity
    await prisma.verificationLog.deleteMany({ where: { opportunityId: id } });
    await prisma.intake.deleteMany({ where: { opportunityId: id } });
    await prisma.savedOpportunity.deleteMany({ where: { opportunityId: id } });

    await prisma.opportunity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: `Opportunity ${id} deleted.` });
  } catch (error: any) {
    console.error('Failed to delete opportunity:', error);
    return NextResponse.json({ error: 'Failed to delete opportunity' }, { status: 500 });
  }
}
