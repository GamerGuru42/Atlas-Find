import { streamText } from 'ai';
import { getAIModel, isAIConfigured, AI_CONFIG } from '@/lib/ai/config';
import prisma from '@/lib/db/prisma';
import { SYSTEM_PROMPT } from '@/lib/gemini/prompts/systemPrompt';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { classifyIntent, buildAgentInstructionPrompt } from '@/lib/agents';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!isAIConfigured()) {
    console.error('[Chat API] Gemini AI API key not configured.');
    return new Response(JSON.stringify({ error: "AI service is currently not configured on this environment." }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let userId: string | undefined;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
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
                // Ignore in Server Component
              }
            },
          },
        }
      );

      try {
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id;
      } catch {
        // Continue as anonymous guest
      }
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON payload', { status: 400 });
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    let profile: Record<string, any> = {};
    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        profile = {
          nationality: user?.countryCode,
          fieldOfStudy: user?.fieldOfStudy,
          level: user?.level,
          institution: user?.institution,
          graduationYear: user?.graduationYear,
          ...((user?.profileJson as Record<string, any>) || {}),
        };
      } catch {
        // Database error — continue without user profile
      }
    } else {
      // Guest profile from cookie
      const guestCookie = cookieStore.get('atlas_guest_profile')?.value;
      if (guestCookie) {
        try {
          profile = JSON.parse(decodeURIComponent(guestCookie));
        } catch {}
      }
    }

    // Get latest user prompt to classify intent
    const lastUserMsg = messages[messages.length - 1];
    const userPrompt = (lastUserMsg?.parts && Array.isArray(lastUserMsg.parts))
      ? lastUserMsg.parts.map((p: any) => p.text || '').join('')
      : (lastUserMsg?.content || '');

    const intent = classifyIntent(userPrompt);

    // Retrieve active, verified opportunities from database
    let opportunities: any[] = [];
    try {
      opportunities = await prisma.opportunity.findMany({
        where: {
          scamFlag: false,
          deadline: { gte: new Date() },
        },
        include: {
          intakes: true,
        },
        orderBy: {
          deadline: 'asc',
        },
        take: 20,
      });
    } catch (dbErr) {
      console.warn('[Chat API DB query error]', dbErr);
    }

    const formattedOpportunities = opportunities.map(opp => ({
      id: opp.id,
      title: opp.title,
      type: opp.type,
      sponsor: opp.sponsor,
      hostCountry: opp.hostCountry,
      eligibleCountries: opp.eligibleCountries,
      disciplines: opp.disciplines,
      degreeLevel: opp.degreeLevel,
      fundingType: opp.fundingType,
      deadline: opp.deadline ? new Date(opp.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Rolling / Open',
      opensDate: opp.opensDate ? new Date(opp.opensDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined,
      intakes: opp.intakes?.map((i: any) => ({
        intakeName: i.intakeName,
        startDate: i.startDate ? new Date(i.startDate).toISOString().split('T')[0] : null,
        deadlineDate: i.deadlineDate ? new Date(i.deadlineDate).toISOString().split('T')[0] : null,
        status: i.status,
      })),
      applyUrl: opp.applyUrl,
      sourceUrl: opp.sourceUrl,
      sourceDomain: opp.sourceDomain,
      verificationStatus: opp.verificationStatus,
      description: opp.description,
      eligibility: opp.eligibility,
    }));

    const agentDirective = buildAgentInstructionPrompt(intent, {
      profile,
      verifiedOpportunities: formattedOpportunities as any,
    });

    const dbContext = formattedOpportunities.length > 0
      ? `VERIFIED DATABASE CONTEXT:\n${JSON.stringify(formattedOpportunities, null, 2)}`
      : `VERIFIED DATABASE CONTEXT:\nNo active opportunities currently returned from the database.`;

    const instructions = `
${SYSTEM_PROMPT}

# Multi-Agent Coordination Directives
${agentDirective}

# Grounded Database Records
${dbContext}

# Guidelines
- **Expert, Evidence-Based Advisor**: Never hallucinate links or deadlines. If recommending an opportunity from the context, use its exact title, sponsor, application deadline, and applyUrl.
- **January 2027 Search Readiness**: If the user is inquiring about January 2027 internships or intakes, clearly distinguish the programme start date (January 2027) from application deadlines (which often fall in Autumn 2026).
- **Match Explanations**: Clearly explain why the opportunity matches their nationality, degree level, and discipline. If information is missing from their profile, explain what is needed.
- **Structured Recommendations**: Whenever you recommend an opportunity from the database context, append a structured JSON block at the very end of your response for each opportunity:
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

- **Profile Extraction**: If the user shares new profile facts (field, degree level, nationality, GPA, graduation year), append:
:::profile
{
  "fieldOfStudy": "FIELD_OF_STUDY",
  "level": "DEGREE_LEVEL",
  "countryCode": "TWO_LETTER_COUNTRY_CODE",
  "institution": "INSTITUTION",
  "graduationYear": YEAR
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
      model: getAIModel('default'),
      system: instructions,
      messages: coreMessages,
      temperature: AI_CONFIG.temperature.balanced,
      maxOutputTokens: AI_CONFIG.maxTokens.chat,
      onFinish: async ({ text }) => {
        if (userId && conversationId) {
          try {
            const userContent = userPrompt;
            const userJson = JSON.stringify({ conversationId, text: userContent });

            const existingUserMsg = await prisma.conversationLog.findFirst({
              where: {
                userId,
                role: 'user',
                content: userJson,
              },
            });

            if (!existingUserMsg) {
              await prisma.conversationLog.create({
                data: {
                  userId,
                  role: 'user',
                  content: userJson,
                },
              });
            }

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
      JSON.stringify({ error: error?.message || 'The AI assistant encountered an error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
