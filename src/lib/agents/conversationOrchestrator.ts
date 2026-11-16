/**
 * Agent G & Master Orchestrator: Multi-Agent Conversation System
 *
 * Coordinates specialist agents, retains user profile memory,
 * prevents redundant questioning, grounds recommendations in verified records,
 * and routes inquiries efficiently.
 */

import { parseNaturalLanguageSearch, type StructuredDiscoveryQuery } from './discoveryAgent.ts';
import { explainOpportunityEligibility } from './eligibilityAgent.ts';
import { researchOpportunityBackground } from './researchAgent.ts';
import { generateApplicationStrategy } from './applicationStrategistAgent.ts';
import { reviewApplicationDraft } from './writingAssistantAgent.ts';
import { assessOpportunityDeadlineHealth } from './monitoringAgent.ts';
import type { CandidateProfile, EvaluatedOpportunity } from '../matching/engine.ts';

export type UserIntent =
  | 'DISCOVERY'
  | 'ELIGIBILITY_CHECK'
  | 'RESEARCH'
  | 'APPLICATION_STRATEGY'
  | 'WRITING_ASSISTANCE'
  | 'DEADLINE_MONITORING'
  | 'GENERAL_CONVERSATION';

export function classifyIntent(prompt: string): UserIntent {
  const text = prompt.toLowerCase();

  if (
    text.includes('review my') ||
    text.includes('check my essay') ||
    text.includes('statement of purpose') ||
    text.includes('sop') ||
    text.includes('cover letter') ||
    text.includes('critique my cv')
  ) {
    return 'WRITING_ASSISTANCE';
  }

  if (
    text.includes('am i eligible') ||
    text.includes('can i apply') ||
    text.includes('do i qualify') ||
    text.includes('match score')
  ) {
    return 'ELIGIBILITY_CHECK';
  }

  if (
    text.includes('roadmap') ||
    text.includes('timeline') ||
    text.includes('how to prepare') ||
    text.includes('strategy for')
  ) {
    return 'APPLICATION_STRATEGY';
  }

  if (
    text.includes('tell me about') ||
    text.includes('who sponsors') ||
    text.includes('is it legit') ||
    text.includes('official portal')
  ) {
    return 'RESEARCH';
  }

  if (
    text.includes('deadline') ||
    text.includes('closing soon') ||
    text.includes('when does') ||
    text.includes('expired')
  ) {
    return 'DEADLINE_MONITORING';
  }

  // Remove platform brand name to prevent "AtlasFind" matching the verb "find"
  const textWithoutBrand = text.replace(/atlasfind/g, '').replace(/atlas-find/g, '');

  if (
    textWithoutBrand.includes('find') ||
    textWithoutBrand.includes('search') ||
    textWithoutBrand.includes('scholarship') ||
    textWithoutBrand.includes('internship') ||
    textWithoutBrand.includes('fellowship') ||
    textWithoutBrand.includes('looking for') ||
    textWithoutBrand.includes('january 2027') ||
    textWithoutBrand.includes('2027')
  ) {
    return 'DISCOVERY';
  }

  return 'GENERAL_CONVERSATION';
}

export interface OrchestrationContext {
  profile?: CandidateProfile;
  verifiedOpportunities: EvaluatedOpportunity[];
}

export function buildAgentInstructionPrompt(
  intent: UserIntent,
  context: OrchestrationContext
): string {
  const profileSummary = context.profile
    ? `CANDIDATE PROFILE:
- Nationality: ${context.profile.nationality || 'Not specified'}
- Degree Level: ${context.profile.level || 'Not specified'}
- Field of Study: ${context.profile.fieldOfStudy || 'Not specified'}
- Institution: ${context.profile.institution || 'Not specified'}
- Graduation Year: ${context.profile.graduationYear || 'Not specified'}
- GPA: ${context.profile.gpa ? (typeof context.profile.gpa === 'object' ? `${context.profile.gpa.value}/${context.profile.gpa.scale}` : context.profile.gpa) : 'Not specified'}`
    : 'CANDIDATE PROFILE: Guest / Anonymous user (no profile stored yet).';

  const oppSummary =
    context.verifiedOpportunities && context.verifiedOpportunities.length > 0
      ? `\nGROUNDED VERIFIED OPPORTUNITIES IN DATABASE:\n` +
        context.verifiedOpportunities
          .map(
            (o) =>
              `- ID: ${o.id} | ${o.title} (${o.hostCountry || 'Global'}) | Sponsor: ${o.sponsor} | Deadline: ${
                o.deadline ? new Date(o.deadline).toISOString().split('T')[0] : 'Rolling'
              } | URL: ${o.applyUrl || 'N/A'}`
          )
          .join('\n')
      : `\nGROUNDED VERIFIED OPPORTUNITIES IN DATABASE: None currently matched in local context.`;

  return `
You are Atlas, the principal AI Opportunity Advisor for AtlasFind.
Current detected user intent: ${intent}

${profileSummary}
${oppSummary}

OPERATIONAL DIRECTIVES:
1. Do not ask for profile details (e.g. nationality, degree level, field of study) if they are already provided above.
2. Ground all factual opportunity claims in the verified opportunity context provided. Never invent fictional opportunities, fake application links, or imaginary deadlines.
3. If no matching verified opportunity exists for an exact query (e.g. January 2027 internships in an uncommon discipline), state this truthfully and suggest verified adjacent pathways.
4. When recommending opportunities, cite the exact sponsor, application deadline, and official apply URL from the verified database.
5. In writing assistance, strictly adhere to academic integrity: offer constructive feedback, structure, and clarity, but NEVER ghostwrite or fabricate academic credentials.
`;
}

