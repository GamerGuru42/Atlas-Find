import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { opportunityId, status = 'saved', userId = 'default_user' } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'opportunityId is required' }, { status: 400 });
    }

    // Find user or create temporary demo user
    let user = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { email: 'demo@atlasfind.com' }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'demo@atlasfind.com',
          tier: 'free',
        },
      });
    }

    // Count existing saved opportunities for this user
    const existingCount = await prisma.savedOpportunity.count({
      where: { userId: user.id },
    });

    // Enforce Free Tier Limit (1 card max)
    if (user.tier === 'free' && existingCount >= 1) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: 'Upgrade to Pro for unlimited application tracking.',
          currentCount: existingCount,
        },
        { status: 403 }
      );
    }

    // Create or update SavedOpportunity record
    const savedRecord = await prisma.savedOpportunity.upsert({
      where: {
        userId_opportunityId: {
          userId: user.id,
          opportunityId,
        },
      },
      update: {
        status: status.toLowerCase(),
      },
      create: {
        userId: user.id,
        opportunityId,
        status: status.toLowerCase(),
      },
      include: {
        opportunity: true,
      },
    });

    // Log activity
    await prisma.opportunityActivity.create({
      data: {
        savedOpportunityId: savedRecord.id,
        userId: user.id,
        action: 'added',
        toStatus: status.toLowerCase(),
      },
    }).catch(err => console.error('Activity log error:', err));

    return NextResponse.json({ success: true, savedRecord });
  } catch (error) {
    console.error('Error adding to tracker:', error);
    return NextResponse.json({ error: 'Failed to add opportunity to tracker' }, { status: 500 });
  }
}
