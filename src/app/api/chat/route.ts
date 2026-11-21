import { streamText } from 'ai';
import { getAIModel, isAIConfigured, AI_CONFIG } from '@/lib/ai/config';
import prisma from '@/lib/db/prisma';
import { SYSTEM_PROMPT } from '@/lib/gemini/prompts/systemPrompt';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { classifyIntent, buildAgentInstructionPrompt } from '@/lib/agents';
import { evaluateOpportunityLifecycle } from '@/lib/opportunity/lifecycle';

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
    let userMetadata: Record<string, any> | undefined;

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
        userMetadata = session?.user?.user_metadata;
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

    let userName: string | undefined;
    let profile: Record<string, any> = {};

    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const meta = userMetadata;
        const profileJson = (user?.profileJson as Record<string, any>) || {};
        const rawName = meta?.full_name || meta?.name || meta?.first_name || profileJson?.name || profileJson?.fullName || profileJson?.firstName;

        if (rawName && typeof rawName === 'string') {
          userName = rawName.trim().split(/\s+/)[0]; // First name only
        }

        profile = {
          name: userName,
          nationality: user?.countryCode,
          fieldOfStudy: user?.fieldOfStudy,
          level: user?.level,
          institution: user?.institution,
          graduationYear: user?.graduationYear,
          ...profileJson,
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
          if (profile.name && typeof profile.name === 'string') {
            userName = profile.name.trim().split(/\s+/)[0];
          }
        } catch { }
      }
    }

    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: (msg.parts && Array.isArray(msg.parts))
        ? msg.parts.map((p: any) => p.text || '').join('')
        : (msg.content || '')
    }));

    // Get latest user prompt
    const lastUserMsg = messages[messages.length - 1];
    const userPrompt = (lastUserMsg?.parts && Array.isArray(lastUserMsg.parts))
      ? lastUserMsg.parts.map((p: any) => p.text || '').join('')
      : (lastUserMsg?.content || '');

    // Classify intent using multi-turn conversation context
    const intent = classifyIntent(userPrompt, coreMessages);

    // Intent-gated research: only query opportunities when user is actually researching
    const isResearchIntent = [
      'DISCOVERY',
      'CONTEXTUAL_FOLLOWUP',
      'RESEARCH',
      'ELIGIBILITY_CHECK',
      'DEADLINE_MONITORING'
    ].includes(intent);

    // Retrieve verified opportunities from database if user is seeking opportunities
    let opportunities: any[] = [];
    if (isResearchIntent) {
      try {
        const activeOpps = await prisma.opportunity.findMany({
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

        let contextOpps = [...activeOpps];
        const lowerPrompt = (userPrompt + ' ' + coreMessages.slice(-3).map(m => m.content).join(' ')).toLowerCase();

        // If user is inquiring about January 2027 or specific programs that may be closed,
        // also fetch them so the AI can truthfully state whether their deadline has passed
        if (
          lowerPrompt.includes('2027') ||
          lowerPrompt.includes('january') ||
          lowerPrompt.includes('esa') ||
          lowerPrompt.includes('cern') ||
          lowerPrompt.includes('chevening') ||
          lowerPrompt.includes('rhodes') ||
          lowerPrompt.includes('closed') ||
          lowerPrompt.includes('expired') ||
          lowerPrompt.includes('past')
        ) {
          const specialOpps = await prisma.opportunity.findMany({
            where: {
              scamFlag: false,
              OR: [
                { title: { contains: '2027', mode: 'insensitive' } },
                { title: { contains: 'ESA', mode: 'insensitive' } },
                { title: { contains: 'CERN', mode: 'insensitive' } },
                { title: { contains: 'Chevening', mode: 'insensitive' } },
                { description: { contains: '2027', mode: 'insensitive' } },
                {
                  intakes: {
                    some: {
                      OR: [
                        { intakeName: { contains: '2027', mode: 'insensitive' } },
                        { startDate: { gte: new Date('2027-01-01'), lte: new Date('2027-12-31') } },
                      ]
                    }
                  }
                }
              ]
            },
            include: { intakes: true },
            take: 6,
          });

          for (const so of specialOpps) {
            if (!contextOpps.some(o => o.id === so.id)) {
              contextOpps.push(so);
            }
          }
        }

        opportunities = contextOpps;
      } catch (dbErr) {
        console.warn('[Chat API DB query error]', dbErr);
      }
    }

    const formattedOpportunities = opportunities.map(opp => {
      const isRolling = opp.intakes?.some((i: any) => i.isRolling) || false;
      const lifecycle = evaluateOpportunityLifecycle({
        id: opp.id,
        deadline: opp.deadline,
        opensDate: opp.opensDate,
        isRolling,
        verificationStatus: opp.verificationStatus,
        status: opp.verificationStatus,
      });

      return {
        id: opp.id,
        title: opp.title,
        type: opp.type,
        sponsor: opp.sponsor,
        hostCountry: opp.hostCountry,
        eligibleCountries: opp.eligibleCountries,
        disciplines: opp.disciplines,
        degreeLevel: opp.degreeLevel,
        fundingType: opp.fundingType,
        lifecycleStatus: lifecycle.status,
        canApply: lifecycle.canApply,
        badgeText: lifecycle.badgeText,
        formattedDeadline: lifecycle.formattedDeadline,
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
      };
    });

    const agentDirective = buildAgentInstructionPrompt(intent, {
      userName,
      profile,
      verifiedOpportunities: formattedOpportunities as any,
    });

    const researchGuidelines = isResearchIntent
      ? `
# Grounded Database Records
${formattedOpportunities.length > 0 ? `VERIFIED DATABASE CONTEXT:\n${JSON.stringify(formattedOpportunities, null, 2)}` : 'No active opportunities matched in local database.'}

# Opportunity Guidelines
- **Expert, Evidence-Based Advisor**: Never hallucinate links or deadlines. If recommending an opportunity from the context, use its exact title, sponsor, application deadline, and applyUrl.
- **Application Deadline & Lifecycle Truthfulness**:
  - Opportunities marked with \`"lifecycleStatus": "CLOSED"\` have passed their application deadline. NEVER present them as currently open for applications.
  - If a user inquires about an opportunity whose deadline has passed (e.g. an intake in January 2027 whose application window closed in Autumn 2026), clearly explain that the application period closed on its deadline date, state when the next cycle is expected, and suggest open or upcoming alternatives from the context.
  - Opportunities with \`"lifecycleStatus": "CLOSING_SOON"\` must be flagged with an urgency notice.
  - Opportunities with \`"lifecycleStatus": "UPCOMING"\` have applications opening on a future date; advise the user to prepare materials in advance.
- **January 2027 Search Readiness**: If the user is inquiring about January 2027 internships or intakes, clearly distinguish the programme start date (January 2027) from application deadlines (which often fall in Autumn 2026).
- **Match Explanations**: Clearly explain why the opportunity matches their nationality, degree level, and discipline.
- **Structured Recommendations**: Whenever you recommend an active opportunity from the database context, append a structured JSON block at the very end of your response for each opportunity:
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
`
      : '';

    const instructions = `
${SYSTEM_PROMPT}

# Multi-Agent Coordination Directives
${agentDirective}
${researchGuidelines}

# Profile Learning Guidelines
- If the user naturally shares new profile facts (field, degree level, nationality, GPA, graduation year), append at the very end:
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

    const conversationId = body.conversationId || 'default';

    const saveConversationLog = async (text: string) => {
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
    };

    let activeStream: any = null;
    let activeIterator: any = null;
    let firstChunk: string | null = null;
    let activeModelUsed = 'primary';

    // 1. Attempt Primary Model (gemini-3.8-flash) with bounded retries
    try {
      const primaryResult = streamText({
        model: getAIModel('primary'),
        system: instructions,
        messages: coreMessages,
        temperature: AI_CONFIG.temperature.balanced,
        maxOutputTokens: AI_CONFIG.maxTokens.chat,
        maxRetries: AI_CONFIG.maxRetries,
        abortSignal: AbortSignal.timeout(6000),
        onFinish: async ({ text }) => {
          await saveConversationLog(text);
        },
      });

      const iterator = primaryResult.textStream[Symbol.asyncIterator]();
      const first = await iterator.next();
      if (!first.done && first.value && typeof first.value === 'string' && first.value.length > 0) {
        firstChunk = first.value;
        activeStream = primaryResult;
        activeIterator = iterator;
        activeModelUsed = 'primary';
      }
    } catch (primaryErr: any) {
      console.warn(`[Chat API] Primary model (${AI_CONFIG.primaryModelId}) failed before streaming started:`, primaryErr?.message || primaryErr);
    }

    // 2. If Primary failed before streaming started, attempt Fallback Model (gemini-3.7-flash)
    if (!activeStream) {
      try {
        console.info(`[Chat API] Falling back to alternative model (${AI_CONFIG.fallbackModelId})...`);
        const fallbackResult = streamText({
          model: getAIModel('fallback'),
          system: instructions,
          messages: coreMessages,
          temperature: AI_CONFIG.temperature.balanced,
          maxOutputTokens: AI_CONFIG.maxTokens.chat,
          maxRetries: AI_CONFIG.maxRetries,
          abortSignal: AbortSignal.timeout(6000),
          onFinish: async ({ text }) => {
            await saveConversationLog(text);
          },
        });

        const fallbackIterator = fallbackResult.textStream[Symbol.asyncIterator]();
        const fallbackFirst = await fallbackIterator.next();
        if (!fallbackFirst.done && fallbackFirst.value && typeof fallbackFirst.value === 'string' && fallbackFirst.value.length > 0) {
          firstChunk = fallbackFirst.value;
          activeStream = fallbackResult;
          activeIterator = fallbackIterator;
          activeModelUsed = 'fallback';
        }
      } catch (fallbackErr: any) {
        console.warn(`[Chat API] Fallback model (${AI_CONFIG.fallbackModelId}) also failed before streaming:`, fallbackErr?.message || fallbackErr);
      }
    }

    // 3. If Fallback also failed before streaming started, attempt Resilience Model (gemini-3.5-flash)
    if (!activeStream) {
      try {
        console.info(`[Chat API] Falling back to resilience model (${AI_CONFIG.resilienceModelId})...`);
        const resilienceResult = streamText({
          model: getAIModel('resilience'),
          system: instructions,
          messages: coreMessages,
          temperature: AI_CONFIG.temperature.balanced,
          maxOutputTokens: AI_CONFIG.maxTokens.chat,
          maxRetries: AI_CONFIG.maxRetries,
          abortSignal: AbortSignal.timeout(25000),
          onFinish: async ({ text }) => {
            await saveConversationLog(text);
          },
        });

        const resilienceIterator = resilienceResult.textStream[Symbol.asyncIterator]();
        const resilienceFirst = await resilienceIterator.next();
        if (!resilienceFirst.done && resilienceFirst.value && typeof resilienceFirst.value === 'string' && resilienceFirst.value.length > 0) {
          firstChunk = resilienceFirst.value;
          activeStream = resilienceResult;
          activeIterator = resilienceIterator;
          activeModelUsed = 'resilience';
        }
      } catch (resilienceErr: any) {
        console.warn(`[Chat API] Resilience model (${AI_CONFIG.resilienceModelId}) also failed before streaming:`, resilienceErr?.message || resilienceErr);
      }
    }

    // 4. If Resilience also failed before streaming started, attempt Ultra-Fast Speed Model (gemini-3.5-flash-lite)
    if (!activeStream) {
      try {
        console.info(`[Chat API] Falling back to speed model (${AI_CONFIG.speedModelId})...`);
        const speedResult = streamText({
          model: getAIModel('speed'),
          system: instructions,
          messages: coreMessages,
          temperature: AI_CONFIG.temperature.balanced,
          maxOutputTokens: AI_CONFIG.maxTokens.chat,
          maxRetries: AI_CONFIG.maxRetries,
          abortSignal: AbortSignal.timeout(15000),
          onFinish: async ({ text }) => {
            await saveConversationLog(text);
          },
        });

        const speedIterator = speedResult.textStream[Symbol.asyncIterator]();
        const speedFirst = await speedIterator.next();
        if (!speedFirst.done && speedFirst.value && typeof speedFirst.value === 'string' && speedFirst.value.length > 0) {
          firstChunk = speedFirst.value;
          activeStream = speedResult;
          activeIterator = speedIterator;
          activeModelUsed = 'speed';
        }
      } catch (speedErr: any) {
        console.error(`[Chat API] Speed model (${AI_CONFIG.speedModelId}) also failed before streaming:`, speedErr?.message || speedErr);
      }
    }

    // 5. If all models failed before streaming started, return prompt honest 503 error
    if (!activeStream || !activeIterator) {
      return new Response(
        JSON.stringify({
          error: "The AI advisor is temporarily experiencing high upstream demand from Google AI services. Please try again in a few moments."
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '5',
          }
        }
      );
    }

    // 5. Return custom ReadableStream piping the validated model output to the client
    // Note: Do NOT switch models halfway through an already-started stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (firstChunk) {
            controller.enqueue(encoder.encode(firstChunk));
          }
          while (true) {
            const { done, value } = await activeIterator.next();
            if (done) break;
            controller.enqueue(encoder.encode(value));
          }
          controller.close();
        } catch (streamError) {
          console.error(`[Chat API] Stream interrupted mid-flight (${activeModelUsed}):`, streamError);
          controller.error(streamError);
        }
      }
    });

    const activeModelName = activeModelUsed === 'primary'
      ? AI_CONFIG.primaryModelId
      : activeModelUsed === 'fallback'
      ? AI_CONFIG.fallbackModelId
      : activeModelUsed === 'resilience'
      ? AI_CONFIG.resilienceModelId
      : AI_CONFIG.speedModelId;

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-AI-Model': activeModelName,
      }
    });
  } catch (error: any) {
    console.error('[Chat API Error]', error?.stack || error);
    return new Response(
      JSON.stringify({ error: error?.message || 'The AI assistant encountered an error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
