import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

export async function GET(req: Request) {
  try {
    const verifiedUser = await getVerifiedUser();

    const savedOpportunities = await prisma.savedOpportunity.findMany({
      where: { userId: verifiedUser.id },
      include: {
        opportunity: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      userTier: verifiedUser.tier,
      isLoggedIn: verifiedUser.isLoggedIn,
      totalSaved: savedOpportunities.length,
      saveLimit: verifiedUser.tier === 'free' ? 20 : -1,
      trackedItems: savedOpportunities,
    });
  } catch (error) {
    console.error('Error fetching tracker items:', error);
    return NextResponse.json({ error: 'Failed to fetch tracker items' }, { status: 500 });
  }
}
