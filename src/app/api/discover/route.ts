import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';
import { evaluateEligibility, CandidateProfile, EvaluatedOpportunity } from '@/lib/matching/engine';
import { assessOpportunityDeadlineHealth } from '@/lib/agents/monitoringAgent';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const continent = searchParams.get('continent');
  const hostCountry = searchParams.get('hostCountry');
  const fundingType = searchParams.get('fundingType');
  const orgType = searchParams.get('orgType');
  const level = searchParams.get('level');
  const discipline = searchParams.get('discipline');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'atlas_score';
  const status = searchParams.get('status'); // 'open' | 'closed' | 'all'
  
  // January 2027 & Start Date filters
  const startDateFrom = searchParams.get('startDateFrom');
  const startDateTo = searchParams.get('startDateTo');
  const intakeYear = searchParams.get('intakeYear');
  const intakeMonth = searchParams.get('intakeMonth');
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '21')));
  const skip = (page - 1) * limit;

  try {
    // 1. Resolve User Profile for Genuine Eligibility Assessment
    const verifiedUser = await getVerifiedUser();
    let candidate: CandidateProfile | null = null;
    let hasProfile = false;

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
            workExperienceYears: profileJson.workExperienceYears || null,
            workExperienceField: profileJson.workExperienceField || null,
            fundingNeeds: profileJson.fundingNeeds || null,
            preferredCountries: profileJson.preferredCountries || [],
            targetRegions: profileJson.targetRegions || [],
          };
          if (candidate.fieldOfStudy || candidate.level || candidate.nationality) {
            hasProfile = true;
          }
        }
      } catch (err) {
        console.warn('[Discover] Could not fetch user profile:', err);
      }
    } else {
      // Guest profile from cookie
      const guestProfileCookie = request.cookies.get('atlas_guest_profile')?.value;
      if (guestProfileCookie) {
        try {
          const parsed = JSON.parse(decodeURIComponent(guestProfileCookie));
          if (parsed && (parsed.fieldOfStudy || parsed.level || parsed.nationality || parsed.countryCode)) {
            candidate = {
              nationality: parsed.nationality || parsed.countryCode || null,
              countryCode: parsed.countryCode || null,
              fieldOfStudy: parsed.fieldOfStudy || null,
              level: parsed.level || null,
              institution: parsed.institution || null,
              graduationYear: parsed.graduationYear || null,
              gpa: parsed.gpa || null,
            };
            hasProfile = true;
          }
        } catch {}
      }
    }

    // 2. Build Prisma Database Query Filters
    const whereClause: any = {
      scamFlag: false,
    };

    // Filter by type
    if (type && type !== 'ALL') {
      whereClause.type = {
        equals: type.toUpperCase(),
        mode: 'insensitive',
      };
    }

    // Filter by host country
    if (hostCountry) {
      const countries = hostCountry.split(',').filter(Boolean);
      if (countries.length === 1) {
        whereClause.hostCountry = { contains: countries[0].trim(), mode: 'insensitive' };
      } else if (countries.length > 1) {
        whereClause.hostCountry = { in: countries.map(c => c.trim()) };
      }
    }

    // Filter by continent
    if (continent) {
      const continents = continent.split(',').filter(Boolean);
      if (continents.length === 1) {
        whereClause.continent = { contains: continents[0].trim(), mode: 'insensitive' };
      } else if (continents.length > 1) {
        whereClause.continent = { in: continents.map(c => c.trim()) };
      }
    }

    // Filter by funding type
    if (fundingType) {
      const fTypes = fundingType.split(',').filter(Boolean);
      if (fTypes.length === 1) {
        whereClause.fundingType = { equals: fTypes[0].trim(), mode: 'insensitive' };
      } else if (fTypes.length > 1) {
        whereClause.fundingType = { in: fTypes.map(f => f.trim()) };
      }
    }

    // Filter by organization type
    if (orgType) {
      const oTypes = orgType.split(',').filter(Boolean);
      if (oTypes.length === 1) {
        whereClause.orgType = { equals: oTypes[0].trim(), mode: 'insensitive' };
      } else if (oTypes.length > 1) {
        whereClause.orgType = { in: oTypes.map(o => o.trim()) };
      }
    }

    // Filter by degree level
    if (level) {
      const levels = level.split(',').filter(Boolean).map(l => l.trim());
      whereClause.degreeLevel = {
        hasSome: levels,
      };
    }

    // Filter by discipline
    if (discipline) {
      const discList = discipline.split(',').filter(Boolean).map(d => d.trim());
      whereClause.disciplines = {
        hasSome: discList,
      };
    }

    // Search query across title, sponsor, description, eligibility
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { sponsor: { contains: q, mode: 'insensitive' } },
        { hostCountry: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { eligibility: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Lifecycle Status filter (open vs closing_soon vs closed/expired as of current date)
    if (status === 'open' || status === 'active') {
      whereClause.deadline = { gte: new Date() };
    } else if (status === 'closing_soon') {
      const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      whereClause.deadline = { gte: new Date(), lte: in14Days };
    } else if (status === 'closed' || status === 'expired') {
      whereClause.deadline = { lt: new Date() };
    }

    // Start Date & Intake Filters (January 2027 support)
    if (startDateFrom || startDateTo || intakeYear || intakeMonth) {
      const intakeWhere: any = {};

      if (startDateFrom) {
        intakeWhere.startDate = { ...(intakeWhere.startDate || {}), gte: new Date(startDateFrom) };
      }
      if (startDateTo) {
        intakeWhere.startDate = { ...(intakeWhere.startDate || {}), lte: new Date(startDateTo) };
      }
      if (intakeYear) {
        const yearInt = parseInt(intakeYear);
        const startOfYear = new Date(`${yearInt}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${yearInt}-12-31T23:59:59.000Z`);
        intakeWhere.startDate = { ...(intakeWhere.startDate || {}), gte: startOfYear, lte: endOfYear };
      }
      if (intakeMonth && (intakeYear || startDateFrom)) {
        const monthInt = parseInt(intakeMonth);
        const y = intakeYear ? parseInt(intakeYear) : new Date(startDateFrom!).getFullYear();
        const startOfMonth = new Date(y, monthInt - 1, 1);
        const endOfMonth = new Date(y, monthInt, 0, 23, 59, 59);
        intakeWhere.startDate = { gte: startOfMonth, lte: endOfMonth };
      }

      whereClause.intakes = {
        some: intakeWhere,
      };
    }

    // 3. Count Total Matching Records
    const totalCount = await prisma.opportunity.count({ where: whereClause });

    // 4. Fetch Paginated Records from Database
    const dbOpportunities = await prisma.opportunity.findMany({
      where: whereClause,
      include: {
        intakes: {
          orderBy: { startDate: 'asc' },
        },
      },
      skip: sort === 'atlas_score' ? 0 : skip,
      take: sort === 'atlas_score' ? Math.max(limit * page, 100) : limit,
      orderBy: sort === 'deadline' 
        ? { deadline: 'asc' } 
        : sort === 'newest' 
        ? { createdAt: 'desc' } 
        : { createdAt: 'desc' },
    });

    // 5. Evaluate Opportunities with Real Matching Engine
    const mappedOpps = dbOpportunities.map((opp: any) => {
      const evalOpp: EvaluatedOpportunity = {
        id: opp.id,
        title: opp.title,
        type: opp.type,
        sponsor: opp.sponsor,
        hostCountry: opp.hostCountry,
        continent: opp.continent,
        eligibleCountries: opp.eligibleCountries,
        disciplines: opp.disciplines,
        degreeLevel: opp.degreeLevel,
        fundingType: opp.fundingType,
        deadline: opp.deadline,
        opensDate: opp.opensDate,
        applyUrl: opp.applyUrl,
        sourceUrl: opp.sourceUrl,
        sourceDomain: opp.sourceDomain,
        trustTier: opp.trustTier,
        verificationStatus: opp.verificationStatus,
        description: opp.description,
        eligibility: opp.eligibility,
        tags: opp.tags,
        intakes: opp.intakes,
      };

      const health = assessOpportunityDeadlineHealth(opp.id, opp.deadline, opp.opensDate);

      if (!hasProfile || !candidate) {
        return {
          id: opp.id,
          title: opp.title,
          type: opp.type,
          sponsor: opp.sponsor,
          orgType: opp.orgType,
          hostCountry: opp.hostCountry,
          continent: opp.continent,
          eligibleCountries: opp.eligibleCountries,
          disciplines: opp.disciplines,
          degreeLevel: opp.degreeLevel,
          fundingType: opp.fundingType,
          coverageDetails: opp.coverageDetails,
          deadline: opp.deadline.toISOString().split('T')[0],
          opensDate: opp.opensDate ? opp.opensDate.toISOString().split('T')[0] : null,
          applyUrl: opp.applyUrl,
          sourceUrl: opp.sourceUrl,
          sourceDomain: opp.sourceDomain,
          trustTier: opp.trustTier,
          verificationStatus: opp.verificationStatus,
          lifecycleStatus: health.lifecycleStatus,
          daysUntilDeadline: health.daysUntilDeadline,
          isUrgent: health.isUrgent,
          description: opp.description,
          eligibility: opp.eligibility,
          tags: opp.tags,
          createdAt: opp.createdAt.toISOString(),
          intakes: opp.intakes.map((i: any) => ({
            id: i.id,
            intakeName: i.intakeName,
            startDate: i.startDate ? i.startDate.toISOString().split('T')[0] : null,
            deadlineDate: i.deadlineDate ? i.deadlineDate.toISOString().split('T')[0] : null,
            status: i.status,
          })),
          matchScore: null,
          eligibilityStatus: null,
          scoreBreakdown: null,
          matchedRequirements: [],
          missingInformation: [],
          disqualifyingReasons: [],
        };
      }

      const evalResult = evaluateEligibility(candidate, evalOpp);

      return {
        id: opp.id,
        title: opp.title,
        type: opp.type,
        sponsor: opp.sponsor,
        orgType: opp.orgType,
        hostCountry: opp.hostCountry,
        continent: opp.continent,
        eligibleCountries: opp.eligibleCountries,
        disciplines: opp.disciplines,
        degreeLevel: opp.degreeLevel,
        fundingType: opp.fundingType,
        coverageDetails: opp.coverageDetails,
        deadline: opp.deadline.toISOString().split('T')[0],
        opensDate: opp.opensDate ? opp.opensDate.toISOString().split('T')[0] : null,
        applyUrl: opp.applyUrl,
        sourceUrl: opp.sourceUrl,
        sourceDomain: opp.sourceDomain,
        trustTier: opp.trustTier,
        verificationStatus: opp.verificationStatus,
        lifecycleStatus: health.lifecycleStatus,
        daysUntilDeadline: health.daysUntilDeadline,
        isUrgent: health.isUrgent,
        description: opp.description,
        eligibility: opp.eligibility,
        tags: opp.tags,
        createdAt: opp.createdAt.toISOString(),
        intakes: opp.intakes.map((i: any) => ({
          id: i.id,
          intakeName: i.intakeName,
          startDate: i.startDate ? i.startDate.toISOString().split('T')[0] : null,
          deadlineDate: i.deadlineDate ? i.deadlineDate.toISOString().split('T')[0] : null,
          status: i.status,
        })),
        matchScore: evalResult.matchScore,
        eligibilityStatus: evalResult.status,
        scoreBreakdown: evalResult.scoreBreakdown,
        matchedRequirements: evalResult.matchedRequirements,
        missingInformation: evalResult.missingInformation,
        disqualifyingReasons: evalResult.disqualifyingReasons,
        recommendations: evalResult.recommendations,
      };
    });

    // 6. Sort and Paginate
    let results = mappedOpps;
    if (sort === 'atlas_score' && hasProfile) {
      results.sort((a: any, b: any) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
      results = results.slice(skip, skip + limit);
    }

    return NextResponse.json({
      opportunities: results,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error: any) {
    console.error('[Discover API Error]', error?.stack || error);
    return NextResponse.json(
      { error: 'An error occurred while fetching opportunities from the database. Please try again later.' },
      { status: 503 }
    );
  }
}
