import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

import { PrismaClient } from '@prisma/client';
import { SYSTEM_PROMPT } from '@/lib/gemini/prompts/systemPrompt';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
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
      // Not logged in — continue as anonymous
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    let profile: Record<string, any> = {};
    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        profile = (user?.profileJson as Record<string, any>) || {};
      } catch {
        // DB error — continue without profile
      }
    }

    // Get verified opportunities for context
    let opportunities: any[] = [];
    try {
      opportunities = await prisma.opportunity.findMany({
        where: {
          scamFlag: false,
          deadline: { gte: new Date() },
        },
        take: 15, // Provide the top 15 verified opportunities as context
      });
    } catch {
      // DB error — continue with empty opportunities
    }

    const dbContext = opportunities.length > 0
      ? `User Profile: ${JSON.stringify(profile)}\n\nAvailable Verified Opportunities for you to recommend to the user if they fit their profile:\n${JSON.stringify(opportunities, null, 2)}`
      : `User Profile: ${JSON.stringify(profile)}\nNo active opportunities loaded from database at this moment.`;

    const instructions = `
You are Atlas, a highly intelligent, conversational, and intuitive AI Agent specializing in global opportunities (scholarships, internships, fellowships, etc.). 
Your personality is similar to ChatGPT, Claude, and Gemini — helpful, insightful, and natural.

${SYSTEM_PROMPT}

# Context Database
Use the following user profile and verified database opportunities to inform your responses. 
If an opportunity matches the user's request, mention it naturally in your text response and provide its details (like applyUrl or deadline) beautifully formatted using Markdown.

${dbContext}

# Guidelines
- **Always use Markdown formatting** for readability (bold text for emphasis, bullet points for lists, etc.).
- Be conversational and engaging. Do NOT output raw JSON blocks.
- If you recommend an opportunity from the context, clearly highlight why it's a good fit.
- Ask follow-up questions one at a time to build the user's profile step-by-step.
    `;

    const result = streamText({
      model: google('gemini-2.0-flash-lite'),
      system: instructions,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('[Chat API Error]', error?.message || error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
