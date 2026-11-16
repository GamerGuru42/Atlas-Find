import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { isSafePublicUrl, evaluateDomainTrust } from '@/lib/verification/engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, deadline } = body;
    let { title, applyUrl, hostCountry, hostContinent, sponsor, description, submittedBy } = body;

    // Basic sanitization: strip HTML tags
    const stripHtml = (str: string | undefined) => str ? str.replace(/<[^>]*>?/gm, '').trim() : str;

    title = stripHtml(title);
    hostCountry = stripHtml(hostCountry);
    hostContinent = stripHtml(hostContinent);
    sponsor = stripHtml(sponsor);
    description = stripHtml(description);
    submittedBy = stripHtml(submittedBy);

    // Validate required fields
    if (!title || !applyUrl?.trim()) {
      return NextResponse.json(
        { error: 'Opportunity title and Official Application URL are required.' },
        { status: 400 }
      );
    }

    // SSRF & URL Safety Validation
    const urlCheck = isSafePublicUrl(applyUrl.trim());
    if (!urlCheck.safe) {
      return NextResponse.json(
        { error: `Invalid application URL: ${urlCheck.reason}` },
        { status: 400 }
      );
    }

    // Check for duplicate submissions
    const existing = await prisma.opportunity.findUnique({
      where: { applyUrl: applyUrl.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An opportunity with this application URL has already been submitted.' },
        { status: 409 }
      );
    }

    // Extract domain from URL
    const parsedUrl = new URL(applyUrl.trim());
    const sourceDomain = parsedUrl.hostname.replace(/^www\./, '');
    const domainTrust = evaluateDomainTrust(sourceDomain);

    // Initial risk assessment
    const initialStatus = domainTrust.isUntrusted ? 'flagged' : 'pending';
    const trustTier = domainTrust.tier;

    // Create the opportunity with auditable status
    const opportunity = await prisma.opportunity.create({
      data: {
        title: title.trim(),
        applyUrl: applyUrl.trim(),
        type: (type || 'SCHOLARSHIP').toUpperCase(),
        sponsor: sponsor?.trim() || 'Community Submitted',
        orgType: 'unknown',
        hostCountry: hostCountry?.trim() || 'Global',
        continent: hostContinent?.trim() || null,
        eligibleCountries: [],
        disciplines: [],
        degreeLevel: [],
        fundingType: 'unknown',
        coverageDetails: {},
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        sourceUrl: applyUrl.trim(),
        sourceDomain,
        trustTier,
        scamFlag: domainTrust.isUntrusted,
        verificationStatus: initialStatus,
        description: description?.trim() || '',
        eligibility: '',
        tags: ['community-submitted'],
        submittedBy: submittedBy?.trim() || null,
        submittedAt: new Date(),
      },
    });

    // Record initial submission log
    await prisma.verificationLog.create({
      data: {
        opportunityId: opportunity.id,
        status: initialStatus,
        details: JSON.stringify({
          event: 'community_submission',
          sourceDomain,
          trustTier,
          submittedBy: submittedBy || 'anonymous',
        }),
      },
    });

    return NextResponse.json(
      { success: true, id: opportunity.id, status: initialStatus },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Submission Error]', error?.stack || error);
    return NextResponse.json(
      { error: 'Failed to submit opportunity. Please try again.' },
      { status: 500 }
    );
  }
}
