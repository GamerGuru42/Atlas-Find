import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

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

    const savedOpportunities = await prisma.savedOpportunity.findMany({
      where: { userId: user.id },
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
      userTier: user.tier || 'free',
      trackedItems: savedOpportunities,
    });
  } catch (error) {
    console.error('Error fetching tracker items:', error);
    return NextResponse.json({ error: 'Failed to fetch tracker items' }, { status: 500 });
  }
}
