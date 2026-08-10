import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
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

  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { message = '', history = [] } = body;
  const lastMessage = message;

  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  const profile = (user?.profileJson as Record<string, any>) || {};

  const cacheKey = `chat:${userId || 'anon'}:${simpleHash(lastMessage + JSON.stringify(profile))}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const opportunities = await prisma.opportunity.findMany({
    where: {
      verificationStatus: 'verified',
      scamFlag: false,
      deadline: { gte: new Date() },
    },
    take: 10,
  });

  const dbContext = `User Profile: ${JSON.stringify(profile)}\nVerified Opportunities: ${JSON.stringify(opportunities)}`;

  const result = streamObject({
    model: google('gemini-1.5-flash'),
    schema: AtlasResponseSchema,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'system', content: dbContext },
      ...history.map((m: any) => ({
        role: m.role === 'agent' ? 'assistant' : (m.role === 'user' ? 'user' : 'system'),
        content: m.content || ''
      })),
      { role: 'user', content: message },
    ],
    temperature: 0.7,
  });

  result.object.then(async (final) => {
    if (redis) {
      await redis.setex(cacheKey, 86400, JSON.stringify(final));
    }
    if (final.memoryUpdates?.length && user) {
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
  }).catch(() => {});

  return result.toTextStreamResponse();
}
