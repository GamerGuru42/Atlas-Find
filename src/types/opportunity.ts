export interface Opportunity {
  id: string;
  title: string;
  type: 'scholarship' | 'internship' | 'fellowship' | 'grant';
  sponsor: string;
  orgType: 'university' | 'government' | 'ngo' | 'corporate' | 'international';
  hostCountry: string;
  continent?: string;
  eligibleCountries: string[]; // empty = open to all
  disciplines: string[];
  degreeLevel: ('bachelors' | 'masters' | 'phd' | 'postdoc')[];
  fundingType: 'fully_funded' | 'partial' | 'stipend_only';
  coverage: {
    tuition: boolean;
    travel: boolean;
    living: boolean;
    insurance: boolean;
    accommodation: boolean;
    visa: boolean;
    stipendAmount?: string; // e.g. "€934/month"
  };
  deadline: string; // ISO date
  opensDate?: string;
  applyUrl: string;
  sourceUrl: string;
  sourceDomain: string;
  trustTier: 1 | 2 | 3;
  verificationStatus: 'verified' | 'unverified' | 'flagged' | 'dead';
  lastVerifiedAt: string; // ISO date
  communityReports: number;
  description: string;
  eligibility: string;
  tags: string[];
}

export interface MatchResult {
  opportunity: Opportunity;
  score: number; // 0-100
  tier: 'top_pick' | 'stretch_goal' | 'safety_option';
  reasons: {
    whyYouMatch: string[];
    whyYouDont: string[];
    howToImprove: string[];
  };
}
