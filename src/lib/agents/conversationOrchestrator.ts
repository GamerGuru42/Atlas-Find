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
  | 'GREETING'
  | 'CASUAL_CHITCHAT'
  | 'GENERAL_CONVERSATION'
  | 'CONTEXTUAL_FOLLOWUP'
  | 'DISCOVERY'
  | 'ELIGIBILITY_CHECK'
  | 'RESEARCH'
  | 'APPLICATION_STRATEGY'
  | 'WRITING_ASSISTANCE'
  | 'DEADLINE_MONITORING';

export interface MessageHistoryItem {
  role: string;
  content: string;
}

export function classifyIntent(prompt: string, history: MessageHistoryItem[] = []): UserIntent {
  const text = prompt.toLowerCase().trim();

  // 1. Pure Greetings (short and conversational)
  const greetingRegex = /^(hello|hi|hey|hiya|howdy|good\s+(morning|afternoon|evening)|yo|greetings)[!.,? ]*$/i;
  if (greetingRegex.test(text)) {
    return 'GREETING';
  }

  // 2. Casual Chitchat (checking in, saying fine, asking how are you)
  if (
    text.includes('how are you') ||
    text.includes("how're you") ||
    text.includes('how are things') ||
    text.includes("how's it going") ||
    text.includes('how do you do') ||
    text === "i'm fine" ||
    text === 'im fine' ||
    text === 'i am fine' ||
    text.startsWith("i'm fine") ||
    text.startsWith('im fine') ||
    text.startsWith('i am fine') ||
    text.includes('doing well') ||
    text === 'fine thanks' ||
    text === 'fine, thanks' ||
    text === 'good thanks' ||
    text === 'good, thanks' ||
    text === 'not bad'
  ) {
    return 'CASUAL_CHITCHAT';
  }

  // 3. Writing Assistance
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

  // 4. Eligibility Check
  if (
    text.includes('am i eligible') ||
    text.includes('can i apply') ||
    text.includes('do i qualify') ||
    text.includes('match score')
  ) {
    return 'ELIGIBILITY_CHECK';
  }

  // 5. Application Strategy
  if (
    text.includes('roadmap') ||
    text.includes('timeline') ||
    text.includes('how to prepare') ||
    text.includes('strategy for')
  ) {
    return 'APPLICATION_STRATEGY';
  }

  // 6. Research
  if (
    text.includes('tell me about') ||
    text.includes('who sponsors') ||
    text.includes('is it legit') ||
    text.includes('official portal')
  ) {
    return 'RESEARCH';
  }

  // 7. Deadline Monitoring
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

  // 8. Explicit Opportunity Discovery Requests
  if (
    textWithoutBrand.includes('find') ||
    textWithoutBrand.includes('search') ||
    textWithoutBrand.includes('scholarship') ||
    textWithoutBrand.includes('internship') ||
    textWithoutBrand.includes('fellowship') ||
    textWithoutBrand.includes('looking for') ||
    textWithoutBrand.includes('grant') ||
    textWithoutBrand.includes('january 2027') ||
    textWithoutBrand.includes('2027')
  ) {
    return 'DISCOVERY';
  }

  // 9. Contextual Follow-up (using conversation history)
  if (history && history.length > 0) {
    const lastAssistantMsg = [...history].reverse().find(m => m.role === 'assistant');
    const lastUserPrior = [...history].reverse().find(m => m.role === 'user' && m.content !== prompt);

    const prevContext = ((lastAssistantMsg?.content || '') + ' ' + (lastUserPrior?.content || '')).toLowerCase();

    // If previous discussion was about opportunities/internships/scholarships and user provides refinement:
    if (
      prevContext.includes('internship') ||
      prevContext.includes('scholarship') ||
      prevContext.includes('fellowship') ||
      prevContext.includes('opportunity') ||
      prevContext.includes('kind of') ||
      prevContext.includes('interested in')
    ) {
      // User says "Software engineering", "In Nigeria", "Remote", "For Masters", etc.
      return 'CONTEXTUAL_FOLLOWUP';
    }
  }

  return 'GENERAL_CONVERSATION';
}

export interface OrchestrationContext {
  userName?: string;
  profile?: CandidateProfile;
  verifiedOpportunities: EvaluatedOpportunity[];
}

export function buildAgentInstructionPrompt(
  intent: UserIntent,
  context: OrchestrationContext
): string {
  const nameDirective = context.userName
    ? `USER IDENTITY: First Name: "${context.userName}". You may address them by first name naturally as a friend or colleague would.`
    : `USER IDENTITY: Guest or Anonymous user. No verified name provided. DO NOT invent, guess, or assume a name (do NOT call them Benny). Greet warmly without using an invented name.`;

  const profileSummary = context.profile
    ? `CANDIDATE PROFILE (Known facts):
- Nationality: ${context.profile.nationality || 'Not specified'}
- Degree Level: ${context.profile.level || 'Not specified'}
- Field of Study: ${context.profile.fieldOfStudy || 'Not specified'}
- Institution: ${context.profile.institution || 'Not specified'}
- Graduation Year: ${context.profile.graduationYear || 'Not specified'}
- GPA: ${context.profile.gpa ? (typeof context.profile.gpa === 'object' ? `${context.profile.gpa.value}/${context.profile.gpa.scale}` : context.profile.gpa) : 'Not specified'}`
    : 'CANDIDATE PROFILE: No profile parameters stored yet.';

  let intentDirective = '';
  switch (intent) {
    case 'GREETING':
      intentDirective = `CURRENT INTENT: GREETING
- The user is saying hello or greeting you.
- Respond with a brief, friendly, natural greeting (1-2 sentences).
- If user name is known, greet them by name. If not, greet warmly without inventing a name.
- Ask how they are doing or what they'd like help with.
- DO NOT introduce the platform, DO NOT list scholarships, and DO NOT ask for their degree or field of study.`;
      break;

    case 'CASUAL_CHITCHAT':
      intentDirective = `CURRENT INTENT: CASUAL CHITCHAT
- The user is chatting casually (e.g. asking how you are or saying they're doing fine).
- Respond warmly and conversationally, like ChatGPT at its best.
- Ask an open, friendly question (e.g. "What are we working on today?").
- DO NOT lecture, DO NOT pitch opportunities, and DO NOT ask for degree qualifications unprompted.`;
      break;

    case 'GENERAL_CONVERSATION':
      intentDirective = `CURRENT INTENT: GENERAL CONVERSATION
- The user is asking a general question, explanation, or advice.
- Answer clearly, intelligently, and helpfully.
- Do NOT force an opportunity search into an unrelated inquiry.`;
      break;

    case 'DISCOVERY':
    case 'CONTEXTUAL_FOLLOWUP':
      intentDirective = `CURRENT INTENT: OPPORTUNITY RESEARCH & DISCOVERY
- The user is seeking opportunity recommendations or providing criteria (e.g. discipline, location, timeline).
- Maintain conversation context across all previous messages.
- If key details are still needed, ask ONE clear clarification question at a time.
- If criteria are clear, recommend genuine opportunities grounded in the verified database context below.
- Clearly distinguish programme start dates (e.g. January 2027) from application deadlines.`;
      break;

    case 'ELIGIBILITY_CHECK':
      intentDirective = `CURRENT INTENT: ELIGIBILITY EVALUATION
- Evaluate the candidate's profile against verified opportunity requirements transparently and honestly.
- Ground all match assessments in factual criteria.`;
      break;

    case 'WRITING_ASSISTANCE':
      intentDirective = `CURRENT INTENT: WRITING ASSISTANCE
- Offer constructive critique, structure, clarity, and strategic angles for application materials.
- Strictly adhere to academic integrity: NEVER ghostwrite or fabricate essays or credentials.`;
      break;

    default:
      intentDirective = `CURRENT INTENT: ${intent}
- Respond conversationally, strategically, and honestly.`;
      break;
  }

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
      : '';

  return `
You are Atlas, the intelligent, perceptive AI research partner inside AtlasFind.

${nameDirective}

${intentDirective}

${profileSummary}
${oppSummary}

OPERATIONAL DIRECTIVES:
1. Do not ask for profile details (e.g. nationality, degree level, field of study) if they are already known from the conversation or profile above.
2. Ground all factual opportunity claims in the verified opportunity context provided. Never invent fictional opportunities, fake application links, or imaginary deadlines.
3. If no matching verified opportunity exists for an exact query (e.g. January 2027 internships in an uncommon discipline), state this truthfully and suggest verified adjacent pathways.
4. When recommending opportunities, cite the exact sponsor, application deadline, and official apply URL from the verified database.
5. In writing assistance, strictly adhere to academic integrity: offer constructive feedback, structure, and clarity, but NEVER ghostwrite.
`;
}

