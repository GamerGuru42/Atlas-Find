/**
 * Agent B: Eligibility Assistant
 *
 * Evaluates candidate qualifications against opportunity requirements,
 * explains mandatory vs. soft conditions, and provides clear, truthful outcomes:
 * ELIGIBLE, POTENTIALLY_ELIGIBLE, NOT_ELIGIBLE.
 */

import {
  evaluateEligibility,
  type CandidateProfile,
  type EvaluatedOpportunity,
  type EligibilityResult,
} from '../matching/engine.ts';

export interface EligibilitySummaryExplanation {
  opportunityId: string;
  opportunityTitle: string;
  status: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  matchScore: number;
  explanation: string;
  mandatoryPassed: string[];
  missingDataToConfirm: string[];
  disqualifications: string[];
  actionItems: string[];
}

export function explainOpportunityEligibility(
  profile: CandidateProfile | null | undefined,
  opp: EvaluatedOpportunity
): EligibilitySummaryExplanation {
  const result: EligibilityResult = evaluateEligibility(profile, opp);

  let explanation = '';
  if (result.status === 'ELIGIBLE') {
    explanation = `You meet all established mandatory criteria for ${opp.title}. Your background in ${profile?.fieldOfStudy || 'your discipline'} aligns strongly with the sponsor's specifications.`;
  } else if (result.status === 'POTENTIALLY_ELIGIBLE') {
    explanation = `You appear to be a viable candidate for ${opp.title}, but we need to verify ${result.missingInformation.length} detail(s) before confirming full eligibility.`;
  } else {
    explanation = `You currently do not meet one or more mandatory eligibility requirements for ${opp.title}. Specifically: ${result.disqualifyingReasons.join(' ')}`;
  }

  return {
    opportunityId: opp.id,
    opportunityTitle: opp.title,
    status: result.status,
    matchScore: result.matchScore,
    explanation,
    mandatoryPassed: result.matchedRequirements,
    missingDataToConfirm: result.missingInformation,
    disqualifications: result.disqualifyingReasons,
    actionItems: result.recommendations,
  };
}

