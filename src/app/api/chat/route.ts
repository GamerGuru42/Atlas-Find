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
export const maxDuration = 60;

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
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
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

    const formattedOpportunities = opportunities.map(opp => ({
      ...opp,
      deadline: opp.deadline ? new Date(opp.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Rolling / No Specific Deadline',
      opensDate: opp.opensDate ? new Date(opp.opensDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined,
    }));

    const dbContext = formattedOpportunities.length > 0
      ? `User Profile: ${JSON.stringify(profile)}\n\nAvailable Verified Opportunities for you to recommend to the user if they fit their profile:\n${JSON.stringify(formattedOpportunities, null, 2)}`
      : `User Profile: ${JSON.stringify(profile)}\nNo active opportunities loaded from database at this moment.`;

    const instructions = `
You are Atlas, a highly intelligent, conversational, technical, and research-oriented AI Agent specializing in global opportunities (scholarships, internships, fellowships, etc.). 
Your personality is similar to the world's most advanced AI assistants — exceptionally smart, insightful, deeply analytical, and natural in conversation.

${SYSTEM_PROMPT}

# Context Database
Use the following user profile and verified database opportunities to inform your responses. 
If an opportunity matches the user's request, mention it naturally in your text response and provide its details (like applyUrl or deadline) beautifully formatted using Markdown.

${dbContext}

# Guidelines
- **Be an Expert Advisor**: Do not just act as a search engine. Offer strategic, highly technical, and deeply researched advice based on the user's goals. Guide them through the application process and provide recommendations for their career or academic path.
- **Always use Markdown formatting** for readability (bold text for emphasis, bullet points for lists, etc.).
- **Conversational & Smart**: Be highly conversational, empathetic, and smart. If the conversation shifts, adapt seamlessly. Do NOT just dump a list of links.
- **Match Scoring**: If you recommend an opportunity from the context, clearly highlight why it's a good fit and calculate a rough "match score" based on their profile.
- **CRITICAL - Deadlines & Links**: Whenever you mention an opportunity, you MUST explicitly state its application deadline EXACTLY as it appears in the database (e.g. "**Deadline:** October 15, 2026"). Always include the **Application Link** directly, using the \`applyUrl\`. Treat these dates as real and verified, and highlight them.
- **Proactive Next Steps**: End your responses by proactively suggesting strategic next steps or asking ONE insightful, clarifying question to build the user's profile and narrow down the best opportunities.
- **Structured Recommendations**: Whenever you recommend one or more opportunities from the database context, you MUST append a structured JSON block at the very end of your response for each opportunity recommended. Each block must look EXACTLY like this:
:::opportunity
{
  "id": "OPPORTUNITY_ID",
  "title": "TITLE",
  "sponsor": "SPONSOR/PROVIDER",
  "score": MATCH_SCORE,
  "deadline": "DEADLINE",
  "applyUrl": "APPLY_URL"
}
:::
    `;
    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: (msg.parts && Array.isArray(msg.parts)) 
        ? msg.parts.map((p: any) => p.text || '').join('') 
        : (msg.content || '')
    }));

    const conversationId = body.conversationId || 'default';

    const result = streamText({
      model: google('gemini-3.5-flash'),
      system: instructions,
      messages: coreMessages,
      temperature: 0.7,
      maxOutputTokens: 3000,
      onFinish: async ({ text }) => {
        if (userId && conversationId) {
          try {
            const lastUserMsg = messages[messages.length - 1];
            const userContent = lastUserMsg.content || lastUserMsg.parts?.map((p: any) => p.text || '').join('') || '';

            // Check if user message already saved to avoid duplicates
            const existingUserMsg = await prisma.conversationLog.findFirst({
              where: {
                userId,
                role: 'user',
                content: {
                  contains: `"${conversationId}"`,
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            });

            const userJson = JSON.stringify({ conversationId, text: userContent });
            if (!existingUserMsg || existingUserMsg.content !== userJson) {
              await prisma.conversationLog.create({
                data: {
                  userId,
                  role: 'user',
                  content: userJson,
                },
              });
            }

            // Save agent message
            await prisma.conversationLog.create({
              data: {
                userId,
                role: 'agent',
                content: JSON.stringify({ conversationId, text }),
              },
            });
          } catch (e) {
            console.error('[Chat API onFinish save error]', e);
          }
        }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('[Chat API Error]', error?.stack || error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
