import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyCronAuthorization } from '@/lib/auth/cronAuth';

export async function GET(req: Request) {
  // Enforce CRON_SECRET authorization with constant-time verification
  const auth = verifyCronAuthorization(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: `Unauthorized: ${auth.reason || 'Forbidden'}` }, { status: 401 });
  }

  try {
    const now = new Date();
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const activeOpportunities = await prisma.opportunity.findMany({
      where: {
        scamFlag: false,
      },
    });

    let expiredCount = 0;
    let closingSoonCount = 0;

    for (const opp of activeOpportunities) {
      if (!opp.deadline) continue;

      const deadline = new Date(opp.deadline);

      // Check if expired
      if (deadline < now) {
        // Tag as Expired and update intakes
        if (!opp.tags.includes('Expired')) {
          const updatedTags = opp.tags.filter((t: string) => t !== 'Closing Soon');
          updatedTags.push('Expired');

          await prisma.opportunity.update({
            where: { id: opp.id },
            data: { tags: updatedTags },
          });

          // Update related intakes status to closed
          await prisma.intake.updateMany({
            where: {
              opportunityId: opp.id,
              deadlineDate: { lt: now },
            },
            data: { status: 'closed' },
          });
        }
        expiredCount++;
      }
      // Check if closing soon (< 14 days)
      else if (deadline <= fourteenDaysFromNow) {
        if (!opp.tags.includes('Closing Soon')) {
          const updatedTags = opp.tags.filter((t: string) => t !== 'Expired');
          updatedTags.push('Closing Soon');

          await prisma.opportunity.update({
            where: { id: opp.id },
            data: { tags: updatedTags },
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
        expired: expiredCount,
        closingSoon: closingSoonCount,
      },
    });
  } catch (error: any) {
    console.error('[Deadline Cron Error]', error?.stack || error);
    return NextResponse.json({ error: 'Failed to process deadline checks' }, { status: 500 });
  }
}
