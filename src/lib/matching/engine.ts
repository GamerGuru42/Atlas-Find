/**
 * AtlasFind - Genuine Eligibility and Matching Engine
 *
 * Implements deterministic, evidence-based eligibility evaluations
 * based strictly on verified opportunity criteria vs. user profile.
 *
 * Outcomes:
 * - ELIGIBLE: All mandatory conditions have been established as satisfied.
 * - POTENTIALLY_ELIGIBLE: The user appears to qualify, but important information is missing or needs confirmation.
 * - NOT_ELIGIBLE: At least one mandatory condition has been established as unsatisfied.
 */

export type EligibilityStatus = 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';

export interface EvaluatedOpportunity {
  id: string;
  title: string;
  type?: string;
  sponsor?: string;
  hostCountry?: string;
  continent?: string | null;
  eligibleCountries?: string[];
  disciplines?: string[];
  degreeLevel?: string[];
  fundingType?: string;
  deadline?: string | Date;
  opensDate?: string | Date | null;
  startDate?: string | Date | null;
  applyUrl?: string;
  sourceUrl?: string;
  sourceDomain?: string;
  trustTier?: number;
  verificationStatus?: string;
  description?: string;
  eligibility?: string;
  tags?: string[];
  intakes?: Array<{
    intakeName?: string;
    startDate?: string | Date | null;
    deadlineDate?: string | Date | null;
    status?: string;
  }>;
}

export interface CandidateProfile {
  nationality?: string | null;
  countryCode?: string | null;
  countryOfResidence?: string | null;
  fieldOfStudy?: string | null;
  level?: string | null; // e.g. "undergraduate", "bachelors", "masters", "phd", "postdoc"
  institution?: string | null;
  graduationYear?: number | null;
  gpa?: { value: number; scale: number } | number | null;
  workExperienceYears?: number | null;
  workExperienceField?: string | null;
  fundingNeeds?: 'fully_funded' | 'partial' | 'any' | null;
  preferredCountries?: string[];
  targetRegions?: string[];
  languages?: string[];
  availableFrom?: string | Date | null;
}

export interface ScoreBreakdown {
  nationalityMatch: number; // 0-100
  degreeMatch: number;      // 0-100
  fieldMatch: number;       // 0-100
  academicMatch: number;    // 0-100
  locationMatch: number;    // 0-100
  fundingMatch: number;     // 0-100
}

export interface EligibilityResult {
  status: EligibilityStatus;
  matchScore: number; // 0 - 100
  isDisqualified: boolean;
  scoreBreakdown: ScoreBreakdown;
  matchedRequirements: string[];
  missingInformation: string[];
  disqualifyingReasons: string[];
  recommendations: string[];
  summary: string;
}

// Regional and grouping definitions for intelligent country mapping
const DEVELOPING_COUNTRIES_SAMPLE = new Set([
  'nigeria', 'ghana', 'kenya', 'uganda', 'tanzania', 'rwanda', 'south africa',
  'egypt', 'morocco', 'india', 'pakistan', 'bangladesh', 'nepal', 'sri lanka',
  'indonesia', 'philippines', 'vietnam', 'brazil', 'colombia', 'peru', 'mexico'
]);

const AFRICAN_COUNTRIES = new Set([
  'nigeria', 'ghana', 'kenya', 'south africa', 'uganda', 'tanzania', 'rwanda',
  'ethiopia', 'egypt', 'morocco', 'senegal', 'zambia', 'zimbabwe', 'cameroon',
  'ivory coast', 'angola', 'namibia', 'botswana', 'malawi', 'mozambique'
]);

const ESA_MEMBER_STATES = new Set([
  'austria', 'belgium', 'czech republic', 'denmark', 'estonia', 'finland', 'france',
  'germany', 'greece', 'hungary', 'ireland', 'italy', 'luxembourg', 'netherlands',
  'norway', 'poland', 'portugal', 'romania', 'spain', 'sweden', 'switzerland',
  'united kingdom', 'uk', 'latvia', 'lithuania', 'slovakia', 'slovenia', 'canada'
]);

const CERN_MEMBER_STATES = new Set([
  'austria', 'belgium', 'bulgaria', 'czech republic', 'denmark', 'finland', 'france',
  'germany', 'greece', 'hungary', 'israel', 'italy', 'netherlands', 'norway', 'poland',
  'portugal', 'romania', 'serbia', 'slovakia', 'spain', 'sweden', 'switzerland',
  'united kingdom', 'uk', 'croatia', 'cyprus', 'estonia', 'india', 'latvia', 'lithuania',
  'pakistan', 'slovenia', 'turkey', 'türkiye', 'ukraine'
]);

const OECD_MEMBER_STATES = new Set([
  'australia', 'austria', 'belgium', 'canada', 'chile', 'colombia', 'costa rica',
  'czech republic', 'denmark', 'estonia', 'finland', 'france', 'germany', 'greece',
  'hungary', 'iceland', 'ireland', 'israel', 'italy', 'japan', 'korea', 'south korea',
  'latvia', 'lithuania', 'luxembourg', 'mexico', 'netherlands', 'new zealand', 'norway',
  'poland', 'portugal', 'slovak republic', 'slovakia', 'slovenia', 'spain', 'sweden',
  'switzerland', 'turkey', 'türkiye', 'united kingdom', 'uk', 'united states', 'usa', 'us'
]);

/**
 * Normalizes degree level string into standard tiers
 */
export function normalizeDegreeLevel(lvl: string | null | undefined): string | null {
  if (!lvl) return null;
  const lower = lvl.toLowerCase().trim();
  if (lower.includes('undergrad') || lower.includes('bachelor') || lower.includes('bsc') || lower.includes('ba')) {
    return 'bachelors';
  }
  if (lower.includes('master') || lower.includes('msc') || lower.includes('ma') || lower.includes('mba')) {
    return 'masters';
  }
  if (lower.includes('postdoc') || lower.includes('fellowship')) {
    return 'postdoc';
  }
  if (lower.includes('phd') || lower.includes('doctor') || lower.includes('postgrad') || lower.includes('research')) {
    return 'phd';
  }
  return lower;
}

/**
 * Checks if a nationality fits an eligibility specification
 */
export function isNationalityEligible(
  candidateNationality: string | null | undefined,
  eligibleList: string[] | undefined
): { eligible: boolean; indefinite: boolean; reason: string } {
  // If list is empty or undefined, opportunity is open to all nationalities
  if (!eligibleList || eligibleList.length === 0) {
    return {
      eligible: true,
      indefinite: false,
      reason: 'Open to candidates of all nationalities worldwide.'
    };
  }

  const normalizedList = eligibleList.map(c => c.toLowerCase().trim());

  // Check for global keywords
  const isGlobal = normalizedList.some(c =>
    c === 'global' ||
    c === 'all countries' ||
    c === 'all' ||
    c === 'worldwide' ||
    c === 'international' ||
    c.includes('any nationality')
  );

  if (isGlobal) {
    return {
      eligible: true,
      indefinite: false,
      reason: 'Open globally to international applicants.'
    };
  }

  // If candidate nationality is unknown, we cannot confirm nor deny
  if (!candidateNationality || candidateNationality.trim() === '') {
    return {
      eligible: false,
      indefinite: true,
      reason: `Nationality not specified in profile. Eligibility requires one of: ${eligibleList.slice(0, 5).join(', ')}${eligibleList.length > 5 ? '...' : ''}.`
    };
  }

  const userNat = candidateNationality.toLowerCase().trim();

  // Direct match
  if (normalizedList.includes(userNat)) {
    return {
      eligible: true,
      indefinite: false,
      reason: `Your nationality (${candidateNationality}) is explicitly eligible.`
    };
  }

  // Regional checks
  if (normalizedList.includes('developing countries') || normalizedList.includes('global south')) {
    if (DEVELOPING_COUNTRIES_SAMPLE.has(userNat)) {
      return {
        eligible: true,
        indefinite: false,
        reason: `${candidateNationality} qualifies under the Developing Countries / Global South criteria.`
      };
    }
  }

  if (normalizedList.includes('african countries') || normalizedList.includes('sub-saharan africa')) {
    if (AFRICAN_COUNTRIES.has(userNat)) {
      return {
        eligible: true,
        indefinite: false,
        reason: `${candidateNationality} qualifies under the African Countries cohort.`
      };
    }
  }

  // ESA Member States check
  if (normalizedList.some(c => c.includes('esa member'))) {
    if (ESA_MEMBER_STATES.has(userNat)) {
      return {
        eligible: true,
        indefinite: false,
        reason: `${candidateNationality} is a verified ESA Member / Associate / Cooperating State.`
      };
    }
  }

  // CERN Member States check
  if (normalizedList.some(c => c.includes('cern member'))) {
    if (CERN_MEMBER_STATES.has(userNat)) {
      return {
        eligible: true,
        indefinite: false,
        reason: `${candidateNationality} is a verified CERN Member / Associate Member State.`
      };
    }
  }

  // OECD Member Countries check
  if (normalizedList.some(c => c.includes('oecd member'))) {
    if (OECD_MEMBER_STATES.has(userNat)) {
      return {
        eligible: true,
        indefinite: false,
        reason: `${candidateNationality} is a verified OECD Member Country.`
      };
    }
  }

  // Non-UK citizens check (e.g. Gates Cambridge)
  if (normalizedList.some(c => c.includes('non-uk') || c.includes('outside united kingdom'))) {
    const isUk = userNat === 'united kingdom' || userNat === 'uk' || userNat === 'britain' || userNat === 'british';
    if (!isUk) {
      return {
        eligible: true,
        indefinite: false,
        reason: `${candidateNationality} qualifies as a Non-UK applicant.`
      };
    } else {
      return {
        eligible: false,
        indefinite: false,
        reason: 'UK citizens are ineligible for this specific scholarship.'
      };
    }
  }

  // Not found in specific whitelist
  return {
    eligible: false,
    indefinite: false,
    reason: `Opportunity restricted to: ${eligibleList.slice(0, 4).join(', ')}${eligibleList.length > 4 ? ` (and ${eligibleList.length - 4} others)` : ''}. Your nationality (${candidateNationality}) is not listed.`
  };
}

/**
 * Main Evaluation Engine
 */
export function evaluateEligibility(
  profile: CandidateProfile | null | undefined,
  opportunity: EvaluatedOpportunity
): EligibilityResult {
  const matchedRequirements: string[] = [];
  const missingInformation: string[] = [];
  const disqualifyingReasons: string[] = [];
  const recommendations: string[] = [];

  const breakdown: ScoreBreakdown = {
    nationalityMatch: 70,
    degreeMatch: 70,
    fieldMatch: 70,
    academicMatch: 70,
    locationMatch: 70,
    fundingMatch: 70,
  };

  let hasDisqualification = false;
  let hasMissingMandatory = false;

  // 1. Nationality Assessment
  const userNat = profile?.nationality || profile?.countryOfResidence || profile?.countryCode;
  const natResult = isNationalityEligible(userNat, opportunity.eligibleCountries);

  if (natResult.eligible) {
    matchedRequirements.push(natResult.reason);
    breakdown.nationalityMatch = 100;
  } else if (natResult.indefinite) {
    missingInformation.push(natResult.reason);
    hasMissingMandatory = true;
    breakdown.nationalityMatch = 60;
    recommendations.push('Add your nationality to your profile to confirm eligibility.');
  } else {
    disqualifyingReasons.push(natResult.reason);
    hasDisqualification = true;
    breakdown.nationalityMatch = 0;
  }

  // 2. Degree Level Assessment
  const userDegree = normalizeDegreeLevel(profile?.level);
  const oppDegreeList = (opportunity.degreeLevel || []).map(normalizeDegreeLevel).filter(Boolean) as string[];

  if (oppDegreeList.length === 0) {
    // Open to all degree levels
    matchedRequirements.push('No restricted degree level requirement.');
    breakdown.degreeMatch = 100;
  } else if (!userDegree) {
    missingInformation.push(`Degree level not set. Opportunity is intended for: ${opportunity.degreeLevel?.join(', ')}.`);
    hasMissingMandatory = true;
    breakdown.degreeMatch = 55;
    recommendations.push('Specify your current degree level (e.g. Undergraduate, Master\'s, PhD).');
  } else if (oppDegreeList.includes(userDegree)) {
    matchedRequirements.push(`Matches your degree level (${profile?.level}).`);
    breakdown.degreeMatch = 100;
  } else {
    // Check if close or mismatch
    const isStrictMismatch = (userDegree === 'bachelors' && oppDegreeList.every(d => d === 'phd' || d === 'postdoc'));
    if (isStrictMismatch) {
      disqualifyingReasons.push(`Requires graduate/doctoral standing (${opportunity.degreeLevel?.join('/')}); your profile is marked as ${profile?.level}.`);
      hasDisqualification = true;
      breakdown.degreeMatch = 10;
    } else {
      missingInformation.push(`Offered for ${opportunity.degreeLevel?.join('/')}; verify if candidate with ${profile?.level} standing is considered.`);
      breakdown.degreeMatch = 40;
    }
  }

  // 3. Discipline / Field of Study Assessment
  const userField = profile?.fieldOfStudy?.toLowerCase().trim();
  const oppDisciplines = (opportunity.disciplines || []).map(d => d.toLowerCase().trim());

  if (oppDisciplines.length === 0 || oppDisciplines.some(d => d.includes('all field') || d.includes('all discipline') || d === 'any')) {
    matchedRequirements.push('Open to all academic fields and disciplines.');
    breakdown.fieldMatch = 100;
  } else if (!userField) {
    missingInformation.push(`Field of study not specified. Targets: ${opportunity.disciplines?.slice(0, 4).join(', ')}.`);
    breakdown.fieldMatch = 60;
    recommendations.push('Add your course or field of study to match relevant subjects.');
  } else {
    const isDirectMatch = oppDisciplines.some(d => d.includes(userField) || userField.includes(d));
    if (isDirectMatch) {
      matchedRequirements.push(`Direct alignment with your field of study (${profile?.fieldOfStudy}).`);
      breakdown.fieldMatch = 98;
    } else {
      // Check broad STEM / Business match
      const isStemUser = userField.includes('computer') || userField.includes('tech') || userField.includes('engineering') || userField.includes('science') || userField.includes('data');
      const isStemOpp = oppDisciplines.some(d => d === 'stem' || d.includes('engineering') || d.includes('technology') || d.includes('science'));
      if (isStemUser && isStemOpp) {
        matchedRequirements.push(`STEM field alignment between ${profile?.fieldOfStudy} and ${opportunity.disciplines?.join(', ')}.`);
        breakdown.fieldMatch = 85;
      } else {
        missingInformation.push(`This opportunity primarily focuses on ${opportunity.disciplines?.join(', ')}, while your profile indicates ${profile?.fieldOfStudy}. Cross-disciplinary applications may be accepted.`);
        breakdown.fieldMatch = 45;
        recommendations.push('If applying from an adjacent field, emphasize relevant quantitative and research skills.');
      }
    }
  }

  // 4. Academic Performance / GPA Assessment
  let candidateGpaRatio: number | null = null;
  if (profile?.gpa) {
    if (typeof profile.gpa === 'object' && profile.gpa.scale && profile.gpa.value) {
      candidateGpaRatio = profile.gpa.value / profile.gpa.scale;
    } else if (typeof profile.gpa === 'number') {
      candidateGpaRatio = profile.gpa > 4.0 ? profile.gpa / 5.0 : profile.gpa / 4.0;
    }
  }

  if (candidateGpaRatio !== null) {
    if (candidateGpaRatio >= 0.80) { // e.g. 3.2/4.0 or 4.0/5.0
      matchedRequirements.push('Your strong academic performance satisfies competitive requirements.');
      breakdown.academicMatch = 95;
    } else if (candidateGpaRatio >= 0.65) {
      matchedRequirements.push('Academic record meets standard eligibility thresholds.');
      breakdown.academicMatch = 75;
    } else {
      missingInformation.push('GPA is near the lower boundary for highly competitive selection.');
      breakdown.academicMatch = 50;
      recommendations.push('Strengthen your application with project portfolios, research, or work experience.');
    }
  } else {
    // GPA not provided — do not disqualify!
    breakdown.academicMatch = 70;
  }

  // 5. Host Country / Preferred Location Assessment
  if (opportunity.hostCountry) {
    const host = opportunity.hostCountry.toLowerCase();
    const prefs = (profile?.preferredCountries || []).map(c => c.toLowerCase());
    const regPrefs = (profile?.targetRegions || []).map(r => r.toLowerCase());

    if (prefs.length > 0 || regPrefs.length > 0) {
      const isPrefMatch = prefs.some(p => host.includes(p) || p.includes(host));
      const continent = opportunity.continent?.toLowerCase() || '';
      const isRegionMatch = regPrefs.some(r => continent.includes(r) || host.includes(r));

      if (isPrefMatch || isRegionMatch) {
        matchedRequirements.push(`Located in ${opportunity.hostCountry}, matching your target destination.`);
        breakdown.locationMatch = 100;
      } else {
        breakdown.locationMatch = 60;
      }
    } else {
      breakdown.locationMatch = 75;
    }
  }

  // 6. Funding Alignment Assessment
  if (opportunity.fundingType) {
    const isFull = opportunity.fundingType === 'fully_funded';
    if (profile?.fundingNeeds === 'fully_funded') {
      if (isFull) {
        matchedRequirements.push('Fully funded package meets your financial coverage requirements.');
        breakdown.fundingMatch = 100;
      } else {
        missingInformation.push(`Provides ${opportunity.fundingType.replace('_', ' ')} funding; supplementary financial support may be required.`);
        breakdown.fundingMatch = 50;
      }
    } else {
      breakdown.fundingMatch = isFull ? 95 : 75;
    }
  }

  // Final Status Determination
  let status: EligibilityStatus;
  if (hasDisqualification) {
    status = 'NOT_ELIGIBLE';
  } else if (hasMissingMandatory) {
    status = 'POTENTIALLY_ELIGIBLE';
  } else {
    status = 'ELIGIBLE';
  }

  // Weighted Match Score Calculation (strictly documented factors)
  // Weights:
  // Nationality: 25%
  // Degree Level: 25%
  // Field of Study: 20%
  // Academic: 10%
  // Location: 10%
  // Funding: 10%
  let rawScore = (
    breakdown.nationalityMatch * 0.25 +
    breakdown.degreeMatch * 0.25 +
    breakdown.fieldMatch * 0.20 +
    breakdown.academicMatch * 0.10 +
    breakdown.locationMatch * 0.10 +
    breakdown.fundingMatch * 0.10
  );

  // If hard disqualified, clamp score to a ceiling of 25% to never mislead user
  if (hasDisqualification) {
    rawScore = Math.min(25, Math.round(rawScore * 0.3));
  } else {
    rawScore = Math.max(30, Math.min(99, Math.round(rawScore)));
  }

  // Generate plain-language summary
  let summary = '';
  if (status === 'ELIGIBLE') {
    summary = `You meet all documented core requirements for this opportunity with strong profile alignment.`;
  } else if (status === 'POTENTIALLY_ELIGIBLE') {
    summary = `You appear to be a strong candidate, though ${missingInformation.length} requirement detail(s) require confirmation.`;
  } else {
    summary = `Your profile does not satisfy one or more mandatory eligibility requirements (${disqualifyingReasons[0] || 'mismatched criteria'}).`;
  }

  return {
    status,
    matchScore: rawScore,
    isDisqualified: hasDisqualification,
    scoreBreakdown: breakdown,
    matchedRequirements,
    missingInformation,
    disqualifyingReasons,
    recommendations,
    summary,
  };
}

