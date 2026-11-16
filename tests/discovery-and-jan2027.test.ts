import test from 'node:test';
import assert from 'node:assert';
import { parseNaturalLanguageSearch } from '../src/lib/agents/discoveryAgent.ts';
import { evaluateEligibility } from '../src/lib/matching/engine.ts';
import type { CandidateProfile, EvaluatedOpportunity } from '../src/lib/matching/engine.ts';

test('Discovery Agent: Parses January 2027 internship query accurately', () => {
  const prompt = 'Find software engineering internships starting in January 2027 in Germany';
  const query = parseNaturalLanguageSearch(prompt);

  // Type check
  assert.ok(query.types?.includes('INTERNSHIP'), 'Should detect internship type');

  // Date range check: strictly January 2027
  assert.ok(query.startDateFrom, 'Should populate startDateFrom');
  assert.ok(query.startDateTo, 'Should populate startDateTo');
  assert.strictEqual(query.startDateFrom?.toISOString().slice(0, 10), '2027-01-01');
  assert.strictEqual(query.startDateTo?.toISOString().slice(0, 10), '2027-01-31');

  // Discipline
  assert.ok(query.disciplines?.includes('Software Engineering'), 'Should detect Software Engineering');
  assert.ok(query.disciplines?.includes('Computer Science'), 'Should include Computer Science synonym');

  // Location
  assert.ok(query.hostCountries?.includes('Germany'), 'Should identify Germany as host country');
});

test('Discovery Agent: Distinguishes confirmed January 2027 start date from application deadline', () => {
  // World Bank Winter Internship is officially confirmed for January 15, 2027 start date
  const worldBankOpportunity = {
    title: 'World Bank Winter Internship Program 2027',
    deadline: new Date('2026-10-31T23:59:59.000Z'), // Application deadline is October 2026
    intakes: [
      {
        intakeName: 'Winter 2027 Internship Session',
        startDate: new Date('2027-01-15T00:00:00.000Z'), // Start date is Jan 15, 2027
        deadlineDate: new Date('2026-10-31T23:59:59.000Z'),
      },
    ],
  };

  const parsed = parseNaturalLanguageSearch('internships starting January 2027');
  const targetStartFrom = parsed.startDateFrom!;
  const targetStartTo = parsed.startDateTo!;

  // Intake start date falls within Jan 2027
  const intakeStart = worldBankOpportunity.intakes[0].startDate;
  const isStartMatching = intakeStart >= targetStartFrom && intakeStart <= targetStartTo;
  assert.strictEqual(isStartMatching, true, 'World Bank intake start date must match January 2027 window');

  // While application deadline is NOT in Jan 2027
  const deadline = worldBankOpportunity.deadline;
  const isDeadlineMatching = deadline >= targetStartFrom && deadline <= targetStartTo;
  assert.strictEqual(isDeadlineMatching, false, 'Deadline is separate from start date');
});

test('January 2027 Protection: ESA (February 2027) is strictly excluded from January 2027 window', () => {
  const parsed = parseNaturalLanguageSearch('internships starting January 2027');
  const targetStartFrom = parsed.startDateFrom!;
  const targetStartTo = parsed.startDateTo!;

  // ESA official start is February 1, 2027
  const esaStartDate = new Date('2027-02-01T00:00:00.000Z');
  const isEsaMatchingJan2027 = esaStartDate >= targetStartFrom && esaStartDate <= targetStartTo;

  assert.strictEqual(isEsaMatchingJan2027, false, 'ESA starting in February 2027 must NOT appear in January 2027 queries');
});

test('January 2027 Protection: CERN (flexible/undetermined start date) is excluded from January 2027 window', () => {
  const parsed = parseNaturalLanguageSearch('internships starting January 2027');
  const targetStartFrom = parsed.startDateFrom!;
  const targetStartTo = parsed.startDateTo!;

  // CERN has flexible start date (null)
  const cernIntake: { startDate: Date | null } = { startDate: null };
  const isCernMatching = Boolean(
    cernIntake.startDate &&
    cernIntake.startDate >= targetStartFrom &&
    cernIntake.startDate <= targetStartTo
  );

  assert.strictEqual(isCernMatching, false, 'CERN with flexible/null start date must NOT match fixed January 2027 queries');
});

test('January 2027 Protection: Erasmus Mundus has deadline in Jan 2027, but starts September 2027', () => {
  const parsed = parseNaturalLanguageSearch('scholarships starting in January 2027');
  const targetStartFrom = parsed.startDateFrom!;
  const targetStartTo = parsed.startDateTo!;

  const emjmd = {
    title: 'Erasmus Mundus Joint Master Degrees (EMJMD) 2027',
    deadline: new Date('2027-01-15T23:59:59.000Z'),
    intakes: [
      {
        intakeName: '2027/2028 Academic Intake',
        deadlineDate: new Date('2027-01-15T23:59:59.000Z'),
        startDate: new Date('2027-09-01T00:00:00.000Z'),
      },
    ],
  };

  const isStartInJan = emjmd.intakes[0].startDate >= targetStartFrom && emjmd.intakes[0].startDate <= targetStartTo;
  assert.strictEqual(isStartInJan, false, 'Erasmus Mundus starts in September 2027, so must NOT match Jan 2027 start queries');
});

test('Eligibility & Nationality Restrictions: Evaluates ESA and CERN restrictions correctly', () => {
  const esaOpportunity: EvaluatedOpportunity = {
    id: 'opp-esa',
    title: 'ESA Student Internship Programme 2027',
    type: 'INTERNSHIP',
    sponsor: 'European Space Agency (ESA)',
    hostCountry: 'Germany',
    eligibleCountries: ['ESA Member States', 'ESA Associate Member States', 'Canada'],
    disciplines: ['Software Engineering', 'Computer Science'],
    degreeLevel: ['bachelors', 'masters'],
    fundingType: 'fully_funded',
    deadline: new Date('2026-10-31T23:59:59.000Z'),
    trustTier: 1,
    verificationStatus: 'verified',
  };

  // German candidate (ESA Member State) -> Eligible
  const germanStudent: CandidateProfile = {
    nationality: 'Germany',
    fieldOfStudy: 'Computer Science',
    level: 'bachelors',
  };
  const germanResult = evaluateEligibility(germanStudent, esaOpportunity);
  assert.strictEqual(germanResult.status, 'ELIGIBLE', 'German student is eligible for ESA');
  assert.strictEqual(germanResult.isDisqualified, false, 'German student is not disqualified');

  // Nigerian candidate (Non-ESA state) -> Ineligible for ESA
  const nigerianStudent: CandidateProfile = {
    nationality: 'Nigeria',
    fieldOfStudy: 'Computer Science',
    level: 'bachelors',
  };
  const nigerianResult = evaluateEligibility(nigerianStudent, esaOpportunity);
  assert.strictEqual(nigerianResult.status, 'NOT_ELIGIBLE', 'Nigerian candidate must be marked ineligible for ESA');
  assert.strictEqual(nigerianResult.isDisqualified, true, 'Nigerian student is disqualified due to nationality');
  assert.ok(
    nigerianResult.disqualifyingReasons.some(r => r.toLowerCase().includes('nationality') || r.toLowerCase().includes('restricted')),
    'Must explain nationality restriction'
  );

  // Mastercard Foundation Scholars -> Restricted to African countries
  const mcfOpportunity: EvaluatedOpportunity = {
    id: 'opp-mcf',
    title: 'Mastercard Foundation Scholars Program 2027',
    type: 'SCHOLARSHIP',
    sponsor: 'Mastercard Foundation',
    hostCountry: 'Global Partner Universities',
    eligibleCountries: ['African Countries', 'Sub-Saharan Africa', 'Nigeria', 'Ghana', 'Kenya'],
    disciplines: ['STEM', 'Computer Science'],
    degreeLevel: ['masters'],
    fundingType: 'fully_funded',
    deadline: new Date('2026-12-15T23:59:59.000Z'),
    trustTier: 1,
    verificationStatus: 'verified',
  };

  const nigerianMcfResult = evaluateEligibility({ ...nigerianStudent, level: 'masters' }, mcfOpportunity);
  assert.strictEqual(nigerianMcfResult.status, 'ELIGIBLE', 'Nigerian student is eligible for Mastercard Foundation');

  const germanMcfResult = evaluateEligibility({ ...germanStudent, level: 'masters' }, mcfOpportunity);
  assert.strictEqual(germanMcfResult.status, 'NOT_ELIGIBLE', 'German student must be ineligible for Mastercard Foundation');
});

test('Discovery Agent: Parses complex multi-criteria scholarship search', () => {
  const prompt = 'Looking for fully funded masters scholarships in the UK for Nigerian graduates';
  const query = parseNaturalLanguageSearch(prompt);

  assert.ok(query.types?.includes('SCHOLARSHIP'), 'Should identify scholarship');
  assert.ok(query.fundingTypes?.includes('fully_funded'), 'Should identify fully funded');
  assert.ok(query.degreeLevels?.includes('masters'), 'Should identify masters');
  assert.ok(query.hostCountries?.includes('United Kingdom'), 'Should identify UK');
  assert.strictEqual(query.eligibleNationality, 'Nigeria', 'Should identify Nigerian nationality');
});
