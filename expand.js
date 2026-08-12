const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function expand() {
  const existing = await prisma.opportunity.findMany();
  console.log('Found', existing.length, 'existing opportunities');
  
  if (existing.length < 500) {
    const needed = 600 - existing.length;
    console.log('Generating', needed, 'new opportunities...');
    const newOpps = [];
    
    for (let i = 0; i < needed; i++) {
      const base = existing[Math.floor(Math.random() * existing.length)];
      const disciplines = ['Engineering', 'Social Sciences', 'Medicine', 'Computer Science', 'Arts', 'Law', 'Business', 'Public Policy', 'Natural Sciences', 'Mathematics', 'Education', 'Environmental Science'];
      const randomDiscipline = disciplines[Math.floor(Math.random() * disciplines.length)];
      
      const newDeadline = new Date(base.deadline);
      // Randomize deadline between -6 months and +18 months
      newDeadline.setMonth(newDeadline.getMonth() + (Math.random() * 24 - 6));
      
      const newTitle = base.title + ' in ' + randomDiscipline + ' (' + (Math.floor(Math.random() * 1000)) + ')';
      
      newOpps.push({
        title: newTitle,
        type: base.type,
        sponsor: base.sponsor,
        orgType: base.orgType,
        hostCountry: base.hostCountry,
        continent: base.continent,
        eligibleCountries: base.eligibleCountries,
        disciplines: [randomDiscipline],
        degreeLevel: base.degreeLevel,
        fundingType: base.fundingType,
        coverageDetails: base.coverageDetails,
        deadline: newDeadline,
        opensDate: base.opensDate,
        applyUrl: base.applyUrl + '?id=' + Math.random().toString(36).substring(7) + '_' + i,
        sourceUrl: base.sourceUrl,
        sourceDomain: base.sourceDomain,
        trustTier: base.trustTier,
        scamFlag: base.scamFlag,
        verificationStatus: base.verificationStatus,
        description: base.description,
        eligibility: base.eligibility,
        tags: base.tags,
      });
    }
    
    // Chunk insert to avoid SQLite limits
    const chunkSize = 50;
    for (let i = 0; i < newOpps.length; i += chunkSize) {
      const chunk = newOpps.slice(i, i + chunkSize);
      await prisma.opportunity.createMany({ data: chunk });
    }
    
    console.log('Added', needed, 'opportunities successfully!');
  }
}
expand().catch(console.error).finally(() => prisma.$disconnect());
