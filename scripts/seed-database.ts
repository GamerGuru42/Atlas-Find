import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface RawSeedOpportunity {
  title: string;
  type: string;
  sponsor: string;
  orgType: string;
  hostCountry: string;
  continent?: string;
  eligibleCountries: string[];
  disciplines: string[];
  degreeLevel: string[];
  fundingType: string;
  coverageDetails: Record<string, unknown>;
  deadline: string;
  opensDate?: string;
  applyUrl: string;
  sourceUrl: string;
  sourceDomain: string;
  trustTier: number;
  scamFlag: boolean;
  verificationStatus: string;
  description: string;
  eligibility: string;
  tags: string[];
}

async function main() {
  console.log('🌱 Starting AtlasFind Database Seeding...');
  
  // Read opportunities from server-side JSON file
  const jsonPath = path.join(__dirname, 'seed-opportunities.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Seed JSON file not found at: ${jsonPath}`);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf8');
  const opportunities: RawSeedOpportunity[] = JSON.parse(fileData);

  console.log(`📦 Loaded ${opportunities.length} manually verified opportunities from seed-opportunities.json`);

  let created = 0;
  let updated = 0;

  for (const opp of opportunities) {
    try {
      const deadlineDate = new Date(opp.deadline);
      const opensDateVal = opp.opensDate ? new Date(opp.opensDate) : null;

      const dataToSave = {
        title: opp.title,
        type: opp.type,
        sponsor: opp.sponsor,
        orgType: opp.orgType,
        hostCountry: opp.hostCountry,
        continent: opp.continent || null,
        eligibleCountries: opp.eligibleCountries,
        disciplines: opp.disciplines,
        degreeLevel: opp.degreeLevel,
        fundingType: opp.fundingType,
        coverageDetails: opp.coverageDetails as any,
        deadline: deadlineDate,
        opensDate: opensDateVal,
        applyUrl: opp.applyUrl,
        sourceUrl: opp.sourceUrl,
        sourceDomain: opp.sourceDomain,
        trustTier: opp.trustTier,
        scamFlag: opp.scamFlag,
        verificationStatus: 'verified',
        description: opp.description,
        eligibility: opp.eligibility,
        tags: opp.tags,
      };

      const result = await prisma.opportunity.upsert({
        where: { applyUrl: opp.applyUrl },
        update: dataToSave,
        create: dataToSave,
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }
    } catch (err) {
      console.error(`❌ Error upserting "${opp.title}":`, err);
    }
  }

  console.log(`✅ Seeding Complete! ${created} created, ${updated} updated (${opportunities.length} total entries).`);
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
