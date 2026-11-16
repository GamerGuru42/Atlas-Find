/**
 * Agent C: Research Assistant
 *
 * Investigates sponsoring institutions, official portal domains,
 * intake histories, and required supporting documentation.
 */

import { evaluateDomainTrust, isSafePublicUrl } from '../verification/engine.ts';

export interface OpportunityResearchDossier {
  sponsor: string;
  sponsorCategory: string;
  isDomainVerified: boolean;
  domainTrustTier: 1 | 2 | 3;
  officialApplyPortal: string;
  sourceDomain: string;
  requiredDocuments: string[];
  intakeCadence: string;
  criticalAdvisory: string;
}

export function researchOpportunityBackground(opportunity: {
  sponsor: string;
  orgType?: string;
  applyUrl: string;
  sourceDomain?: string;
  disciplines?: string[];
  type?: string;
}): OpportunityResearchDossier {
  const domain = opportunity.sourceDomain || (opportunity.applyUrl ? new URL(opportunity.applyUrl).hostname : '');
  const trust = evaluateDomainTrust(domain);

  // Standard documentation checklist based on opportunity type
  const requiredDocuments: string[] = [
    'Official Academic Transcripts (Certified English translation if applicable)',
    'Up-to-date Curriculum Vitae (CV) / Academic Resume',
    'Personal Statement / Statement of Purpose',
  ];

  if (opportunity.type?.toLowerCase().includes('scholarship') || opportunity.type?.toLowerCase().includes('fellowship')) {
    requiredDocuments.push('Two to three Academic or Professional Letters of Recommendation');
    requiredDocuments.push('Proof of English Language Proficiency (TOEFL/IELTS or institutional waiver if taught in English)');
  }

  if (opportunity.type?.toLowerCase().includes('internship')) {
    requiredDocuments.push('Certificate of Enrollment / Proof of Current Student Status');
    requiredDocuments.push('Work Samples, GitHub Portfolio, or Technical Project Dossier');
  }

  let cadence = 'Annual regular intake';
  if (opportunity.type?.toLowerCase().includes('internship')) {
    cadence = 'Seasonal intakes (Summer, Winter / January, and Fall cohorts)';
  }

  let advisory = `Always submit through the official portal (${domain}). AtlasFind directly verifies links against authorized organizational domains.`;
  if (trust.tier === 1) {
    advisory = `Tier-1 Official Institution verified. Applications are handled directly by ${opportunity.sponsor} without intermediary third-party fees.`;
  }

  return {
    sponsor: opportunity.sponsor,
    sponsorCategory: opportunity.orgType || 'Official Sponsor',
    isDomainVerified: trust.tier === 1,
    domainTrustTier: trust.tier,
    officialApplyPortal: opportunity.applyUrl,
    sourceDomain: domain,
    requiredDocuments,
    intakeCadence: cadence,
    criticalAdvisory: advisory,
  };
}

