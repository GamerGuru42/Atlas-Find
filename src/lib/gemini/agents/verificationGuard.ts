import { Opportunity } from '@/types/opportunity';

/** Trusted domains by tier */
const TIER1_DOMAINS = [
  '.edu', '.ac.uk', '.gov', '.gov.uk', '.go.jp', '.europa.eu', '.gc.ca',
  'daad.de', 'chevening.org', 'commonwealthfund.org', 'cscuk.fcdo.gov.uk',
  'fulbrightonline.org', 'mastercardfdn.org', 'worldbank.org', 'un.org',
  'gatescambridge.org', 'rhodeshouse.ox.ac.uk', 'ox.ac.uk', 'ethz.ch',
  'si.se', 'mext.go.jp', 'turkiyeburslari.gov.tr', 'stipendiumhungaricum.hu',
  'campusfrance.org', 'hea.ie', 'ptdf.gov.ng', 'nnpcgroup.com', 'education.gov.ng',
  'dangotegroup.com', 'tonyelumelufoundation.org', 'akdn.org',
  'nzscholarships.govt.nz', 'dfat.gov.au', 'campuschina.org', 'studyinkorea.go.kr',
  'vliruos.be', 'nuffic.nl', 'iaeste.org', 'research.google', 'microsoft.com',
  'amazonfutureengineer.com', 'tudelft.nl', 'ubc.ca', 'kaust.edu.sa',
];

const UNTRUSTED_DOMAINS = [
  '.blogspot.', 'wordpress.com', 'wix.com', 'weebly.com',
  'sites.google.com', 'medium.com',
];

type ScamFlag =
  | 'payment_required'
  | 'gmail_contact'
  | 'vague_eligibility'
  | 'no_deadline'
  | 'suspicious_domain'
  | 'too_good_to_be_true'
  | 'no_official_org';

export interface VerificationResult {
  status: 'verified' | 'unverified' | 'flagged';
  trustTier: 1 | 2 | 3;
  scamFlags: ScamFlag[];
  riskScore: number;
  details: string;
}

/**
 * Agent 4: Verification Guard
 * Checks domain trust, scam patterns, and assigns risk scores.
 * HTTP link checking is stubbed for MVP (would be a server-side cron job).
 */
export function verifyOpportunity(opp: Opportunity): VerificationResult {
  const flags: ScamFlag[] = [];
  let riskScore = 0;

  // Domain whitelist check
  const domain = opp.sourceDomain.toLowerCase();
  const isTier1 = TIER1_DOMAINS.some(d => domain.includes(d));
  const isUntrusted = UNTRUSTED_DOMAINS.some(d => domain.includes(d));

  if (isUntrusted) {
    flags.push('suspicious_domain');
    riskScore += 30;
  }

  // Scam pattern detection
  const text = `${opp.title} ${opp.description} ${opp.eligibility}`.toLowerCase();

  if (text.includes('pay') && text.includes('fee') && text.includes('apply')) {
    flags.push('payment_required');
    riskScore += 40;
  }

  if (opp.applyUrl.includes('gmail.com') || text.includes('gmail.com') || text.includes('yahoo.com')) {
    flags.push('gmail_contact');
    riskScore += 25;
  }

  if (!opp.eligibility || opp.eligibility.length < 20) {
    flags.push('vague_eligibility');
    riskScore += 15;
  }

  if (!opp.deadline || opp.deadline === '') {
    flags.push('no_deadline');
    riskScore += 10;
  }

  if (!opp.sponsor || opp.sponsor.length < 3) {
    flags.push('no_official_org');
    riskScore += 20;
  }

  // Determine status
  let status: 'verified' | 'unverified' | 'flagged';
  let trustTier: 1 | 2 | 3;

  if (riskScore >= 40) {
    status = 'flagged';
    trustTier = 3;
  } else if (isTier1 && riskScore < 10) {
    status = 'verified';
    trustTier = 1;
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
      ? `Verified against ${opp.sourceDomain} — no issues found.`
      : `${flags.length} potential issue(s) detected: ${flags.join(', ')}.`,
  };
}
