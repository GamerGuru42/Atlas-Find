import { PrismaClient } from '@prisma/client';

/**
 * AtlasFind - Database Baseline Compatibility Verification Script
 *
 * Checks target database schema compatibility before marking migrations as applied.
 * Never blindly assumes compatibility.
 */
async function verifyDatabaseCompatibility() {
  console.log('====================================================');
  console.log('🔍 AtlasFind — Database Baseline Compatibility Pre-Flight');
  console.log('====================================================');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.trim().length === 0) {
    console.log('⚠️  DATABASE_URL environment variable is not configured.');
    console.log('🔒 Production Safety Guidance:');
    console.log('   - Configure DATABASE_URL (and DIRECT_URL) before deploying to production.');
    console.log('   - For a fresh/empty database: run "npx prisma migrate deploy"');
    console.log('   - For an existing production database: run this verification script first');
    console.log('     to inspect existing columns before executing "npx prisma migrate resolve --applied 0_init".');
    return;
  }

  const prisma = new PrismaClient();

  try {
    console.log('📡 Connecting to target database...');
    // Query existing public tables
    const tables: Array<{ table_name: string }> = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;

    const tableNames = new Set(tables.map(t => t.table_name));
    console.log(`📊 Found ${tableNames.size} existing tables in target database:`, Array.from(tableNames));

    // Audit row counts for existing tables
    console.log('\n📈 Auditing existing record counts:');
    if (tableNames.has('opportunities')) {
      const oppCount = await prisma.opportunity.count();
      console.log(`   - opportunities: ${oppCount} records`);
    }
    if (tableNames.has('User')) {
      const userCount = await prisma.user.count();
      console.log(`   - User: ${userCount} accounts`);
    }
    if (tableNames.has('SavedOpportunity')) {
      const savedCount = await prisma.savedOpportunity.count();
      console.log(`   - SavedOpportunity: ${savedCount} tracked items`);
    }
    if (tableNames.has('Subscription')) {
      const subCount = await prisma.subscription.count();
      console.log(`   - Subscription: ${subCount} subscriptions`);
    }

    const requiredTables = [
      'User',
      'opportunities',
      'intakes',
      'SavedOpportunity',
      'OpportunityActivity',
      'ConversationLog',
      'VerificationLog',
      'Subscription',
      'UsageLimit',
      'opportunity_drafts',
      'feedbacks',
    ];

    const missingTables = requiredTables.filter(t => !tableNames.has(t));

    // Check if migration table exists
    const hasMigrationTable = tableNames.has('_prisma_migrations');

    if (tableNames.size === 0 || (!hasMigrationTable && missingTables.length === requiredTables.length)) {
      console.log('\n✨ TARGET DATABASE STATUS: FRESH / EMPTY DATABASE');
      console.log('   - Recommended Action: Run "npx prisma migrate deploy" to apply baseline 0_init cleanly.');
      return;
    }

    if (missingTables.length > 0) {
      console.warn('\n⚠️  TARGET DATABASE HAS PARTIAL SCHEMA:');
      console.warn(`   - Missing required tables: ${missingTables.join(', ')}`);
      console.warn('   - DO NOT run "prisma migrate resolve --applied 0_init" as this will conceal missing tables.');
      console.warn('   - Recommended Action: Run "npx prisma migrate deploy" to create the missing tables safely.');
      return;
    }

    // Inspect critical columns in 'opportunities'
    const oppColumns: Array<{ column_name: string; data_type: string }> = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'opportunities'
    `;

    const colNames = new Set(oppColumns.map(c => c.column_name));
    const requiredOppCols = ['id', 'title', 'deadline', 'apply_url', 'trust_tier', 'verification_status', 'scam_flag'];
    const missingOppCols = requiredOppCols.filter(c => !colNames.has(c));

    if (missingOppCols.length > 0) {
      console.error('\n❌ SCHEMA INCOMPATIBILITY DETECTED:');
      console.error(`   - "opportunities" table is missing expected columns: ${missingOppCols.join(', ')}`);
      console.error('   - Resolving 0_init will result in schema drift. Halt migration deployment until resolved.');
      process.exit(1);
    }

    console.log('\n✅ TARGET DATABASE IS COMPATIBLE WITH 0_init BASELINE:');
    console.log('   - All 11 core tables and critical column signatures are present.');
    if (!hasMigrationTable) {
      console.log('   - Next Step: Safe to execute "npx prisma migrate resolve --applied 0_init" to baseline.');
    } else {
      console.log('   - _prisma_migrations table already present; standard "npx prisma migrate deploy" is active.');
    }
  } catch (err: any) {
    console.error('❌ Database connectivity / inspection error:', err?.message || err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseCompatibility().catch(err => {
  console.error('Pre-flight script error:', err);
  process.exit(1);
});
