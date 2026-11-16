import test from 'node:test';
import assert from 'node:assert';
import {
  isSafePublicUrl,
  evaluateDomainTrust,
  verifyOpportunityIntegrity,
} from '../src/lib/verification/engine.ts';
import type {
  VerificationInput,
} from '../src/lib/verification/engine.ts';

test('Verification Engine: isSafePublicUrl defends against SSRF and private ranges', () => {
  // Safe public targets
  assert.strictEqual(isSafePublicUrl('https://www.chevening.org/apply').safe, true);
  assert.strictEqual(isSafePublicUrl('https://careers.google.com/students/').safe, true);
  assert.strictEqual(isSafePublicUrl('https://www.daad.de/epos').safe, true);

  // SSRF - loopback
  assert.strictEqual(isSafePublicUrl('http://localhost:3000/api/admin').safe, false);
  assert.strictEqual(isSafePublicUrl('http://127.0.0.1:8080').safe, false);
  assert.strictEqual(isSafePublicUrl('http://[::1]:3000').safe, false);

  // SSRF - Cloud metadata
  assert.strictEqual(isSafePublicUrl('http://169.254.169.254/latest/meta-data').safe, false);
  assert.strictEqual(isSafePublicUrl('http://metadata.google.internal').safe, false);

  // SSRF - Private network ranges
  assert.strictEqual(isSafePublicUrl('http://10.0.0.1/internal').safe, false);
  assert.strictEqual(isSafePublicUrl('http://172.16.0.5:5432').safe, false);
  assert.strictEqual(isSafePublicUrl('http://192.168.1.1/router').safe, false);

  // Dangerous protocols
  assert.strictEqual(isSafePublicUrl('file:///etc/passwd').safe, false);
  assert.strictEqual(isSafePublicUrl('javascript:alert(1)').safe, false);
});

test('Verification Engine: evaluateDomainTrust accurately identifies trust tiers', () => {
  // Tier 1 Government, Universities, and Verified International Orgs
  assert.strictEqual(evaluateDomainTrust('chevening.org').tier, 1);
  assert.strictEqual(evaluateDomainTrust('ox.ac.uk').tier, 1);
  assert.strictEqual(evaluateDomainTrust('harvard.edu').tier, 1);
  assert.strictEqual(evaluateDomainTrust('dfat.gov.au').tier, 1);
  assert.strictEqual(evaluateDomainTrust('who.int').tier, 1);
  assert.strictEqual(evaluateDomainTrust('cern.ch').tier, 1);

  // Tier 3 Untrusted / Suspicious publishing patterns
  assert.strictEqual(evaluateDomainTrust('free-scholarships.blogspot.com').isUntrusted, true);
  assert.strictEqual(evaluateDomainTrust('apply-now.wixsite.com').isUntrusted, true);
  assert.strictEqual(evaluateDomainTrust('scam.tinyurl.com').isUntrusted, true);
});

test('Verification Engine: verifyOpportunityIntegrity detects fraud signatures and expired deadlines', async () => {
  // 1. Legitimate Tier 1 scholarship
  const authenticOpp: VerificationInput = {
    title: 'Chevening UK Government Scholarship',
    sponsor: 'UK Foreign Office',
    applyUrl: 'https://www.chevening.org/scholarship/uk/',
    sourceDomain: 'chevening.org',
    deadline: new Date('2027-11-03T23:59:59.000Z'),
    description: 'Fully funded UK government scholarship for international postgraduate students.',
  };

  const evidence1 = await verifyOpportunityIntegrity(authenticOpp, { probeNetwork: false });
  assert.strictEqual(evidence1.outcome, 'verified');
  assert.strictEqual(evidence1.trustTier, 1);
  assert.strictEqual(evidence1.riskScore, 0);

  // 2. Scam signature: payment fee requested via western union
  const scamOpp: VerificationInput = {
    title: 'Guaranteed Full Scholarship Award',
    sponsor: 'Quick Grants Group',
    applyUrl: 'https://mysite.blogspot.com/apply',
    sourceDomain: 'blogspot.com',
    deadline: new Date('2026-12-31T23:59:59.000Z'),
    description: 'Pay application processing fee of $150 via Western Union to guarantee acceptance.',
  };

  const evidence2 = await verifyOpportunityIntegrity(scamOpp, { probeNetwork: false });
  assert.strictEqual(evidence2.outcome, 'flagged');
  assert.ok(evidence2.riskScore >= 45);
  assert.ok(evidence2.flags.includes('suspicious_domain'));
  assert.ok(evidence2.flags.includes('financial_exploitation_risk'));

  // 3. Expired opportunity
  const expiredOpp: VerificationInput = {
    title: 'Historic Research Award',
    sponsor: 'Academic Council',
    applyUrl: 'https://www.ox.ac.uk/award',
    sourceDomain: 'ox.ac.uk',
    deadline: new Date('2020-01-01T00:00:00.000Z'), // Past date
  };

  const evidence3 = await verifyOpportunityIntegrity(expiredOpp, { probeNetwork: false });
  assert.strictEqual(evidence3.outcome, 'expired');
});
