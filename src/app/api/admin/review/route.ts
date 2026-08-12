import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to check admin password
function checkAdminAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'atlasadmin'; // default fallback for testing
  
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        verificationStatus: 'pending',
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
    
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Failed to fetch pending opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action, data } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    let updated;
    if (action === 'approve') {
      updated = await prisma.opportunity.update({
        where: { id },
        data: { verificationStatus: 'VERIFIED' },
      });
    } else if (action === 'reject') {
      updated = await prisma.opportunity.update({
        where: { id },
        data: { verificationStatus: 'REJECTED' },
      });
    } else if (action === 'update' && data) {
      updated = await prisma.opportunity.update({
        where: { id },
        data,
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, opportunity: updated });
  } catch (error) {
    console.error('Failed to update opportunity:', error);
    return NextResponse.json({ error: 'Failed to update opportunity' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    console.error('Failed to delete opportunity:', error);
    return NextResponse.json({ error: 'Failed to delete opportunity' }, { status: 500 });
  }
}
