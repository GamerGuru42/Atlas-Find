# AtlasFind Environment Variables & Configuration Guide

This document outlines all environment variables utilized across AtlasFind, their purposes, format requirements, and security implications.

---

## 1. Core Database Configuration

| Variable | Required | Description | Example / Format |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | Connection string for PostgreSQL database with connection pooling (e.g. Supabase transaction pooler on port 6543) | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | **Yes** | Direct connection string for PostgreSQL (used for Prisma migrations and schema pushes on port 5432) | `postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres` |

---

## 2. Authentication & Supabase

| Variable | Required | Description | Example / Format |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Public Supabase API project endpoint | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Public Supabase anonymous client API key | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Privileged Supabase service role key (used for server-side user verification) | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |

---

## 3. Artificial Intelligence Engine

| Variable | Required | Description | Notes |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for production Gemini models | Powers the 7-agent AI orchestration architecture in `/api/chat` and `/lib/agents/` |
| `GEMINI_MODEL` | Optional | Supported production model identifier | Defaults to `gemini-2.5-flash` |
| `GEMINI_REASONING_MODEL` | Optional | Supported reasoning model identifier | Defaults to `gemini-2.5-pro` |

---

## 4. Administrative Security & Cron Automation

| Variable | Required | Description | Notes |
|---|---|---|---|
| `ADMIN_PASSWORD` or `ADMIN_API_KEY` | **Yes (Prod)** | Secret key required to access administrative APIs (`/api/admin/*`) via `Authorization: Bearer <secret>` | Verified using constant-time comparison (`crypto.timingSafeEqual`). In production, admin endpoints fail closed if unset. |
| `CRON_SECRET` | **Yes (Prod)** | Secret key required to trigger scheduled tasks (`/api/cron/check-deadlines`, `/api/cron/verify-opportunities`) | Passed in `Authorization: Bearer <CRON_SECRET>` by Vercel Cron or external scheduler. |

---

## 5. Payment Gateways (Stripe & Paystack)

### Stripe
| Variable | Required | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | Optional / Feature-gated | Stripe secret API key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Optional / Feature-gated | Stripe webhook endpoint signing secret (`whsec_...`) |

### Paystack
| Variable | Required | Description |
|---|---|---|
| `PAYSTACK_SECRET_KEY` | Optional / Feature-gated | Paystack secret API key (`sk_live_...` or `sk_test_...`) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Optional / Feature-gated | Paystack public client key (`pk_live_...` or `pk_test_...`) |

---

## 6. General Application Settings

| Variable | Required | Description | Default |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Optional | Canonical production origin of the application | Defaults to request origin or `https://atlas-find.vercel.app` |
| `NODE_ENV` | Automatic | Environment flag set by runtime (`development`, `production`, `test`) | `development` / `production` |

