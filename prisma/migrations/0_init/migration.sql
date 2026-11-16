-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "googleId" TEXT,
    "whatsappNumber" TEXT,
    "profileJson" JSONB,
    "goalStage" TEXT NOT NULL DEFAULT 'goal_identified',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryCode" TEXT,
    "detectedCountry" TEXT,
    "detectedRegion" TEXT,
    "detectedCity" TEXT,
    "lastLoginIp" TEXT,
    "currency" TEXT,
    "fieldOfStudy" TEXT,
    "level" TEXT,
    "institution" TEXT,
    "graduationYear" INTEGER,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "stripeCustomerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SCHOLARSHIP',
    "sponsor" TEXT NOT NULL,
    "org_type" TEXT NOT NULL DEFAULT 'government',
    "host_country" TEXT NOT NULL,
    "continent" TEXT,
    "eligible_countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "disciplines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "degree_level" TEXT[],
    "funding_type" TEXT NOT NULL,
    "coverage_details" JSONB NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "opens_date" TIMESTAMP(3),
    "apply_url" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "source_domain" TEXT NOT NULL,
    "trust_tier" INTEGER NOT NULL DEFAULT 3,
    "scam_flag" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" TEXT NOT NULL DEFAULT 'unverified',
    "description" TEXT NOT NULL DEFAULT '',
    "eligibility" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "submitted_by" TEXT,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "intakes" (
    "id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "intake_name" TEXT NOT NULL,
    "opens_date" TIMESTAMP(3),
    "deadline_date" TIMESTAMP(3),
    "notification_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "is_rolling" BOOLEAN NOT NULL DEFAULT false,
    "is_predicted" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "SavedOpportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'saved',
    "notes" TEXT,
    "checklistProgress" JSONB,
    "documents" JSONB,
    "reminderDays" INTEGER,
    "reminderSet" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OpportunityActivity" (
    "id" TEXT NOT NULL,
    "savedOpportunityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpportunityActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ConversationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VerificationLog" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "details" TEXT,

    CONSTRAINT "VerificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "processor" TEXT,
    "paystackSubscriptionCode" TEXT,
    "paystackEmailToken" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "reference" TEXT,
    "localAmount" DOUBLE PRECISION,
    "currency" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UsageLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "savedOpportunitiesCount" INTEGER NOT NULL DEFAULT 0,
    "maxSaves" INTEGER NOT NULL DEFAULT 20,
    "documentsUploadedCount" INTEGER NOT NULL DEFAULT 0,
    "maxDocuments" INTEGER NOT NULL DEFAULT 0,
    "essaysDraftedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "maxEssays" INTEGER NOT NULL DEFAULT 0,
    "mentorCallsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "maxCalls" INTEGER NOT NULL DEFAULT 0,
    "essayReviewsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "maxReviews" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "opportunity_drafts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SCHOLARSHIP',
    "sponsor" TEXT NOT NULL,
    "apply_url" TEXT NOT NULL,
    "host_country" TEXT NOT NULL DEFAULT 'Global',
    "deadline" TIMESTAMP(3),
    "description" TEXT NOT NULL DEFAULT '',
    "eligibility" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "submitted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "feedbacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "rating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_whatsappNumber_key" ON "User"("whatsappNumber");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "opportunities_apply_url_key" ON "opportunities"("apply_url");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SavedOpportunity_userId_opportunityId_key" ON "SavedOpportunity"("userId", "opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_reference_key" ON "Subscription"("reference");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UsageLimit_userId_key" ON "UsageLimit"("userId");

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intakes_opportunity_id_fkey') THEN
    ALTER TABLE "intakes" ADD CONSTRAINT "intakes_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedOpportunity_userId_fkey') THEN
    ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedOpportunity_opportunityId_fkey') THEN
    ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'OpportunityActivity_savedOpportunityId_fkey') THEN
    ALTER TABLE "OpportunityActivity" ADD CONSTRAINT "OpportunityActivity_savedOpportunityId_fkey" FOREIGN KEY ("savedOpportunityId") REFERENCES "SavedOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConversationLog_userId_fkey') THEN
    ALTER TABLE "ConversationLog" ADD CONSTRAINT "ConversationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'VerificationLog_opportunityId_fkey') THEN
    ALTER TABLE "VerificationLog" ADD CONSTRAINT "VerificationLog_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Subscription_userId_fkey') THEN
    ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UsageLimit_userId_fkey') THEN
    ALTER TABLE "UsageLimit" ADD CONSTRAINT "UsageLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

