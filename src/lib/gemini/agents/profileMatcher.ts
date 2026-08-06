import { UserProfile } from '@/types/user';
import { Opportunity, MatchResult } from '@/types/opportunity';

/**
 * Agent 2: Profile Matcher
 * Rule-based + scoring engine that calculates match scores
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

function scoreOpportunity(profile: UserProfile, opp: Opportunity): MatchResult | null {
  const reasons = {
    whyYouMatch: [] as string[],
    whyYouDont: [] as string[],
    howToImprove: [] as string[],
  };

  let score = 50; // Start at baseline

  // ===== HARD REQUIREMENTS (instant disqualify) =====
  
  // Nationality check
  if (opp.eligibleCountries.length > 0 && profile.nationality) {
    const eligible = opp.eligibleCountries.some(
      (c) => c.toLowerCase() === profile.nationality!.toLowerCase()
    );
    if (!eligible) {
      return null; // Hard disqualify — don't show this opportunity
    }
    reasons.whyYouMatch.push(`Your nationality (${profile.nationality}) is eligible`);
    score += 10;
  }

  // Degree level check
  if (profile.degreeLevel && opp.degreeLevel.length > 0) {
    if (opp.degreeLevel.includes(profile.degreeLevel)) {
      reasons.whyYouMatch.push(`Offers ${profile.degreeLevel} programmes`);
      score += 5;
    } else {
      reasons.whyYouDont.push(`This is for ${opp.degreeLevel.join('/')} — you're looking for ${profile.degreeLevel}`);
      score -= 20;
    }
  }

  // ===== SOFT SCORING =====

  // Field match (25%)
  if (profile.fieldOfStudy) {
    const fieldMatch = opp.disciplines.some(
      (d) => d.toLowerCase() === 'all disciplines' ||
        d.toLowerCase().includes(profile.fieldOfStudy!.toLowerCase()) ||
        profile.fieldOfStudy!.toLowerCase().includes(d.toLowerCase())
    );
    if (fieldMatch) {
      reasons.whyYouMatch.push(`Your field (${profile.fieldOfStudy}) is a match`);
      score += 15;
    } else {
      reasons.whyYouDont.push(`This scholarship targets ${opp.disciplines.join(', ')} — not directly ${profile.fieldOfStudy}`);
      score -= 5;
    }
  }

  // GPA relative strength (15%)
  if (profile.gpa) {
    const normalizedGpa = profile.gpa.value / profile.gpa.scale;
    if (normalizedGpa >= 0.85) {
      reasons.whyYouMatch.push(`Your GPA (${profile.gpa.value}/${profile.gpa.scale}) is strong for this scholarship`);
      score += 10;
    } else if (normalizedGpa >= 0.7) {
      reasons.whyYouMatch.push(`Your GPA meets the minimum threshold`);
      score += 5;
    } else {
      reasons.whyYouDont.push(`Your GPA may be below competitive range`);
      reasons.howToImprove.push(`Highlight research, projects, and work experience to compensate`);
      score -= 5;
    }
  }

  // Work experience (15%)
  if (profile.workExperience) {
    if (opp.tags.includes('work-experience-required')) {
      reasons.whyYouMatch.push(`Your ${profile.workExperience.years} years of ${profile.workExperience.field} experience meets the requirement`);
      score += 15;
    } else {
      reasons.whyYouMatch.push(`Your professional experience strengthens your application`);
      score += 8;
    }
  } else if (opp.tags.includes('work-experience-required')) {
    reasons.whyYouDont.push(`This scholarship requires work experience`);
    reasons.howToImprove.push(`Gain 1-2 years of relevant professional experience before applying`);
    score -= 10;
  }

  // Funding alignment (10%)
  if (profile.fundingNeeds === 'fully_funded' && opp.fundingType === 'fully_funded') {
    reasons.whyYouMatch.push(`Fully funded — covers your financial needs`);
    score += 10;
  } else if (profile.fundingNeeds === 'fully_funded' && opp.fundingType !== 'fully_funded') {
    reasons.whyYouDont.push(`Only ${opp.fundingType} funding — may not cover all costs`);
    score -= 5;
  }

  // Country/region preference (10%)
  if (profile.targetCountries.length > 0 || profile.targetRegions.length > 0) {
    const countryMatch = profile.targetCountries.some(
      (c) => c.toLowerCase() === opp.hostCountry.toLowerCase()
    );
    const regionMatch = profile.targetRegions.some((r) => {
      const region = r.toLowerCase();
      const country = opp.hostCountry.toLowerCase();
      if (region === 'europe') return ['germany', 'france', 'netherlands', 'sweden', 'denmark', 'belgium', 'ireland', 'hungary', 'switzerland', 'multiple eu countries'].includes(country);
      if (region === 'uk') return country === 'united kingdom';
      if (region === 'asia') return ['japan', 'south korea', 'china', 'saudi arabia'].includes(country);
      return false;
    });
    if (countryMatch) {
      reasons.whyYouMatch.push(`Located in ${opp.hostCountry} — your preferred destination`);
      score += 10;
    } else if (regionMatch) {
      reasons.whyYouMatch.push(`Located in ${opp.hostCountry} — within your target region`);
      score += 8;
    }
  }

  // Deadline feasibility (5%)
  const daysUntilDeadline = Math.ceil(
    (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilDeadline < 7) {
    reasons.whyYouDont.push(`Deadline is in ${daysUntilDeadline} days — very tight`);
    score -= 5;
  } else if (daysUntilDeadline < 30) {
    reasons.whyYouMatch.push(`Closing soon (${daysUntilDeadline} days) — act fast`);
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine tier
  let tier: 'top_pick' | 'stretch_goal' | 'safety_option';
  if (score >= 75) tier = 'top_pick';
  else if (score >= 55) tier = 'stretch_goal';
  else tier = 'safety_option';

  return {
    opportunity: opp,
    score,
    tier,
    reasons,
  };
}
