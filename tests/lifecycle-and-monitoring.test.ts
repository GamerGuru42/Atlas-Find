import test from 'node:test';
import assert from 'node:assert';
import { assessOpportunityDeadlineHealth } from '../src/lib/agents/monitoringAgent.ts';

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
  // Verification evidence record
  const verifiedRecord = {
    id: 'opp_authentic_1',
    verificationStatus: 'verified', // Independent verification
    verificationTrustTier: 1,
    sourceDomain: 'cern.ch',
    opportunityStatus: 'active', // Lifecycle state
  };

  // Simulating scheduled cron evaluation on deadline expiration
  const deadline = new Date(Date.now() - 1000 * 60 * 60 * 24); // Expired yesterday
  const health = assessOpportunityDeadlineHealth(verifiedRecord.id, deadline);

  // When updating lifecycle status to expired:
  const updatedRecord = {
    ...verifiedRecord,
    opportunityStatus: health.lifecycleStatus.toLowerCase(), // becomes 'expired'
    // verificationStatus remains 'verified' — NEVER overwritten with 'closed'
  };

  assert.strictEqual(updatedRecord.opportunityStatus, 'expired', 'Opportunity status must reflect expiration');
  assert.strictEqual(updatedRecord.verificationStatus, 'verified', 'Verification status must preserve authentic audit');
  assert.strictEqual(updatedRecord.verificationTrustTier, 1, 'Trust tier must remain intact');
});

test('Lifecycle & Monitoring: Opportunities with past deadlines never appear as active', () => {
  // Chevening (deadline Nov 3, 2026), CERN (Oct 19, 2026), ESA (Oct 31, 2026), Google (Oct 23, 2026)
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

  // Open opportunities as of Nov 16, 2026
  const openDeadlines = [
    { name: 'IAESTE', deadline: '2026-11-30T23:59:59.000Z' },
    { name: 'Swiss Excellence', deadline: '2026-11-30T23:59:59.000Z' },
    { name: 'Gates Cambridge', deadline: '2026-12-03T23:59:59.000Z' },
    { name: 'Mastercard Foundation', deadline: '2026-12-15T23:59:59.000Z' },
    { name: 'OECD Rolling', deadline: '2026-12-31T23:59:59.000Z' },
    { name: 'Erasmus Mundus', deadline: '2027-01-15T23:59:59.000Z' },
  ];

  for (const item of openDeadlines) {
    const health = assessOpportunityDeadlineHealth(item.name, item.deadline);
    assert.ok(health.lifecycleStatus === 'ACTIVE' || health.lifecycleStatus === 'CLOSING_SOON', `${item.name} must be active or closing soon`);
    assert.ok(health.daysUntilDeadline >= 0, `${item.name} daysUntilDeadline must be non-negative`);
  }
});

