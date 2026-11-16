/**
 * AtlasFind - Production Opportunity Verification Engine
 *
 * Implements genuine verification checks, URL SSRF safeguards,
 * domain trust evaluation, live HTTP reachability probing,
 * and auditable verification logging.
 */

import { URL } from 'url';

export type VerificationOutcome =
  | 'verified'
  | 'unverified'
  | 'flagged'
  | 'expired'
  | 'requires_review';

export interface VerificationEvidence {
  checkedAt: string;
  method: 'automated_live_probe' | 'admin_manual_review' | 'source_audit';
  outcome: VerificationOutcome;
  previousStatus?: string;
  sourceUrl: string;
  applyUrl: string;
  resolvedSourceDomain: string;
  trustTier: 1 | 2 | 3;
  httpStatus?: number;
  isAccessible: boolean;
  responseTimeMs?: number;
  riskScore: number;
  flags: string[];
  reasons: string[];
  reviewer?: string;
}

export interface VerificationInput {
  id?: string;
  title: string;
  sponsor: string;
  applyUrl: string;
  sourceUrl?: string;
  sourceDomain?: string;
  deadline?: string | Date | null;
  description?: string;
  eligibility?: string;
  verificationStatus?: string;
}

// Trusted domains categorized by authority tier
export const TRUSTED_TIER1_SUFFIXES = [
  '.edu',
  '.ac.uk',
  '.edu.ng',
  '.edu.au',
  '.ac.za',
  '.gov',
  '.gov.uk',
  '.gov.ng',
  '.govt.nz',
  '.go.jp',
  '.europa.eu',
  '.gc.ca',
  '.admin.ch',
];

export const TRUSTED_TIER1_HOSTS = new Set([
  'chevening.org',
  'daad.de',
  'fulbrightonline.org',
  'gatescambridge.org',
  'rhodeshouse.ox.ac.uk',
  'mastercardfdn.org',
  'worldbank.org',
  'un.org',
  'who.int',
  'cern.ch',
  'esa.int',
  'ox.ac.uk',
  'cam.ac.uk',
  'harvard.edu',
  'mit.edu',
  'stanford.edu',
  'ethz.ch',
  'turkiyeburslari.gov.tr',
  'stipendiumhungaricum.hu',
  'campusfrance.org',
  'studyinjapan.go.jp',
  'a-star.edu.sg',
  'dfat.gov.au',
  'research.google',
  'careers.google.com',
  'microsoft.com',
  'amazon.jobs',
]);

export const UNTRUSTED_DOMAINS = [
  'blogspot.com',
  'wordpress.com',
  'wixsite.com',
  'weebly.com',
  'sites.google.com',
  'bit.ly',
  'tinyurl.com',
  'cutt.ly',
  't.co',
];

/**
 * SSRF Prevention: Checks if a host points to a private, loopback, or cloud metadata IP
 */
export function isSafePublicUrl(urlString: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Invalid protocol. Only HTTP and HTTPS are permitted.' };
    }

    const rawHostname = parsed.hostname.toLowerCase();
    const hostname = rawHostname.replace(/^\[|\]$/g, '');

    // Loopback check
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0:0:0:0:0:0:0:1' ||
      rawHostname.endsWith('.localhost')
    ) {
      return { safe: false, reason: 'Loopback network targets are forbidden.' };
    }

    // Cloud metadata check
    if (
      hostname === '169.254.169.254' ||
      hostname === 'metadata.google.internal' ||
      hostname.startsWith('fe80:')
    ) {
      return { safe: false, reason: 'Cloud metadata and link-local targets are strictly forbidden.' };
    }

    // Private IPv4 ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const b1 = parseInt(ipMatch[1]);
      const b2 = parseInt(ipMatch[2]);
      if (
        b1 === 10 || // 10.0.0.0/8
        (b1 === 172 && b2 >= 16 && b2 <= 31) || // 172.16.0.0/12
        (b1 === 192 && b2 === 168) || // 192.168.0.0/16
        (b1 === 127) || // 127.0.0.0/8
        (b1 === 0) ||
        (b1 >= 224) // Multicast
      ) {
        return { safe: false, reason: 'Private IP addresses are forbidden.' };
      }
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, reason: 'Malformed URL.' };
  }
}

/**
 * Evaluates domain trustworthiness tier
 */
export function evaluateDomainTrust(hostname: string): { tier: 1 | 2 | 3; isUntrusted: boolean } {
  const host = hostname.toLowerCase();

  for (const untrusted of UNTRUSTED_DOMAINS) {
    if (host.includes(untrusted)) {
      return { tier: 3, isUntrusted: true };
    }
  }

  if (TRUSTED_TIER1_HOSTS.has(host)) {
    return { tier: 1, isUntrusted: false };
  }

  for (const suffix of TRUSTED_TIER1_SUFFIXES) {
    if (host.endsWith(suffix)) {
      return { tier: 1, isUntrusted: false };
    }
  }

  return { tier: 2, isUntrusted: false };
}

/**
 * Performs live verification of an opportunity
 */
export async function verifyOpportunityIntegrity(
  opp: VerificationInput,
  options: { probeNetwork?: boolean; timeoutMs?: number; reviewer?: string } = {}
): Promise<VerificationEvidence> {
  const flags: string[] = [];
  const reasons: string[] = [];
  let riskScore = 0;

  const probeNetwork = options.probeNetwork ?? false;
  const timeoutMs = options.timeoutMs ?? 7000;

  // 1. URL Safety and Domain Evaluation
  const applySafety = isSafePublicUrl(opp.applyUrl);
  if (!applySafety.safe) {
    flags.push('unsafe_apply_url');
    reasons.push(applySafety.reason || 'Unsafe application URL');
    riskScore += 60;
  }

  let sourceDomain = opp.sourceDomain || '';
  if (!sourceDomain && opp.applyUrl) {
    try {
      sourceDomain = new URL(opp.applyUrl).hostname;
    } catch {
      sourceDomain = 'unknown';
    }
  }

  const domainTrust = evaluateDomainTrust(sourceDomain);
  if (domainTrust.isUntrusted) {
    flags.push('suspicious_domain');
    reasons.push(`Domain (${sourceDomain}) matches untrusted or high-risk publishing pattern.`);
    riskScore += 40;
  }

  // 2. Sponsor and Content Authenticity Check
  if (!opp.sponsor || opp.sponsor.trim().length < 3) {
    flags.push('missing_sponsor');
    reasons.push('Opportunity lacks an identifiable official sponsoring institution.');
    riskScore += 30;
  }

  const textContent = `${opp.title} ${opp.description || ''} ${opp.eligibility || ''}`.toLowerCase();
  
  // Detection of common scam keywords (e.g. application processing fee requests, western union, crypto)
  if (
    (textContent.includes('western union') || textContent.includes('moneygram') || textContent.includes('gift card')) ||
    (textContent.includes('processing fee') && (textContent.includes('pay') || textContent.includes('guarantee') || opp.applyUrl.includes('form') || opp.applyUrl.includes('drive'))) ||
    (textContent.includes('guarantee') && textContent.includes('fee')) ||
    (textContent.includes('pay') && textContent.includes('crypto'))
  ) {
    flags.push('financial_exploitation_risk');
    reasons.push('Suspicious payment requirement or pay-for-acceptance pattern detected.');
    riskScore += 50;
  }

  if (opp.applyUrl.includes('mailto:') || opp.applyUrl.includes('@gmail.com') || opp.applyUrl.includes('@yahoo.com')) {
    flags.push('generic_email_application');
    reasons.push('Uses generic public email instead of official organizational portal.');
    riskScore += 25;
  }

  // 3. Deadline Checks
  let isExpired = false;
  if (opp.deadline) {
    const deadlineDate = new Date(opp.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      if (deadlineDate < new Date()) {
        isExpired = true;
        reasons.push(`Application deadline (${deadlineDate.toISOString().split('T')[0]}) has passed.`);
      }
    }
  }

  // 4. Live Reachability Probe (opt-in / scheduled)
  let httpStatus: number | undefined;
  let isAccessible = true;
  let responseTimeMs: number | undefined;

  if (probeNetwork && applySafety.safe) {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(opp.applyUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'AtlasFind-Verification-Bot/1.0 (+https://atlasfind.org/transparency)',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timer);
      responseTimeMs = Date.now() - startTime;
      httpStatus = res.status;

      if (res.status >= 400 && res.status !== 403) {
        // Some government/university sites return 403 to automated HEAD requests (Cloudflare / WAF)
        // If 404 or 5xx, link is likely broken
        if (res.status === 404) {
          flags.push('broken_apply_url');
          reasons.push(`Application link returned HTTP 404 Not Found.`);
          riskScore += 45;
          isAccessible = false;
        } else if (res.status >= 500) {
          flags.push('server_error');
          reasons.push(`Sponsor server returned HTTP ${res.status}.`);
          riskScore += 20;
        }
      }
    } catch (err: any) {
      responseTimeMs = Date.now() - startTime;
      isAccessible = false;
      if (err.name === 'AbortError') {
        flags.push('connection_timeout');
        reasons.push(`Source verification timed out after ${timeoutMs}ms.`);
      } else {
        flags.push('network_error');
        reasons.push(`Could not establish connection to ${sourceDomain}.`);
      }
      riskScore += 15;
    }
  }

  // 5. Final Outcome Determination
  let outcome: VerificationOutcome;
  if (riskScore >= 45 || flags.includes('unsafe_apply_url') || flags.includes('financial_exploitation_risk')) {
    outcome = 'flagged';
  } else if (isExpired) {
    outcome = 'expired';
  } else if (domainTrust.tier === 1 && riskScore === 0) {
    outcome = 'verified';
  } else if (riskScore < 25) {
    outcome = 'verified';
  } else {
    outcome = 'requires_review';
  }

  const evidence: VerificationEvidence = {
    checkedAt: new Date().toISOString(),
    method: options.reviewer ? 'admin_manual_review' : 'automated_live_probe',
    outcome,
    previousStatus: opp.verificationStatus,
    sourceUrl: opp.sourceUrl || opp.applyUrl,
    applyUrl: opp.applyUrl,
    resolvedSourceDomain: sourceDomain,
    trustTier: domainTrust.tier,
    httpStatus,
    isAccessible,
    responseTimeMs,
    riskScore,
    flags,
    reasons,
    reviewer: options.reviewer,
  };

  return evidence;
}

