import test from 'node:test';
import assert from 'node:assert';
import {
  evaluateEligibility,
  isNationalityEligible,
  normalizeDegreeLevel,
} from '../src/lib/matching/engine.ts';
import type {
  CandidateProfile,
  EvaluatedOpportunity,
} from '../src/lib/matching/engine.ts';

test('Matching Engine: normalizeDegreeLevel correctly categorizes qualifications', () => {
  assert.strictEqual(normalizeDegreeLevel('Undergraduate (BSc)'), 'bachelors');
  assert.strictEqual(normalizeDegreeLevel('Bachelor of Science'), 'bachelors');
  assert.strictEqual(normalizeDegreeLevel('MSc Computer Science'), 'masters');
  assert.strictEqual(normalizeDegreeLevel('Master of Business Administration'), 'masters');
  assert.strictEqual(normalizeDegreeLevel('PhD in Physics'), 'phd');
  assert.strictEqual(normalizeDegreeLevel('Postdoctoral Fellow'), 'postdoc');
  assert.strictEqual(normalizeDegreeLevel(null), null);
});

test('Matching Engine: isNationalityEligible handles global and restricted criteria', () => {
  // Global
  const globalCheck = isNationalityEligible('Nigeria', ['Global']);
  assert.strictEqual(globalCheck.eligible, true);
  assert.strictEqual(globalCheck.indefinite, false);

  // Open to all (empty)
  const openCheck = isNationalityEligible('Ghana', []);
  assert.strictEqual(openCheck.eligible, true);

  // Explicit country match
  const directCheck = isNationalityEligible('Kenya', ['Kenya', 'Uganda', 'Tanzania']);
  assert.strictEqual(directCheck.eligible, true);

  // Regional cohort match (Nigeria in Developing Countries)
  const regionalCheck = isNationalityEligible('Nigeria', ['Developing Countries']);
  assert.strictEqual(regionalCheck.eligible, true);

  // Ineligible nationality
  const ineligibleCheck = isNationalityEligible('France', ['Nigeria', 'Ghana', 'Kenya']);
  assert.strictEqual(ineligibleCheck.eligible, false);
  assert.strictEqual(ineligibleCheck.indefinite, false);

  // Missing nationality in profile -> indefinite (not hard disqualified)
  const missingCheck = isNationalityEligible(null, ['Nigeria', 'Ghana']);
  assert.strictEqual(missingCheck.eligible, false);
  assert.strictEqual(missingCheck.indefinite, true);
});

test('Matching Engine: Full profile evaluation calculates genuine match and truthful status', () => {
  const opportunity: EvaluatedOpportunity = {
    id: 'opp-esa-2027',
    title: 'European Space Agency Winter Internship 2027',
    type: 'INTERNSHIP',
    sponsor: 'European Space Agency',
    hostCountry: 'Germany',
    continent: 'Europe',
    eligibleCountries: ['Global', 'All countries'],
    disciplines: ['Software Engineering', 'Computer Science'],
    degreeLevel: ['bachelors', 'masters'],
    fundingType: 'fully_funded',
    deadline: new Date('2026-10-31T23:59:59.000Z'),
  };

  // 1. Fully eligible student
  const qualifiedCandidate: CandidateProfile = {
    nationality: 'Nigeria',
    level: 'bachelors',
    fieldOfStudy: 'Computer Science',
    gpa: { value: 3.8, scale: 4.0 },
    preferredCountries: ['Germany', 'United Kingdom'],
    fundingNeeds: 'fully_funded',
  };

  const evalResult1 = evaluateEligibility(qualifiedCandidate, opportunity);
  assert.strictEqual(evalResult1.status, 'ELIGIBLE');
  assert.strictEqual(evalResult1.isDisqualified, false);
  assert.ok(evalResult1.matchScore >= 85, `Expected score >= 85, got ${evalResult1.matchScore}`);
  assert.ok(evalResult1.matchedRequirements.length >= 3);

  // 2. Candidate with missing degree level -> POTENTIALLY_ELIGIBLE
  const partialCandidate: CandidateProfile = {
    nationality: 'Nigeria',
    level: null, // missing degree level
    fieldOfStudy: 'Software Engineering',
  };

  const evalResult2 = evaluateEligibility(partialCandidate, opportunity);
  assert.strictEqual(evalResult2.status, 'POTENTIALLY_ELIGIBLE');
  assert.strictEqual(evalResult2.isDisqualified, false);
  assert.ok(evalResult2.missingInformation.length > 0);

  // 3. Candidate applying to restricted doctoral grant with undergraduate standing
  const phdOpp: EvaluatedOpportunity = {
    id: 'opp-phd-only',
    title: 'Advanced Doctoral Research Fellowship',
    type: 'FELLOWSHIP',
    sponsor: 'Research Foundation',
    hostCountry: 'Switzerland',
    eligibleCountries: ['Global'],
    disciplines: ['Computer Science'],
    degreeLevel: ['phd', 'postdoc'],
    fundingType: 'fully_funded',
    deadline: new Date('2026-12-01T23:59:59.000Z'),
  };

  const undergradCandidate: CandidateProfile = {
    nationality: 'Nigeria',
    level: 'bachelors',
    fieldOfStudy: 'Computer Science',
  };

  const evalResult3 = evaluateEligibility(undergradCandidate, phdOpp);
  assert.strictEqual(evalResult3.status, 'NOT_ELIGIBLE');
  assert.strictEqual(evalResult3.isDisqualified, true);
  assert.ok(evalResult3.disqualifyingReasons.length > 0);
  assert.ok(evalResult3.matchScore <= 25, 'Disqualified candidates must not be given misleading high scores');
});
