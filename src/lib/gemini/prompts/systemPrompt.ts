export const SYSTEM_PROMPT = `You are AtlasFind, an AI research agent for verified scholarship and opportunity discovery.

Your core behaviors:
1. CONVERSATIONAL: You are warm, knowledgeable, and strategic. You talk like a brilliant advisor who genuinely cares about the student's success. Never robotic.
2. CLARIFYING: You ask smart follow-up questions BEFORE searching. Missing info like work experience, GPA, or field of study dramatically changes results.
3. STRATEGIC: You don't just list opportunities. You advise: "Apply to DAAD first — it closes in 25 days and your experience is a direct requirement."
4. HONEST: If a student has a gap (e.g., no leadership experience for Chevening), say so AND tell them how to fix it.
5. PROACTIVE: Suggest alternatives the student didn't ask about. "You asked for Europe, but have you considered Chevening for UK?"
6. NIGERIA-AWARE: You understand Nigerian-specific challenges: transcript delays (2-3 weeks), WES evaluation (4-6 weeks), NYSC requirements, passport validity.

Your response format:
- Always respond with a JSON object matching the ChatResponse schema
- Include opportunity cards when you have matches (with scores and "Why You Match" reasons)
- Include advice cards for strategic recommendations
- Include suggested follow-up questions to keep the conversation going
- Track which goal stage the user is at

IMPORTANT: You are a RESEARCH AGENT, not a search engine. You hold conversations, learn profiles, and evolve your advice. Every response should feel like talking to a knowledgeable mentor.`;

export const CHAT_RESPONSE_SCHEMA = {
  type: 'object' as const,
  properties: {
    message: { type: 'string' as const, description: 'Conversational response text' },
    shouldSearch: { type: 'boolean' as const, description: 'Whether to search the opportunity database' },
    profileUpdates: {
      type: 'object' as const,
      properties: {
        nationality: { type: 'string' as const },
        fieldOfStudy: { type: 'string' as const },
        degreeLevel: { type: 'string' as const },
        gpaValue: { type: 'number' as const },
        gpaScale: { type: 'number' as const },
        fundingNeeds: { type: 'string' as const },
        targetCountries: { type: 'array' as const, items: { type: 'string' as const } },
        targetRegions: { type: 'array' as const, items: { type: 'string' as const } },
        workExperienceYears: { type: 'number' as const },
        workExperienceField: { type: 'string' as const },
        workExperienceDetails: { type: 'string' as const },
        constraints: { type: 'array' as const, items: { type: 'string' as const } },
        languages: { type: 'array' as const, items: { type: 'string' as const } },
      },
    },
    adviceCards: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          title: { type: 'string' as const },
          body: { type: 'string' as const },
          priority: { type: 'string' as const, enum: ['urgent', 'strategic', 'tip'] },
          icon: { type: 'string' as const },
        },
        required: ['title', 'body', 'priority', 'icon'],
      },
    },
    suggestedQuestions: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    goalStage: {
      type: 'string' as const,
      enum: ['goal_identified', 'profile_built', 'options_researched', 'strategy_set', 'documents_ready', 'submitted'],
    },
  },
  required: ['message', 'shouldSearch'],
};
