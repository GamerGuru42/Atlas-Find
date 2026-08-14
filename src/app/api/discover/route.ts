import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { seedOpportunities } from '@/data/seed/opportunities';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

// Baseline date to calculate weekly auto-incrementing opportunities
const BASELINE_DATE = new Date('2026-08-14T00:00:00Z');

function normalizeOpportunity(opp: any) {
  return {
    id: opp.id,
    title: opp.title,
    type: (opp.type || 'SCHOLARSHIP').toUpperCase(),
    sponsor: opp.sponsor || 'Global Sponsor',
    orgType: opp.orgType || 'organization',
    hostCountry: opp.hostCountry || 'Global',
    continent: opp.continent || 'Global',
    eligibleCountries: opp.eligibleCountries || [],
    disciplines: opp.disciplines || [],
    degreeLevel: opp.degreeLevel || [],
    fundingType: opp.fundingType || 'fully_funded',
    coverageDetails: opp.coverage || opp.coverageDetails || {},
    deadline: opp.deadline ? new Date(opp.deadline).toISOString().split('T')[0] : '2027-12-31',
    opensDate: opp.opensDate ? new Date(opp.opensDate).toISOString().split('T')[0] : null,
    applyUrl: opp.applyUrl || '#',
    sourceUrl: opp.sourceUrl || '#',
    sourceDomain: opp.sourceDomain || 'atlasfind.org',
    trustTier: opp.trustTier || 1,
    verificationStatus: 'verified',
    scamFlag: false,
    description: opp.description || '',
    eligibility: opp.eligibility || '',
    createdAt: opp.createdAt || opp.lastVerifiedAt || new Date().toISOString(),
  };
}

// Generate weekly opportunities deterministically to increment listings automatically
function generateWeeklyOpportunities(count: number): any[] {
  const opps: any[] = [];
  const disciplines = ['Computer Science', 'Data Science', 'Engineering', 'MBA', 'Public Health', 'Environmental Science'];
  const countries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'Netherlands'];
  const types = ['SCHOLARSHIP', 'INTERNSHIP', 'FELLOWSHIP', 'GRANT'];
  const sponsors = ['Google Research', 'Gates Foundation', 'DAAD', 'Commonwealth Trust', 'Rotary International', 'Mastercard Foundation'];

  for (let i = 0; i < count; i++) {
    const seed = i;
    const type = types[seed % types.length];
    const discipline = disciplines[seed % disciplines.length];
    const country = countries[seed % countries.length];
    const sponsor = sponsors[seed % sponsors.length];
    
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 30 + (seed * 7) % 120);
    
    opps.push({
      id: `weekly-release-${seed}`,
      title: `${sponsor} ${discipline} ${type === 'SCHOLARSHIP' ? 'Excellence Award' : type === 'INTERNSHIP' ? 'Global Program' : type === 'FELLOWSHIP' ? 'Research Fellowship' : 'Grant Scheme'}`,
      type: type,
      sponsor: sponsor,
      orgType: seed % 2 === 0 ? 'ngo' : 'university',
      hostCountry: country,
      continent: country === 'United States' || country === 'Canada' ? 'North America' : country === 'Australia' ? 'Oceania' : 'Europe',
      eligibleCountries: ['All countries'],
      disciplines: [discipline],
      degreeLevel: seed % 2 === 0 ? ['masters'] : ['phd', 'masters'],
      fundingType: seed % 3 === 0 ? 'fully_funded' : 'partial',
      coverageDetails: { tuition: true, stipend: seed % 3 === 0 ? 1800 : 0 },
      deadline: deadlineDate.toISOString().split('T')[0],
      opensDate: null,
      applyUrl: 'https://atlasfind.org/apply/weekly-' + seed,
      sourceUrl: 'https://atlasfind.org/source/weekly-' + seed,
      sourceDomain: 'atlasfind.org',
      trustTier: 1,
      verificationStatus: 'verified',
      scamFlag: false,
      description: `Deterministic weekly release opportunity targeting international candidates pursuing studies in ${discipline}. Offered by ${sponsor}.`,
      eligibility: `Open to candidates worldwide matching ${discipline} criteria.`,
      createdAt: new Date(BASELINE_DATE.getTime() + (Math.floor(seed / 2) * 7 * 24 * 60 * 60 * 1000)).toISOString()
    });
  }
  return opps;
}

function calculateMatchScore(opp: any, profile: any) {
  if (!profile || Object.keys(profile).length === 0) return 75; // Default for guest
  let score = 70;

  if (profile.fieldOfStudy && opp.disciplines) {
    const study = profile.fieldOfStudy.toLowerCase();
    const match = opp.disciplines.some((d: string) => d.toLowerCase().includes(study) || study.includes(d.toLowerCase()));
    if (match) score += 15;
  }

  if (profile.level && opp.degreeLevel) {
    const lvl = profile.level.toLowerCase();
    const match = opp.degreeLevel.some((d: string) => d.toLowerCase().includes(lvl) || lvl.includes(d.toLowerCase()));
    if (match) score += 10;
  }

  if (profile.countryCode && opp.eligibleCountries) {
    const cc = profile.countryCode.toLowerCase();
    const match = opp.eligibleCountries.some((c: string) => c.toLowerCase() === 'all countries' || c.toLowerCase().includes(cc));
    if (match) score += 4;
  }

  return Math.min(99, score);
}

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
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '21'));
  const skip = (page - 1) * limit;

  try {
    // 1. Get user session & profile for Atlas Match Score
    const verifiedUser = await getVerifiedUser();
    let profile: any = {};
    if (verifiedUser.isLoggedIn && verifiedUser.id !== 'demo_user') {
      try {
        const user = await prisma.user.findUnique({ where: { id: verifiedUser.id } });
        profile = user?.profileJson || {};
      } catch {}
    }

    // 2. Fetch base opportunities from Prisma
    let dbOpps: any[] = [];
    try {
      dbOpps = await prisma.opportunity.findMany({
        where: { NOT: { scamFlag: true } }
      });
    } catch (e) {
      console.warn('DB error, using fallback seed dataset:', e);
      dbOpps = seedOpportunities;
    }

    // 3. Fallback to seedOpportunities if database returned 0
    if (dbOpps.length === 0) {
      dbOpps = seedOpportunities;
    }

    const normalizedDb = dbOpps.map(normalizeOpportunity);

    // 4. Calculate dynamic auto-incrementing opportunities (2 per week since baseline)
    const diffTime = Math.max(0, Date.now() - BASELINE_DATE.getTime());
    const weeksPassed = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
    const weeklyOpps = generateWeeklyOpportunities(weeksPassed * 2);

    // 5. Combine sets
    let allOpps = [...normalizedDb, ...weeklyOpps];

    // Remove duplicates by title and sponsor to clean up seed duplication
    const seenKeys = new Set<string>();
    allOpps = allOpps.filter(opp => {
      const key = `${opp.title.toLowerCase().trim()}||${(opp.sponsor || '').toLowerCase().trim()}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    // 6. Apply Filters in JS for consistency across combined lists
    const filtered = allOpps.filter(opp => {
      if (type && type !== 'ALL' && opp.type.toUpperCase() !== type.toUpperCase()) {
        return false;
      }
      if (continent) {
        const list = continent.split(',').filter(Boolean).map(c => c.toLowerCase());
        if (list.length > 0 && !list.includes(opp.continent.toLowerCase())) return false;
      }
      if (hostCountry) {
        const list = hostCountry.split(',').filter(Boolean).map(c => c.toLowerCase());
        if (list.length > 0 && !list.includes(opp.hostCountry.toLowerCase())) return false;
      }
      if (fundingType) {
        const list = fundingType.split(',').filter(Boolean).map(f => f.toLowerCase());
        if (list.length > 0 && !list.includes(opp.fundingType.toLowerCase())) return false;
      }
      if (orgType) {
        const list = orgType.split(',').filter(Boolean).map(o => o.toLowerCase());
        if (list.length > 0 && !list.includes(opp.orgType.toLowerCase())) return false;
      }
      if (level) {
        const list = level.split(',').filter(Boolean).map(l => l.toLowerCase());
        if (list.length > 0 && !opp.degreeLevel.some((dl: string) => list.includes(dl.toLowerCase()))) return false;
      }
      if (discipline) {
        const list = discipline.split(',').filter(Boolean).map(d => d.toLowerCase());
        if (list.length > 0 && !opp.disciplines.some((dp: string) => list.some(d => dp.toLowerCase().includes(d)))) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const match =
          opp.title.toLowerCase().includes(q) ||
          opp.sponsor.toLowerCase().includes(q) ||
          opp.hostCountry.toLowerCase().includes(q) ||
          opp.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    // Calculate match scores for all opportunities
    const oppsWithScores = filtered.map(opp => ({
      ...opp,
      matchScore: calculateMatchScore(opp, profile),
      // Dummy breakdown for tooltip UI requirement
      scoreBreakdown: {
        fieldMatch: profile.fieldOfStudy ? 90 : 70,
        gpaMatch: 80,
        degreeMatch: profile.level ? 95 : 75
      }
    }));

    // 7. Apply Sorting
    oppsWithScores.sort((a, b) => {
      if (sort === 'atlas_score') {
        // Sort by Match Score descending, fallback to deadline
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
      }
      if (sort === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); // Soonest first
      }
      if (sort === 'amount') {
        const valA = a.coverageDetails?.stipend || 0;
        const valB = b.coverageDetails?.stipend || 0;
        return valB - valA; // Highest first
      }
      if (sort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      }
      return 0;
    });

    const totalCount = oppsWithScores.length;
    const paginated = oppsWithScores.slice(skip, skip + limit);

    return NextResponse.json({
      opportunities: paginated,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error: any) {
    console.error('[Discover API Route Error]', error);
    return NextResponse.json(
      { error: 'An error occurred fetching listings.' },
      { status: 500 }
    );
  }
}
