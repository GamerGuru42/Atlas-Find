import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

export async function POST(req: Request) {
  try {
    const { opportunityId, status = 'saved' } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'opportunityId is required' }, { status: 400 });
    }

    const verifiedUser = await getVerifiedUser();

    // Count existing saved opportunities for this user
    const existingCount = await prisma.savedOpportunity.count({
      where: { userId: verifiedUser.id },
    });

    // Check if item already exists in saved list
    const existingRecord = await prisma.savedOpportunity.findUnique({
      where: {
        userId_opportunityId: {
          userId: verifiedUser.id,
          opportunityId,
        },
      },
    });

    // Enforce Free Tier Save Limit (20 saved opportunities max)
    if (verifiedUser.tier === 'free' && existingCount >= 20 && !existingRecord) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          requiresUpgrade: true,
          message: 'Free tier save limit reached (20 opportunities). Upgrade to Pro to save unlimited opportunities!',
          currentCount: existingCount,
          maxLimit: 20
        },
        { status: 403 }
      );
    }

    // Create or update SavedOpportunity record
    const savedRecord = await prisma.savedOpportunity.upsert({
      where: {
        userId_opportunityId: {
          userId: verifiedUser.id,
          opportunityId,
        },
      },
      update: {
        status: status.toLowerCase(),
      },
      create: {
        userId: verifiedUser.id,
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
        userId: verifiedUser.id,
        action: 'added',
        toStatus: status.toLowerCase(),
      },
    }).catch(err => console.error('Activity log error:', err));

    return NextResponse.json({
      success: true,
      savedRecord,
      totalSaved: existingCount + (existingRecord ? 0 : 1),
      userTier: verifiedUser.tier
    });
  } catch (error) {
    console.error('Error adding to tracker:', error);
    return NextResponse.json({ error: 'Failed to add opportunity to tracker' }, { status: 500 });
  }
}
