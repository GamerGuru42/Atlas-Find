import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { Redis } from '@upstash/redis';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/gemini/prompts/systemPrompt';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

const AtlasResponseSchema = z.object({
  message: z.string(),
  opportunities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    matchScore: z.number().min(0).max(100),
    category: z.enum(['top_pick', 'stretch_goal', 'safety_option']),
    deadline: z.string().optional(),
    whyMatch: z.string(),
    concerns: z.string().optional(),
    nextAction: z.string().optional(),
  })).optional(),
  advice: z.array(z.object({
    type: z.enum(['strategic', 'timeline', 'warning', 'tip']),
    content: z.string(),
  })).optional(),
  contextPills: z.array(z.object({
    label: z.string(),
    value: z.string(),
    source: z.enum(['stated', 'inferred', 'previous_session']),
  })).optional(),
  memoryUpdates: z.array(z.string()).optional(),
  nextSteps: z.array(z.string()).optional(),
  goalStage: z.enum([
    'goal_identified', 'profile_built', 'options_researched',
    'strategy_set', 'timeline_created', 'documents_ready', 'submitted'
  ]).optional(),
  clarifyingQuestion: z.boolean().default(false),
});

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

export async function POST(req: Request) {
  /*
  TEST THIS API DIRECTLY WITH CURL:
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"hello\", \"history\":[]}"
  */

  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('[Chat API] AI API key not configured.');
    return new Response(JSON.stringify({ error: "AI API key not configured" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    let userId: string | undefined;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    } catch {
      // Not logged in — that's fine, continue as anonymous
    }

    // Only create Redis if env vars look real (not placeholders)
    let redis: Redis | null = null;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';
    if (redisUrl.startsWith('https://') && redisUrl.length > 15 && redisToken.length > 10) {
      try {
        redis = new Redis({ url: redisUrl, token: redisToken });
      } catch {
        redis = null;
      }
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    const { message = '', history = [] } = body;
    if (!message.trim()) {
      return new Response('Message is required', { status: 400 });
    }

    let user = null;
    let profile: Record<string, any> = {};
    if (userId) {
      try {
        user = await prisma.user.findUnique({ where: { id: userId } });
        profile = (user?.profileJson as Record<string, any>) || {};
      } catch {
        // DB error — continue without profile
      }
    }

    // Check cache (gracefully)
    const cacheKey = `chat:${userId || 'anon'}:${simpleHash(message + JSON.stringify(profile))}`;
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return new Response(JSON.stringify(cached), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch {
        // Cache miss or error — continue to AI
      }
    }

    // Get opportunities (gracefully)
    let opportunities: any[] = [];
    try {
      opportunities = await prisma.opportunity.findMany({
        where: {
          scamFlag: false,
          deadline: { gte: new Date() },
        },
        take: 15,
      });
    } catch {
      // DB error — continue with empty opportunities
    }

    const dbContext = opportunities.length > 0
      ? `User Profile: ${JSON.stringify(profile)}\nVerified Opportunities: ${JSON.stringify(opportunities)}`
      : `User Profile: ${JSON.stringify(profile)}\nNo opportunities loaded from database yet.`;

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${dbContext}`;

    const result = streamObject({
      model: google('gemini-2.0-flash-lite'),
      schema: AtlasResponseSchema,
      system: fullSystemPrompt,
      messages: [
        ...history.map((m: any) => ({
          role: m.role === 'agent' ? ('assistant' as const) : ('user' as const),
          content: m.content || ''
        })),
        { role: 'user' as const, content: message },
      ],
      temperature: 0.7,
    });

    // Background: cache result + update profile (non-blocking)
    result.object.then(async (final) => {
      try {
        if (redis) {
          await redis.setex(cacheKey, 86400, JSON.stringify(final));
        }
        if (final.memoryUpdates?.length && user && userId) {
          const updatedProfile = { ...profile };
          final.memoryUpdates.forEach((update) => {
            const [key, value] = update.split(':');
            if (key && value) updatedProfile[key.trim()] = value.trim();
          });
          await prisma.user.update({
            where: { id: userId },
            data: { profileJson: updatedProfile },
          });
        }
      } catch {
        // Background task failed — don't crash
      }
    }).catch(() => {});

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('[Chat API Error]', error?.message || error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
