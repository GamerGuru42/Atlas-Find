import { Opportunity } from '@/types/opportunity';
import {
  verifyOpportunityIntegrity,
  VerificationOutcome,
  evaluateDomainTrust
} from '@/lib/verification/engine';

export interface VerificationResult {
  status: 'verified' | 'unverified' | 'flagged';
  trustTier: 1 | 2 | 3;
  scamFlags: string[];
  riskScore: number;
  details: string;
}

/**
 * Agent 4: Verification Guard (Powered by Atlas Verification Engine)
 */
export function verifyOpportunity(opp: Opportunity): VerificationResult {
  const domain = opp.sourceDomain || '';
  const domainTrust = evaluateDomainTrust(domain);

  const syncCheck = {
    title: opp.title,
    sponsor: opp.sponsor,
    applyUrl: opp.applyUrl,
    sourceUrl: opp.sourceUrl,
    sourceDomain: opp.sourceDomain,
    deadline: opp.deadline,
    description: opp.description,
    eligibility: opp.eligibility,
    verificationStatus: opp.verificationStatus,
  };

  const text = `${opp.title} ${opp.description} ${opp.eligibility}`.toLowerCase();
  const flags: string[] = [];
  let riskScore = 0;

  if (domainTrust.isUntrusted) {
    flags.push('suspicious_domain');
    riskScore += 35;
  }

  if (text.includes('application fee') && (text.includes('western union') || text.includes('crypto'))) {
    flags.push('payment_required');
    riskScore += 45;
  }

  if (opp.applyUrl.includes('@gmail.com') || text.includes('send cv to gmail')) {
    flags.push('gmail_contact');
    riskScore += 25;
  }

  if (!opp.eligibility || opp.eligibility.length < 15) {
    flags.push('vague_eligibility');
    riskScore += 10;
  }

  if (!opp.deadline) {
    flags.push('no_deadline');
    riskScore += 10;
  }

  if (!opp.sponsor || opp.sponsor.length < 3) {
    flags.push('no_official_org');
    riskScore += 20;
  }

  let status: 'verified' | 'unverified' | 'flagged';
  let trustTier: 1 | 2 | 3 = domainTrust.tier;

  if (riskScore >= 40) {
    status = 'flagged';
    trustTier = 3;
  } else if (domainTrust.tier === 1 && riskScore < 15) {
    status = 'verified';
  } else {
    status = 'unverified';
    trustTier = 2;
  }

  return {
    status,
    trustTier,
    scamFlags: flags,
    riskScore,
    details: flags.length === 0
      ? `Verified against ${opp.sourceDomain} (Tier ${trustTier}) — no compliance risks detected.`
      : `${flags.length} potential issue(s) flagged: ${flags.join(', ')}.`,
  };
}
