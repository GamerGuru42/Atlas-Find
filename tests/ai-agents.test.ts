import test from 'node:test';
import assert from 'node:assert';
import {
  GEMINI_MODEL_ID,
  GEMINI_REASONING_MODEL_ID,
  getAIModel,
  isAIConfigured,
  AI_CONFIG,
} from '../src/lib/ai/config.ts';
import { parseNaturalLanguageSearch } from '../src/lib/agents/discoveryAgent.ts';
import { explainOpportunityEligibility } from '../src/lib/agents/eligibilityAgent.ts';
import { researchOpportunityBackground } from '../src/lib/agents/researchAgent.ts';
import { generateApplicationStrategy } from '../src/lib/agents/applicationStrategistAgent.ts';
import { reviewApplicationDraft } from '../src/lib/agents/writingAssistantAgent.ts';
import { assessOpportunityDeadlineHealth } from '../src/lib/agents/monitoringAgent.ts';
import { classifyIntent, buildAgentInstructionPrompt } from '../src/lib/agents/conversationOrchestrator.ts';
import { verifyCronAuthorization } from '../src/lib/auth/cronAuth.ts';

// 1. Centralized AI Model Configuration Tests
test('AI Configuration: Centralizes supported production Gemini model', () => {
  assert.strictEqual(GEMINI_MODEL_ID, 'gemini-3.8-flash', 'Default model must be gemini-3.8-flash');
  assert.strictEqual(GEMINI_REASONING_MODEL_ID, 'gemini-3.8-pro', 'Reasoning model must be gemini-3.8-pro');

  // Verify model factory creates valid provider instances without throwing
  const defaultModel = getAIModel('default');
  assert.strictEqual(defaultModel.modelId, 'gemini-3.8-flash');
  assert.strictEqual(defaultModel.provider, 'google.generative-ai');

  const reasoningModel = getAIModel('reasoning');
  assert.strictEqual(reasoningModel.modelId, 'gemini-3.8-pro');

  // Check config parameters
  assert.strictEqual(AI_CONFIG.streamingTimeoutSeconds, 60);
  assert.strictEqual(AI_CONFIG.temperature.balanced, 0.6);
});

// 2. Agent A: Discovery Assistant
test('Agent A (Discovery): Extracts structured queries and January 2027 start dates', () => {
  const query = parseNaturalLanguageSearch('Find AI research internships in Switzerland starting in January 2027');
  assert.ok(query.types?.includes('INTERNSHIP'), 'Should detect INTERNSHIP');
  assert.strictEqual(query.startDateFrom?.toISOString().slice(0, 10), '2027-01-01');
  assert.strictEqual(query.startDateTo?.toISOString().slice(0, 10), '2027-01-31');
  assert.ok(query.hostCountries?.includes('Switzerland'), 'Should detect Switzerland');
});

// 3. Agent B: Eligibility Assistant
test('Agent B (Eligibility): Delivers transparent eligibility explanation without hallucinations', () => {
  const opp = {
    id: 'opp_epos',
    title: 'DAAD EPOS Postgraduate Scholarship',
    hostCountry: 'Germany',
    degreeLevel: ['masters'],
    eligibleCountries: ['Developing Countries'],
    deadline: new Date('2027-10-31T23:59:59.000Z'),
  };

  // Matched candidate
  const profileEligible = {
    nationality: 'Nigeria',
    level: 'bachelors',
    fieldOfStudy: 'Engineering',
  };

  const explanation1 = explainOpportunityEligibility(profileEligible, opp);
  assert.strictEqual(explanation1.status, 'ELIGIBLE');
  assert.ok(explanation1.matchScore >= 70);
  assert.ok(explanation1.explanation.includes('You meet all established mandatory criteria'));

  // Disqualified candidate
  const profileDisqualified = {
    nationality: 'Germany', // Citizens of Germany ineligible for DAAD scholarships in Germany
    level: 'bachelors',
    fieldOfStudy: 'Engineering',
  };

  const explanation2 = explainOpportunityEligibility(profileDisqualified, opp);
  assert.strictEqual(explanation2.status, 'NOT_ELIGIBLE');
  assert.ok(explanation2.disqualifications.length > 0);
});

// 4. Agent C: Research Assistant
test('Agent C (Research): Builds verifiable opportunity dossiers and detects official portals', () => {
  const dossier = researchOpportunityBackground({
    sponsor: 'CERN',
    orgType: 'International Research Organization',
    applyUrl: 'https://careers.cern/students',
    sourceDomain: 'cern.ch',
    type: 'INTERNSHIP',
  });

  assert.strictEqual(dossier.sponsor, 'CERN');
  assert.strictEqual(dossier.domainTrustTier, 1);
  assert.strictEqual(dossier.isDomainVerified, true);
  assert.ok(dossier.requiredDocuments.includes('Official Academic Transcripts (Certified English translation if applicable)'));
  assert.ok(dossier.requiredDocuments.some((d) => d.includes('Certificate of Enrollment')));
  assert.ok(dossier.intakeCadence.includes('Seasonal intakes'));
});

// 5. Agent D: Application Strategist
test('Agent D (Strategist): Builds milestone roadmaps backward from deadline', () => {
  // 60 days ahead
  const deadlineFuture = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
  const strategy = generateApplicationStrategy('Gates Cambridge Scholarship', deadlineFuture);

  assert.strictEqual(strategy.urgencyLevel, 'MODERATE');
  assert.strictEqual(strategy.daysRemaining, 60);
  assert.ok(strategy.milestones.length >= 3);
  assert.strictEqual(strategy.milestones[0].phase, 'Eligibility Confirmation & Document Audit');

  // 10 days ahead (Urgent)
  const deadlineUrgent = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const strategyUrgent = generateApplicationStrategy('Urgent Grant', deadlineUrgent);
  assert.strictEqual(strategyUrgent.urgencyLevel, 'URGENT');
});

// 6. Agent E: Writing Assistant (Anti-Ghostwriting Governance)
test('Agent E (Writing Assistant): Enforces anti-ghostwriting governance and structural critique', () => {
  const sampleDraft = `I am applying for this scholarship because I am very interested in data science. I have studied at university for three years and completed various projects. I want to contribute to the field.`;
  const feedback = reviewApplicationDraft(sampleDraft, 'STATEMENT_OF_PURPOSE', {
    title: 'Rhodes Scholarship',
    sponsor: 'Rhodes Trust',
  });

  assert.strictEqual(feedback.documentType, 'STATEMENT_OF_PURPOSE');
  // Flagged for brief word count (<500)
  assert.ok(feedback.areasForImprovement.some((a) => a.includes('is brief')));
  // Flagged for lack of quantitative metrics
  assert.ok(feedback.areasForImprovement.some((a) => a.includes('Lacks quantitative evidence')));
  // Enforces authentic authorship disclaimer
  assert.ok(feedback.authenticityNotice.includes('does not ghostwrite'));
});

// 7. Agent F: Monitoring Assistant
test('Agent F (Monitoring): Assesses urgency and deadline health correctly', () => {
  const now = new Date();
  const closingSoon = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
  const health = assessOpportunityDeadlineHealth('opp_cern', closingSoon);

  assert.strictEqual(health.lifecycleStatus, 'CLOSING_SOON');
  assert.strictEqual(health.isUrgent, true);
  assert.strictEqual(health.daysUntilDeadline, 5);
});

// 8. Agent G: Conversation Orchestrator
test('Agent G (Orchestrator): Accurately routes user intents across 7 specializations', () => {
  assert.strictEqual(classifyIntent('find software engineering internships starting in January 2027'), 'DISCOVERY');
  assert.strictEqual(classifyIntent('Am I eligible for this scholarship with a 3.5 GPA?'), 'ELIGIBILITY_CHECK');
  assert.strictEqual(classifyIntent('Can you critique my CV and personal statement?'), 'WRITING_ASSISTANCE');
  assert.strictEqual(classifyIntent('Tell me about the official sponsor and required documents for Chevening'), 'RESEARCH');
  assert.strictEqual(classifyIntent('What is the preparation timeline and strategy for Gates Cambridge?'), 'APPLICATION_STRATEGY');
  assert.strictEqual(classifyIntent('Which opportunities are closing soon or have expired deadlines?'), 'DEADLINE_MONITORING');
  assert.strictEqual(classifyIntent('Hello! How does AtlasFind work?'), 'GENERAL_CONVERSATION');

  // Verify prompt assembly includes grounded context
  const instruction = buildAgentInstructionPrompt('DISCOVERY', {
    verifiedOpportunities: [
      {
        id: 'opp_esa',
        title: 'European Space Agency Winter Internship 2027',
        sponsor: 'ESA',
        hostCountry: 'Germany',
        deadline: new Date('2026-10-31T23:59:59.000Z'),
        degreeLevel: ['bachelors', 'masters'],
        fundingType: 'fully_funded',
      },
    ],
  });

  assert.ok(instruction.includes('European Space Agency Winter Internship 2027'));
  assert.ok(instruction.includes('GROUNDED VERIFIED OPPORTUNITIES IN DATABASE'));
});

// 9. Cron Authorization Guard Tests
test('Cron Authorization: Defends scheduled endpoints with constant-time Bearer validation', () => {
  const secret = 'prod_cron_secret_test_992211';
  process.env.CRON_SECRET = secret;

  // Missing header
  const req1 = new Request('http://localhost:3000/api/cron/check-deadlines');
  assert.strictEqual(verifyCronAuthorization(req1).authorized, false);

  // Wrong Bearer prefix
  const req2 = new Request('http://localhost:3000/api/cron/check-deadlines', {
    headers: { authorization: `Basic ${secret}` },
  });
  assert.strictEqual(verifyCronAuthorization(req2).authorized, false);

  // Wrong secret (different length)
  const req3 = new Request('http://localhost:3000/api/cron/check-deadlines', {
    headers: { authorization: 'Bearer short_secret' },
  });
  assert.strictEqual(verifyCronAuthorization(req3).authorized, false);

  // Wrong secret (same length)
  const req4 = new Request('http://localhost:3000/api/cron/check-deadlines', {
    headers: { authorization: 'Bearer prod_cron_secret_test_000000' },
  });
  assert.strictEqual(verifyCronAuthorization(req4).authorized, false);

  // Valid secret
  const req5 = new Request('http://localhost:3000/api/cron/check-deadlines', {
    headers: { authorization: `Bearer ${secret}` },
  });
  assert.strictEqual(verifyCronAuthorization(req5).authorized, true);

  delete process.env.CRON_SECRET;
});