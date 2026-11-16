import { UserProfile } from '@/types/user';
import { Opportunity, MatchResult } from '@/types/opportunity';
import { evaluateEligibility, CandidateProfile, EvaluatedOpportunity } from '@/lib/matching/engine';

/**
 * Agent 2: Profile Matcher (Refactored to genuine, evidence-based engine)
 */
export function matchOpportunities(
  profile: UserProfile,
  opportunities: Opportunity[]
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const opp of opportunities) {
    const match = scoreOpportunity(profile, opp);
    if (match) results.push(match);
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

export function scoreOpportunity(profile: UserProfile, opp: Opportunity): MatchResult | null {
  const candidate: CandidateProfile = {
    nationality: profile.nationality,
    fieldOfStudy: profile.fieldOfStudy,
    level: profile.degreeLevel,
    gpa: profile.gpa,
    fundingNeeds: profile.fundingNeeds,
    preferredCountries: profile.targetCountries,
    targetRegions: profile.targetRegions,
    workExperienceYears: profile.workExperience?.years,
    workExperienceField: profile.workExperience?.field,
    languages: profile.languages,
  };

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
  };

  const result = evaluateEligibility(candidate, evalOpp);

  // If hard disqualified, don't show or return with tier 'safety_option'
  if (result.isDisqualified) {
    return null;
  }

  let tier: 'top_pick' | 'stretch_goal' | 'safety_option';
  if (result.matchScore >= 80 && result.status === 'ELIGIBLE') {
    tier = 'top_pick';
  } else if (result.matchScore >= 60) {
    tier = 'stretch_goal';
  } else {
    tier = 'safety_option';
  }

  return {
    opportunity: opp,
    score: result.matchScore,
    tier,
    reasons: {
      whyYouMatch: result.matchedRequirements,
      whyYouDont: result.disqualifyingReasons.concat(result.missingInformation),
      howToImprove: result.recommendations,
    },
  };
}
