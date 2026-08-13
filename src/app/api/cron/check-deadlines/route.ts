import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // Simple auth header check for cron secret if configured
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const activeOpportunities = await prisma.opportunity.findMany({
      where: { verificationStatus: { not: 'closed' } },
    });

    let closedCount = 0;
    let closingSoonCount = 0;

    for (const opp of activeOpportunities) {
      if (!opp.deadline) continue;

      const deadline = new Date(opp.deadline);

      // Check if expired
      if (deadline < now) {
        await prisma.opportunity.update({
          where: { id: opp.id },
          data: { verificationStatus: 'closed' },
        });

        // Also update or create intake status as closed
        await prisma.intake.create({
          data: {
            opportunityId: opp.id,
            intakeName: `${deadline.getFullYear()}/${deadline.getFullYear() + 1} Academic Intake`,
            deadlineDate: deadline,
            status: 'closed',
          },
        }).catch(() => {}); // ignore duplicates

        closedCount++;
      } 
      // Check if closing soon (< 14 days)
      else if (deadline <= fourteenDaysFromNow) {
        if (!opp.tags.includes('Closing Soon')) {
          await prisma.opportunity.update({
            where: { id: opp.id },
            data: { tags: { push: 'Closing Soon' } },
          });
        }
        closingSoonCount++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        totalChecked: activeOpportunities.length,
        closed: closedCount,
        closingSoon: closingSoonCount,
      },
    });
  } catch (error) {
    console.error('Deadline Cron Error:', error);
    return NextResponse.json({ error: 'Failed to process deadline checks' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
