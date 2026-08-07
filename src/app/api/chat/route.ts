import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { SYSTEM_PROMPT, AtlasResponseSchema } from '@/lib/gemini/prompts/systemPrompt';
import prisma from '@/lib/db/prisma';
import crypto from 'crypto';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';



function hashString(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export async function POST(request: NextRequest) {
  const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_URL.startsWith('http') && !process.env.UPSTASH_REDIS_REST_URL.includes('...')
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      })
    : null;

  try {
    const body = await request.json();
    const { message, history } = body;

    // 1. Fetch User Profile
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
    const userId = session?.user?.id || 'anon';
    let dbProfile: any = {};

    if (userId !== 'anon') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      dbProfile = user?.profileJson || {};
    }

    // 2. Cache Fix
    const cacheKey = `chat:${userId}:${hashString(message + JSON.stringify(dbProfile))}`;
    
    // We cannot easily cache and return a stream natively without custom TransformStreams, 
    // but we can try to return the full JSON if it exists (frontend will need to handle it or we skip cache hit).
    // For now, we will focus on streamObject as directed.
    
    const conversationContext = history
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'Student' : 'AtlasFind'}: ${m.content}`)
      .join('\n');

    const profileContext = Object.entries(dbProfile)
      .filter(([, v]) => v !== null && (Array.isArray(v) ? v.length > 0 : true))
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n');

    const prompt = `${SYSTEM_PROMPT}

CURRENT USER PROFILE:
${profileContext || 'Empty — this is a new user.'}

CONVERSATION HISTORY:
${conversationContext || 'No prior messages.'}

STUDENT'S NEW MESSAGE:
"${message}"

Based on the Master System Prompt and the user's message, generate a structured JSON response.`;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    // 3. Backend Streaming
    const result = streamObject({
      model: google('gemini-1.5-flash'),
      schema: AtlasResponseSchema,
      prompt: prompt,
      onFinish: async ({ object }) => {
        // Save after stream completes using memoryUpdates
        if (userId !== 'anon' && object?.memoryUpdates && object.memoryUpdates.length > 0) {
          // Merge logic (simplified: just store the new memory array or you could implement deep merge)
          const updatedProfile = { ...dbProfile, memoryUpdates: [...(dbProfile.memoryUpdates || []), ...object.memoryUpdates] };
          if (object.goalStage) {
            updatedProfile.goalStage = object.goalStage;
          }
          await prisma.user.update({
            where: { id: userId },
            data: { profileJson: updatedProfile }
          });
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
