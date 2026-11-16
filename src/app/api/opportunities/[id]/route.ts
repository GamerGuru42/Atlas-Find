import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';
import { evaluateEligibility, CandidateProfile, EvaluatedOpportunity } from '@/lib/matching/engine';
import { assessOpportunityDeadlineHealth } from '@/lib/agents/monitoringAgent';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Missing opportunity ID' }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        intakes: {
          orderBy: { startDate: 'asc' },
        },
        verificationLogs: {
          orderBy: { checkedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Resolve user profile for personalized eligibility assessment
    const verifiedUser = await getVerifiedUser();
    let candidate: CandidateProfile | null = null;

    if (verifiedUser.isLoggedIn && verifiedUser.id !== 'demo_user') {
      try {
        const user = await prisma.user.findUnique({ where: { id: verifiedUser.id } });
        if (user) {
          const profileJson = (user.profileJson as any) || {};
          candidate = {
            nationality: user.countryCode || profileJson.countryCode || null,
            countryCode: user.countryCode || null,
            countryOfResidence: user.detectedCountry || profileJson.countryOfResidence || null,
            fieldOfStudy: user.fieldOfStudy || profileJson.fieldOfStudy || null,
            level: user.level || profileJson.level || null,
            institution: user.institution || profileJson.institution || null,
            graduationYear: user.graduationYear || profileJson.graduationYear || null,
            gpa: profileJson.gpa || null,
            preferredCountries: profileJson.preferredCountries || [],
            targetRegions: profileJson.targetRegions || [],
          };
        }
      } catch {}
    } else {
      const guestCookie = request.cookies.get('atlas_guest_profile')?.value;
      if (guestCookie) {
        try {
          candidate = JSON.parse(decodeURIComponent(guestCookie));
        } catch {}
      }
    }

    const evalOpp: EvaluatedOpportunity = {
      id: opportunity.id,
      title: opportunity.title,
      type: opportunity.type,
      sponsor: opportunity.sponsor,
      hostCountry: opportunity.hostCountry,
      continent: opportunity.continent,
      eligibleCountries: opportunity.eligibleCountries,
      disciplines: opportunity.disciplines,
      degreeLevel: opportunity.degreeLevel,
      fundingType: opportunity.fundingType,
      deadline: opportunity.deadline,
      opensDate: opportunity.opensDate,
      applyUrl: opportunity.applyUrl,
      sourceUrl: opportunity.sourceUrl,
      sourceDomain: opportunity.sourceDomain,
      trustTier: opportunity.trustTier,
      verificationStatus: opportunity.verificationStatus,
      description: opportunity.description,
      eligibility: opportunity.eligibility,
      tags: opportunity.tags,
      intakes: opportunity.intakes,
    };

    const health = assessOpportunityDeadlineHealth(opportunity.id, opportunity.deadline, opportunity.opensDate);
    const eligibilityResult = candidate ? evaluateEligibility(candidate, evalOpp) : null;

    // Fetch related verified opportunities of the same category
    const related = await prisma.opportunity.findMany({
      where: {
        id: { not: id },
        type: opportunity.type,
        scamFlag: false,
      },
      take: 3,
      orderBy: { deadline: 'asc' },
      select: {
        id: true,
        title: true,
        sponsor: true,
        hostCountry: true,
        type: true,
        deadline: true,
        fundingType: true,
        applyUrl: true,
        trustTier: true,
        verificationStatus: true,
      },
    });

    return NextResponse.json({
      opportunity: {
        ...opportunity,
        lifecycleStatus: health.lifecycleStatus,
        daysUntilDeadline: health.daysUntilDeadline,
        isUrgent: health.isUrgent,
        eligibilityAssessment: eligibilityResult,
      },
      related,
    });
  } catch (error: any) {
    console.error('[Opportunity Detail API Error]', error?.stack || error);
    return NextResponse.json({ error: 'Failed to retrieve opportunity details' }, { status: 500 });
  }
}
