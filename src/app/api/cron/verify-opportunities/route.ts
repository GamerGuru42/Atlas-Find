import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyOpportunityIntegrity } from '@/lib/verification/engine';
import { verifyCronAuthorization } from '@/lib/auth/cronAuth';

export async function GET(req: Request) {
  // Enforce CRON_SECRET authorization with constant-time verification
  const auth = verifyCronAuthorization(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: `Unauthorized: ${auth.reason || 'Forbidden'}` }, { status: 401 });
  }

  try {
    // Select batch of opportunities requiring re-verification (e.g. oldest verified or pending)
    const candidates = await prisma.opportunity.findMany({
      take: 15,
      orderBy: { updatedAt: 'asc' },
    });

    const results = [];

    for (const opp of candidates) {
      const evidence = await verifyOpportunityIntegrity({
        id: opp.id,
        title: opp.title,
        sponsor: opp.sponsor,
        applyUrl: opp.applyUrl,
        sourceUrl: opp.sourceUrl,
        sourceDomain: opp.sourceDomain,
        deadline: opp.deadline,
        description: opp.description,
        eligibility: opp.eligibility,
        verificationStatus: opp.verificationStatus,
      }, {
        probeNetwork: true,
        timeoutMs: 6000,
      });

      // Map outcome to verification status without false accusations
      let newStatus = opp.verificationStatus;
      if (evidence.outcome === 'flagged') {
        newStatus = 'flagged';
      } else if (evidence.outcome === 'verified') {
        newStatus = 'verified';
      } else if (evidence.outcome === 'requires_review') {
        newStatus = 'unverified';
      }

      // Update opportunity record
      await prisma.opportunity.update({
        where: { id: opp.id },
        data: {
          verificationStatus: newStatus,
          trustTier: evidence.trustTier,
          scamFlag: evidence.outcome === 'flagged',
        },
      });

      // Create auditable verification log entry
      await prisma.verificationLog.create({
        data: {
          opportunityId: opp.id,
          status: evidence.outcome,
          details: JSON.stringify({
            checkedAt: evidence.checkedAt,
            method: evidence.method,
            httpStatus: evidence.httpStatus,
            responseTimeMs: evidence.responseTimeMs,
            riskScore: evidence.riskScore,
            flags: evidence.flags,
            reasons: evidence.reasons,
          }),
        },
      });

      results.push({
        id: opp.id,
        title: opp.title,
        outcome: evidence.outcome,
        riskScore: evidence.riskScore,
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      auditRecords: results,
    });
  } catch (error: any) {
    console.error('[Verification Cron Error]', error?.stack || error);
    return NextResponse.json({ error: 'Failed to execute scheduled verification' }, { status: 500 });
  }
}

