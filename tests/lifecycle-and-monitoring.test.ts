import test from 'node:test';
import assert from 'node:assert';
import { assessOpportunityDeadlineHealth } from '../src/lib/agents/monitoringAgent.ts';
import {
  evaluateOpportunityLifecycle,
  normalizeDeadlineDate,
} from '../src/lib/opportunity/lifecycle.ts';

test('Lifecycle & Monitoring: Correctly classifies lifecycle stages based on timeline', () => {
  const now = new Date();

  // 1. Expired deadline (in the past)
  const pastDeadline = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  const expiredHealth = assessOpportunityDeadlineHealth('opp_1', pastDeadline);
  assert.strictEqual(expiredHealth.lifecycleStatus, 'EXPIRED');
  assert.strictEqual(expiredHealth.isUrgent, false);
  assert.ok(expiredHealth.daysUntilDeadline < 0);

  // 2. Closing soon deadline (within 14 days)
  const closingSoonDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
  const closingHealth = assessOpportunityDeadlineHealth('opp_2', closingSoonDeadline);
  assert.strictEqual(closingHealth.lifecycleStatus, 'CLOSING_SOON');
  assert.strictEqual(closingHealth.isUrgent, true);
  assert.strictEqual(closingHealth.daysUntilDeadline, 7);

  // 3. Active open deadline (> 14 days)
  const activeDeadline = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days ahead
  const activeHealth = assessOpportunityDeadlineHealth('opp_3', activeDeadline);
  assert.strictEqual(activeHealth.lifecycleStatus, 'ACTIVE');
  assert.strictEqual(activeHealth.isUrgent, false);

  // 4. Upcoming opportunity (opening date is in the future)
  const futureOpenDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // Opens in 10 days
  const futureDeadline = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // Deadline in 90 days
  const upcomingHealth = assessOpportunityDeadlineHealth('opp_4', futureDeadline, futureOpenDate);
  assert.strictEqual(upcomingHealth.lifecycleStatus, 'UPCOMING');
  assert.strictEqual(upcomingHealth.isUrgent, false);
});

test('Lifecycle & Monitoring: Decoupling verification audit status from lifecycle availability', () => {
  const verifiedRecord = {
    id: 'opp_authentic_1',
    verificationStatus: 'verified',
    verificationTrustTier: 1,
    sourceDomain: 'cern.ch',
    opportunityStatus: 'active',
  };

  const deadline = new Date(Date.now() - 1000 * 60 * 60 * 24); // Expired yesterday
  const health = assessOpportunityDeadlineHealth(verifiedRecord.id, deadline);

  const updatedRecord = {
    ...verifiedRecord,
    opportunityStatus: health.lifecycleStatus.toLowerCase(),
  };

  assert.strictEqual(updatedRecord.opportunityStatus, 'expired', 'Opportunity status must reflect expiration');
  assert.strictEqual(updatedRecord.verificationStatus, 'verified', 'Verification status must preserve authentic audit');
  assert.strictEqual(updatedRecord.verificationTrustTier, 1, 'Trust tier must remain intact');
});

test('Lifecycle & Monitoring: Opportunities with past deadlines never appear as active', () => {
  const expiredDeadlines = [
    { name: 'Chevening', deadline: '2026-11-03T12:00:00.000Z' },
    { name: 'CERN Autumn', deadline: '2026-10-19T23:59:59.000Z' },
    { name: 'ESA 2027', deadline: '2026-10-31T23:59:59.000Z' },
    { name: 'Google SWE', deadline: '2026-10-23T23:59:59.000Z' },
    { name: 'Rhodes', deadline: '2026-10-01T23:59:59.000Z' },
    { name: 'WBG Pioneers Winter', deadline: '2026-08-12T23:59:59.000Z' },
  ];

  for (const item of expiredDeadlines) {
    const health = assessOpportunityDeadlineHealth(item.name, item.deadline);
    assert.strictEqual(health.lifecycleStatus, 'EXPIRED', `${item.name} with deadline ${item.deadline} must be EXPIRED as of today`);
    assert.ok(health.daysUntilDeadline < 0, `${item.name} daysUntilDeadline must be negative`);
  }
});

// Comprehensive Lifecycle Management Coverage Suite (Cases 1-9)

test('Case 1: Opportunity whose deadline is in the future (>14 days)', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');
  const futureDeadline = '2027-02-15T23:59:59.000Z'; // 87 days ahead

  const res = evaluateOpportunityLifecycle({ deadline: futureDeadline }, refDate);
  assert.strictEqual(res.status, 'OPEN');
  assert.strictEqual(res.isOpen, true);
  assert.strictEqual(res.isClosed, false);
  assert.strictEqual(res.canApply, true);
  assert.strictEqual(res.applyButton.label, 'Apply Now');
  assert.strictEqual(res.applyButton.disabled, false);
  assert.strictEqual(res.applyButton.style, 'primary');
  assert.ok((res.daysRemaining ?? 0) > 14);
});

test('Case 2: Opportunity whose deadline is approaching within 7–14 days', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');
  const approachingDeadline = '2026-11-28T23:59:59.000Z'; // 8 days ahead

  const res = evaluateOpportunityLifecycle({ deadline: approachingDeadline }, refDate);
  assert.strictEqual(res.status, 'CLOSING_SOON');
  assert.strictEqual(res.isClosingSoon, true);
  assert.strictEqual(res.isClosed, false);
  assert.strictEqual(res.canApply, true);
  assert.strictEqual(res.applyButton.label, 'Apply Now');
  assert.strictEqual(res.applyButton.style, 'urgent');
  assert.strictEqual(res.daysRemaining, 8);
  assert.ok(res.badgeText.includes('8 days'));
});

test('Case 3: Opportunity whose deadline has passed', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');
  const pastDeadline = '2026-11-03T12:00:00.000Z'; // Passed 17 days ago

  const res = evaluateOpportunityLifecycle({ deadline: pastDeadline }, refDate);
  assert.strictEqual(res.status, 'CLOSED');
  assert.strictEqual(res.isClosed, true);
  assert.strictEqual(res.isOpen, false);
  assert.strictEqual(res.canApply, false);
  assert.strictEqual(res.applyButton.label, 'Applications Closed');
  assert.strictEqual(res.applyButton.disabled, true);
  assert.strictEqual(res.applyButton.style, 'disabled');
  assert.ok((res.daysRemaining ?? 0) < 0);
  assert.ok(res.notice?.includes('passed'));
});

test('Case 4: Timezone boundary check — Opportunity whose deadline is today', () => {
  // Candidate checks portal on November 20 at 14:00 UTC
  const refDate = new Date('2026-11-20T14:00:00.000Z');
  // Deadline was entered as date-only "2026-11-20"
  const dateOnlyDeadline = '2026-11-20';

  const normalized = normalizeDeadlineDate(dateOnlyDeadline);
  assert.ok(normalized);
  // Must normalize to end of day: 23:59:59.999Z
  assert.strictEqual(normalized.getUTCHours(), 23);
  assert.strictEqual(normalized.getUTCMinutes(), 59);
  assert.strictEqual(normalized.getUTCSeconds(), 59);

  const res = evaluateOpportunityLifecycle({ deadline: dateOnlyDeadline }, refDate);
  // Candidate must NOT be cut off at morning midnight; evaluated as closing today!
  assert.strictEqual(res.isClosed, false, 'Deadline today must NOT be marked closed before end of day');
  assert.strictEqual(res.status, 'CLOSING_SOON');
  assert.strictEqual(res.canApply, true);
  assert.strictEqual(res.badgeText, 'Closes Today');

  // Once time passes into the next day (Nov 21 00:00:01 UTC):
  const nextDay = new Date('2026-11-21T00:00:01.000Z');
  const resNextDay = evaluateOpportunityLifecycle({ deadline: dateOnlyDeadline }, nextDay);
  assert.strictEqual(resNextDay.status, 'CLOSED');
  assert.strictEqual(resNextDay.isClosed, true);
  assert.strictEqual(resNextDay.canApply, false);
});

test('Case 5: Opportunity marked closed before its scheduled deadline', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');
  // Future deadline, but sponsor explicitly closed applications early
  const futureDeadline = '2026-12-31T23:59:59.000Z';

  const res = evaluateOpportunityLifecycle({
    deadline: futureDeadline,
    explicitlyClosed: true,
  }, refDate);

  assert.strictEqual(res.status, 'CLOSED');
  assert.strictEqual(res.isClosed, true);
  assert.strictEqual(res.canApply, false);
  assert.strictEqual(res.applyButton.label, 'Applications Closed');
  assert.strictEqual(res.applyButton.disabled, true);
});

test('Case 6: Opportunity whose deadline was extended', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');
  // Originally expired on Nov 15, but organizer extended to Dec 15
  const originalDeadline = '2026-11-15T23:59:59.000Z';
  const extendedDeadline = '2026-12-15T23:59:59.000Z';

  const resOriginal = evaluateOpportunityLifecycle({ deadline: originalDeadline }, refDate);
  assert.strictEqual(resOriginal.status, 'CLOSED');

  const resExtended = evaluateOpportunityLifecycle({ deadline: extendedDeadline }, refDate);
  assert.strictEqual(resExtended.status, 'OPEN');
  assert.strictEqual(resExtended.canApply, true);
  assert.strictEqual(resExtended.applyButton.label, 'Apply Now');
  assert.strictEqual(resExtended.daysRemaining, 25);
});

test('Case 7: Opportunity with an unconfirmed or rolling deadline', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');

  // Rolling admissions
  const rollingRes = evaluateOpportunityLifecycle({ isRolling: true }, refDate);
  assert.strictEqual(rollingRes.status, 'UNCONFIRMED');
  assert.strictEqual(rollingRes.isRolling, true);
  assert.strictEqual(rollingRes.canApply, true);
  assert.strictEqual(rollingRes.applyButton.label, 'Apply Now (Rolling)');
  assert.strictEqual(rollingRes.formattedDeadline, 'Rolling / Open');

  // Missing deadline (dates unconfirmed)
  const unconfirmedRes = evaluateOpportunityLifecycle({ deadline: null }, refDate);
  assert.strictEqual(unconfirmedRes.status, 'UNCONFIRMED');
  assert.strictEqual(unconfirmedRes.canApply, true);
  assert.strictEqual(unconfirmedRes.applyButton.label, 'Apply Now (Rolling)');
});

test('Case 8: Programme starting in January 2027 whose application deadline has passed', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');
  // European Space Agency: Winter 2027 programme starts Feb 2027, but application closed Oct 31, 2026
  const esaOpp = {
    id: 'opp_esa_winter_2027',
    deadline: '2026-10-31T23:59:59.000Z',
    startDate: '2027-02-01T00:00:00.000Z',
  };

  const res = evaluateOpportunityLifecycle(esaOpp, refDate);
  assert.strictEqual(res.status, 'CLOSED', 'Passed application deadline must be marked CLOSED');
  assert.strictEqual(res.canApply, false, 'Closed opportunity must never allow application');
  assert.strictEqual(res.applyButton.label, 'Applications Closed');
  assert.strictEqual(res.applyButton.disabled, true);
  // Start date in 2027 is preserved, but lifecycle status accurately reflects passed deadline
  assert.ok(new Date(esaOpp.startDate).getFullYear() === 2027);
});

test('Case 9: Expired opportunity saved in a user tracker reflects status change without breaking', () => {
  const refDate = new Date('2026-11-20T12:00:00.000Z');

  // User saved this opportunity when it was active in September
  const savedItem = {
    id: 'saved_uuid_101',
    opportunityId: 'opp_chevening',
    status: 'saved',
    notes: 'Prepared 3 essay drafts.',
    opportunity: {
      id: 'opp_chevening',
      title: 'Chevening Scholarship 2027',
      sponsor: 'UK FCDO',
      deadline: '2026-11-03T12:00:00.000Z', // Expired
      applyUrl: 'https://chevening.org/apply',
    },
  };

  const lifecycle = evaluateOpportunityLifecycle({
    id: savedItem.opportunity.id,
    deadline: savedItem.opportunity.deadline,
  }, refDate);

  // Status must be closed, but the saved tracker record remains intact
  assert.strictEqual(lifecycle.status, 'CLOSED');
  assert.strictEqual(savedItem.id, 'saved_uuid_101');
  assert.strictEqual(savedItem.notes, 'Prepared 3 essay drafts.');
  assert.strictEqual(lifecycle.canApply, false);
  assert.strictEqual(lifecycle.applyButton.label, 'Applications Closed');
});
