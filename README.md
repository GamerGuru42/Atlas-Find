# AtlasFind — AI-Powered Global Opportunity Discovery & Application Platform

AtlasFind is a dependable, production-grade opportunity intelligence platform designed to connect students, researchers, and professionals with authentic, verified global scholarships, fellowships, grants, internships, and research placements.

---

## Key Platform Capabilities

1. **Authentic Opportunity Discovery Engine**
   - Zero synthetic production data: all opportunities derive from verified institutional sources (.edu, .gov, international agencies, official enterprise career portals).
   - Multi-criteria relational filtering across category, host country, degree level, discipline, funding type, and start dates.
   - Distinct handling of **Application Deadlines** versus **Programme Start Dates / Intakes** (supporting searches for January 2027 internships).

2. **Auditable Verification Engine (`src/lib/verification/`)**
   - SSRF protection defending against loopback, cloud metadata (AWS/GCP), and private subnet enumeration.
   - 3-tier domain trust evaluation:
     - **Tier 1:** Accredited government portals, universities, and recognized international agencies (.gov, .edu, .int, .ac.uk).
     - **Tier 2:** Reputable publishers and established corporate domains.
     - **Tier 3 / Untrusted:** Suspicious domains, free blog hosts, link shorteners.
   - Fraud detection identifying exploitation risks (e.g., application fee requests, Western Union transfers, unverified third-party portals).
   - Auditable `VerificationLog` history storing checked timestamps, methods, trust tiers, and risk scores.

3. **Deterministic Eligibility & Matching Engine (`src/lib/matching/`)**
   - Transparent, evidence-based matching replacing arbitrary hash calculations.
   - Three clear eligibility states: `ELIGIBLE`, `POTENTIALLY_ELIGIBLE`, and `NOT_ELIGIBLE`.
   - Granular match scoring (0–100%) with multidimensional breakdown:
     - Nationality matching (with support for regional cohorts like African & Developing Countries)
     - Degree level normalization (Bachelors, Masters, PhD, Postdoc)
     - Academic performance / GPA thresholds
     - Field of study & discipline affinity
     - Geographic preference & location
     - Funding requirement compatibility

4. **Concrete 7-Agent AI Assistant Architecture (`src/lib/agents/`)**
   - **Centralized Model Configuration (`src/lib/ai/config.ts`):** Powered by Google Gemini 2.5 Flash (`gemini-2.5-flash`) with reasoning fallback to `gemini-2.5-pro`.
   - **Discovery Agent:** Parses conversational queries (e.g., "internships starting in January 2027 in Germany") into structured query filters.
   - **Eligibility Agent:** Evaluates candidate profiles against criteria, identifying missing qualifications and actionable steps.
   - **Research Agent:** Investigates official sponsors, portal links, and documentation requirements.
   - **Application Strategist Agent:** Backward-plans application roadmaps with structured deadline milestones.
   - **Writing Assistant Agent:** Structural review, tone critique, and alignment feedback for CVs and statements of purpose under strict anti-ghostwriting governance.
   - **Monitoring Agent:** Tracks deadline urgency (<14 days = `CLOSING_SOON`) and lifecycle transitions without corrupting verification records.
   - **Conversation Orchestrator:** Unified routing with grounded database retrieval and structured response blocks (`:::opportunity`, `:::profile`).

5. **Hardened Security & Data Integrity**
   - Administrative routes protected by constant-time authentication (`crypto.timingSafeEqual`) defending against timing attacks.
   - Payment webhooks (Stripe & Paystack) enforce strict HMAC cryptographic signature validation with atomic database transactions.
   - Complete IDOR defense on tracker routes through user-scoped compound queries (`where: { id, userId }`).
   - Decoupled verification status (`verified`, `flagged`, `requires_review`) from availability (`active`, `closing_soon`, `expired`).
   - Constant-time `CRON_SECRET` Bearer token authentication for Vercel Cron jobs.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions, Route Handlers)
- **Runtime:** Node.js 26.x (Standardized for AtlasFind and Vercel)
- **Language:** TypeScript 5.9 (Strict Mode)
- **Database:** PostgreSQL via Prisma ORM v6
- **Auth:** Supabase Auth (SSR Client)
- **AI Engine:** Google Gemini 2.5 Flash via `@ai-sdk/google` & `@google/genai`
- **Payments:** Stripe & Paystack
- **Styling:** CSS Modules with design tokens

---

## Quick Start

### 1. Prerequisites
- Node.js 26.x (`.node-version` / `.nvmrc` provided)
- PostgreSQL database (Supabase or direct instance)

### 2. Installation
```bash
npm install
```

### 3. Database Deployment & Baselining (Production Safe)
Never use `db push` in production. AtlasFind maintains a migration history in `prisma/migrations/`:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. For new production databases, deploy the migrations:
npx prisma migrate deploy

# (If baselining an existing database that already has tables):
# npx prisma migrate resolve --applied 0_init

# 3. Seed verified real opportunities (idempotent, safe to rerun):
npm run seed
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Testing

AtlasFind maintains comprehensive unit and integration test suites:

```bash
# Run all 6 test suites (Matching, Verification, January 2027 Discovery, Security, Lifecycle, AI Agents)
node --test tests/matching-engine.test.ts tests/verification-engine.test.ts tests/discovery-and-jan2027.test.ts tests/security-and-auth.test.ts tests/lifecycle-and-monitoring.test.ts tests/ai-agents.test.ts

# Run TypeScript compilation check
npx tsc --noEmit
```

---

## Production Build

To compile and verify the production build:
```bash
npm run build
```

---

## Scheduled Automation (Vercel Cron)

Configured in `vercel.json`:
- `0 0 * * *` (Daily at midnight UTC): `/api/cron/check-deadlines`
- `0 2 * * 0` (Weekly on Sunday at 2 AM UTC): `/api/cron/verify-opportunities`

Protected by `Authorization: Bearer <CRON_SECRET>` with constant-time verification.

---

## Documentation

- [System Architecture](file:///docs/ARCHITECTURE.md)
- [Environment Variables & Configuration](file:///docs/ENVIRONMENT.md)
