import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, applyUrl, type, hostCountry, deadline, sponsor, description, submittedBy } = body;

    // Validate required fields
    if (!title?.trim() || !applyUrl?.trim()) {
      return NextResponse.json(
        { error: 'Title and Application URL are required.' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(applyUrl);
    } catch {
      return NextResponse.json(
        { error: 'Please provide a valid URL.' },
        { status: 400 }
      );
    }

    // Check for duplicate submissions
    const existing = await prisma.opportunity.findUnique({
      where: { applyUrl: applyUrl.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This opportunity has already been submitted.' },
        { status: 409 }
      );
    }

    // Extract domain from URL
    const parsedUrl = new URL(applyUrl);
    const sourceDomain = parsedUrl.hostname.replace('www.', '');

    // Create the opportunity with PENDING status
    const opportunity = await prisma.opportunity.create({
      data: {
        title: title.trim(),
        applyUrl: applyUrl.trim(),
        type: type || 'SCHOLARSHIP',
        sponsor: sponsor?.trim() || 'Community Submitted',
        orgType: 'unknown',
        hostCountry: hostCountry?.trim() || 'Unknown',
        eligibleCountries: [],
        disciplines: [],
        degreeLevel: [],
        fundingType: 'unknown',
        coverageDetails: {},
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // default 6 months from now
        sourceUrl: applyUrl.trim(),
        sourceDomain,
        trustTier: 3, // untrusted by default
        scamFlag: false,
        verificationStatus: 'pending',
        description: description?.trim() || '',
        eligibility: '',
        tags: ['community-submitted'],
        submittedBy: submittedBy?.trim() || null,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, id: opportunity.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit opportunity. Please try again.' },
      { status: 500 }
    );
  }
}
