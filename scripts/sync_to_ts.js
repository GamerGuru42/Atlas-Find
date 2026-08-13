const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'seed-opportunities.json');
const tsPath = path.join(__dirname, '../src/data/seed/opportunities.ts');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const opps = JSON.parse(rawData);

const mapType = (t) => {
  const norm = (t || '').toLowerCase();
  if (norm === 'exchange') return 'fellowship';
  if (['scholarship', 'internship', 'fellowship', 'grant'].includes(norm)) return norm;
  return 'scholarship';
};

const mapOrgType = (o) => {
  const norm = (o || '').toLowerCase();
  if (norm === 'foundation') return 'ngo';
  if (norm === 'international_org') return 'international';
  if (['university', 'government', 'ngo', 'corporate', 'international'].includes(norm)) return norm;
  return 'international';
};

const mapDegreeLevels = (levels) => {
  if (!Array.isArray(levels)) return ['masters'];
  const mapped = levels.map((l) => {
    const norm = (l || '').toLowerCase();
    if (norm.startsWith('bachelor')) return 'bachelors';
    if (norm.startsWith('master')) return 'masters';
    if (norm.startsWith('phd')) return 'phd';
    if (norm.startsWith('postdoc')) return 'postdoc';
    return null;
  }).filter(Boolean);

  return mapped.length > 0 ? mapped : ['masters'];
};

const mapFundingType = (f) => {
  const norm = (f || '').toLowerCase();
  if (norm === 'partially_funded' || norm === 'partial') return 'partial';
  if (norm === 'stipend_only') return 'stipend_only';
  return 'fully_funded';
};

const tsItems = opps.map((opp, idx) => {
  const id = `opp-${idx + 1}-${opp.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}`;
  return {
    id,
    title: opp.title,
    type: mapType(opp.type),
    sponsor: opp.sponsor,
    orgType: mapOrgType(opp.orgType),
    hostCountry: opp.hostCountry,
    continent: opp.continent || 'Global',
    eligibleCountries: opp.eligibleCountries || [],
    disciplines: opp.disciplines || [],
    degreeLevel: mapDegreeLevels(opp.degreeLevel),
    fundingType: mapFundingType(opp.fundingType),
    coverage: {
      tuition: true,
      travel: true,
      living: true,
      insurance: true,
      accommodation: false,
      visa: false,
      stipendAmount: opp.coverageDetails?.stipend || 'Full Stipend',
    },
    deadline: opp.deadline ? opp.deadline.split('T')[0] : '2026-12-31',
    applyUrl: opp.applyUrl,
    sourceUrl: opp.sourceUrl,
    sourceDomain: opp.sourceDomain,
    trustTier: opp.trustTier || 1,
    verificationStatus: 'verified',
    lastVerifiedAt: new Date().toISOString(),
    communityReports: 0,
    description: opp.description,
    eligibility: opp.eligibility,
    tags: opp.tags || [],
  };
});

const tsFileContent = `import { Opportunity } from '@/types/opportunity';

const now = new Date().toISOString();

export const seedOpportunities: Opportunity[] = ${JSON.stringify(tsItems, null, 2)};
`;

fs.writeFileSync(tsPath, tsFileContent);
console.log(`✅ Synced ${tsItems.length} opportunities safely to src/data/seed/opportunities.ts!`);
