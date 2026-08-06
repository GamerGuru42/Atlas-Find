import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, getCached, setCache } from '@/lib/gemini/client';
import { SYSTEM_PROMPT, CHAT_RESPONSE_SCHEMA } from '@/lib/gemini/prompts/systemPrompt';
import { matchOpportunities } from '@/lib/gemini/agents/profileMatcher';
import { verifyOpportunity } from '@/lib/gemini/agents/verificationGuard';
import { seedOpportunities } from '@/data/seed/opportunities';
import { UserProfile, GoalStage } from '@/types/user';
import { ChatMessage, AdviceCard } from '@/types/chat';
import { MatchResult } from '@/types/opportunity';

interface ChatRequest {
  message: string;
  history: { role: string; content: string }[];
  profile: UserProfile;
  goalStage: GoalStage;
}

interface GeminiResponse {
  message: string;
  shouldSearch: boolean;
  profileUpdates?: Partial<{
    nationality: string;
    fieldOfStudy: string;
    degreeLevel: string;
    gpaValue: number;
    gpaScale: number;
    fundingNeeds: string;
    targetCountries: string[];
    targetRegions: string[];
    workExperienceYears: number;
    workExperienceField: string;
    workExperienceDetails: string;
    constraints: string[];
    languages: string[];
  }>;
  adviceCards?: AdviceCard[];
  suggestedQuestions?: string[];
  goalStage?: GoalStage;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history, profile, goalStage } = body;

    // ===== Step 1: Parse intent with Gemini (Agent 1 + Agent 7) =====
    let geminiResponse: GeminiResponse;
    const client = getGeminiClient();

    if (client) {
      // Use a context-aware cache key so the same question in different conversations gets fresh responses
      const cacheKey = `intent:${message.toLowerCase().trim()}:${history.length}:${JSON.stringify(profile).slice(0,100)}`;
      const cached = getCached<GeminiResponse>(cacheKey);

      if (cached) {
        geminiResponse = cached;
      } else {
        const conversationContext = history
          .slice(-10) // Last 10 messages for context
          .map((m) => `${m.role === 'user' ? 'Student' : 'AtlasFind'}: ${m.content}`)
          .join('\n');

        const profileContext = Object.entries(profile)
          .filter(([, v]) => v !== null && (Array.isArray(v) ? v.length > 0 : true))
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join('\n');

        const prompt = `${SYSTEM_PROMPT}

CURRENT USER PROFILE:
${profileContext || 'Empty — this is a new user.'}

CURRENT GOAL STAGE: ${goalStage}

CONVERSATION HISTORY:
${conversationContext || 'No prior messages.'}

STUDENT'S NEW MESSAGE:
"${message}"

Respond with a JSON object following the schema. Be conversational, strategic, and specific. If the student hasn't given enough info to search (nationality, field, degree level, or preferred regions), ask clarifying questions first. If they have, set shouldSearch to true.`;

        try {
          const result = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: CHAT_RESPONSE_SCHEMA,
            },
          });
          geminiResponse = JSON.parse(result.text || '{}');
          setCache(cacheKey, geminiResponse);
        } catch {
          geminiResponse = generateFallbackResponse(message, profile, goalStage);
        }
      }
    } else {
      // No API key — use intelligent fallback
      geminiResponse = generateFallbackResponse(message, profile, goalStage);
    }

    // ===== Step 2: Update profile (Agent 6: Learning Agent) =====
    const updatedProfile = applyProfileUpdates(profile, geminiResponse.profileUpdates);

    // ===== Step 3: Search & match if needed (Agent 3 + Agent 2) =====
    let matches: MatchResult[] = [];
    if (geminiResponse.shouldSearch) {
      // Agent 3 (Researcher stub): search seed database
      const allOpportunities = seedOpportunities;

      // Agent 4 (Verification Guard): verify each opportunity
      const verifiedOpportunities = allOpportunities.filter((opp) => {
        const verification = verifyOpportunity(opp);
        return verification.status !== 'flagged';
      });

      // Agent 2 (Profile Matcher): score and rank
      matches = matchOpportunities(updatedProfile, verifiedOpportunities);

      // Limit to top 5
      matches = matches.slice(0, 5);
    }

    // ===== Step 4: Build response (Agent 5: Synthesizer) =====
    const newContextPills = buildContextPills(updatedProfile, profile);

    const responseMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'agent',
      content: geminiResponse.message,
      timestamp: new Date().toISOString(),
      opportunityCards: matches.length > 0 ? matches : undefined,
      adviceCards: geminiResponse.adviceCards,
      contextPillsAdded: newContextPills.length > 0 ? newContextPills : undefined,
      goalUpdate: geminiResponse.goalStage || null,
      suggestedQuestions: geminiResponse.suggestedQuestions,
    };

    return NextResponse.json({
      response: responseMessage,
      updatedProfile,
      goalStage: geminiResponse.goalStage || goalStage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ===== Fallback response when no API key =====
function generateFallbackResponse(
  message: string,
  profile: UserProfile,
  goalStage: GoalStage
): GeminiResponse {
  const msg = message.toLowerCase();

  // Extract profile data from message
  const updates: GeminiResponse['profileUpdates'] = {};
  let shouldSearch = false;

  // === Nationality detection (comprehensive) ===
  const nationalityMap: Record<string, string> = {
    'nigerian': 'Nigeria', 'nigeria': 'Nigeria',
    'ghanaian': 'Ghana', 'ghana': 'Ghana',
    'kenyan': 'Kenya', 'kenya': 'Kenya',
    'indian': 'India', 'india': 'India',
    'pakistani': 'Pakistan', 'pakistan': 'Pakistan',
    'bangladeshi': 'Bangladesh', 'bangladesh': 'Bangladesh',
    'south african': 'South Africa', 'south africa': 'South Africa',
    'ugandan': 'Uganda', 'uganda': 'Uganda',
    'tanzanian': 'Tanzania', 'tanzania': 'Tanzania',
    'cameroonian': 'Cameroon', 'cameroon': 'Cameroon',
    'ethiopian': 'Ethiopia', 'ethiopia': 'Ethiopia',
    'rwandan': 'Rwanda', 'rwanda': 'Rwanda',
    'zambian': 'Zambia', 'zambia': 'Zambia',
    'zimbabwean': 'Zimbabwe', 'zimbabwe': 'Zimbabwe',
    'egyptian': 'Egypt', 'egypt': 'Egypt',
    'moroccan': 'Morocco', 'morocco': 'Morocco',
    'filipino': 'Philippines', 'philippines': 'Philippines',
    'indonesian': 'Indonesia', 'indonesia': 'Indonesia',
    'malaysian': 'Malaysia', 'malaysia': 'Malaysia',
    'vietnamese': 'Vietnam', 'vietnam': 'Vietnam',
    'thai': 'Thailand', 'thailand': 'Thailand',
    'nepali': 'Nepal', 'nepal': 'Nepal',
    'sri lankan': 'Sri Lanka', 'sri lanka': 'Sri Lanka',
    'chinese': 'China', 'china': 'China',
    'brazilian': 'Brazil', 'brazil': 'Brazil',
    'colombian': 'Colombia', 'colombia': 'Colombia',
    'mexican': 'Mexico', 'mexico': 'Mexico',
    'turkish': 'Turkey', 'turkey': 'Turkey', 'türkiye': 'Turkey',
    'jordanian': 'Jordan', 'jordan': 'Jordan',
    'lebanese': 'Lebanon', 'lebanon': 'Lebanon',
    'iraqi': 'Iraq', 'iraq': 'Iraq',
    'syrian': 'Syria', 'syria': 'Syria',
    'afghan': 'Afghanistan', 'afghanistan': 'Afghanistan',
    'somali': 'Somalia', 'somalia': 'Somalia',
  };
  for (const [keyword, nation] of Object.entries(nationalityMap)) {
    if (msg.includes(keyword)) { updates.nationality = nation; break; }
  }

  // === Field of study detection (comprehensive) ===
  const fieldMap: [string[], string][] = [
    [['computer science', ' cs ', 'cs,', 'cs.'], 'Computer Science'],
    [['software engineering', 'software development'], 'Software Engineering'],
    [['data science', 'data analytics', 'data analysis'], 'Data Science'],
    [['artificial intelligence', ' ai ', 'machine learning'], 'Artificial Intelligence'],
    [['cybersecurity', 'cyber security', 'information security'], 'Cybersecurity'],
    [['information technology', ' it '], 'Information Technology'],
    [['nursing'], 'Nursing'],
    [['midwifery'], 'Midwifery'],
    [['health promotion'], 'Health Promotion'],
    [['public health'], 'Public Health'],
    [['medicine', 'medical'], 'Medicine'],
    [['pharmacy', 'pharmaceutical'], 'Pharmacy'],
    [['dentistry', 'dental'], 'Dentistry'],
    [['physiotherapy', 'physical therapy'], 'Physiotherapy'],
    [['biomedical'], 'Biomedical Sciences'],
    [['biochemistry'], 'Biochemistry'],
    [['microbiology'], 'Microbiology'],
    [['biology', 'biological'], 'Biology'],
    [['chemistry'], 'Chemistry'],
    [['physics'], 'Physics'],
    [['mathematics', 'maths', 'math'], 'Mathematics'],
    [['statistics'], 'Statistics'],
    [['engineering'], 'Engineering'],
    [['electrical engineering'], 'Electrical Engineering'],
    [['mechanical engineering'], 'Mechanical Engineering'],
    [['civil engineering'], 'Civil Engineering'],
    [['chemical engineering'], 'Chemical Engineering'],
    [['petroleum engineering'], 'Petroleum Engineering'],
    [['architecture'], 'Architecture'],
    [['business administration', 'business', 'mba'], 'Business Administration'],
    [['accounting', 'accountancy'], 'Accounting'],
    [['finance', 'financial'], 'Finance'],
    [['economics'], 'Economics'],
    [['marketing'], 'Marketing'],
    [['management'], 'Management'],
    [['entrepreneurship'], 'Entrepreneurship'],
    [['law', 'legal studies', 'llm', 'llb'], 'Law'],
    [['international relations'], 'International Relations'],
    [['political science', 'politics'], 'Political Science'],
    [['public administration', 'public policy'], 'Public Administration'],
    [['social work'], 'Social Work'],
    [['sociology'], 'Sociology'],
    [['psychology'], 'Psychology'],
    [['education', 'teaching', 'pedagogy'], 'Education'],
    [['linguistics', 'language studies'], 'Linguistics'],
    [['journalism', 'mass communication', 'media studies'], 'Journalism & Media'],
    [['fine arts', 'visual arts', 'art'], 'Fine Arts'],
    [['music'], 'Music'],
    [['theatre', 'theater', 'performing arts'], 'Theatre & Performing Arts'],
    [['agriculture', 'agricultural', 'agronomy'], 'Agriculture'],
    [['environmental science', 'environmental studies'], 'Environmental Science'],
    [['food science', 'food technology'], 'Food Science'],
    [['nutrition', 'dietetics'], 'Nutrition & Dietetics'],
    [['veterinary', 'vet medicine'], 'Veterinary Medicine'],
    [['marine science', 'oceanography'], 'Marine Science'],
    [['geology', 'earth science'], 'Geology'],
    [['geography'], 'Geography'],
    [['history'], 'History'],
    [['philosophy'], 'Philosophy'],
    [['theology', 'divinity', 'religious studies'], 'Theology'],
    [['aviation', 'aeronautics'], 'Aviation'],
    [['maritime', 'nautical'], 'Maritime Studies'],
    [['urban planning', 'town planning'], 'Urban Planning'],
    [['project management'], 'Project Management'],
    [['supply chain', 'logistics'], 'Supply Chain & Logistics'],
    [['human resources', ' hr '], 'Human Resources'],
  ];
  for (const [keywords, field] of fieldMap) {
    if (keywords.some(k => msg.includes(k))) { updates.fieldOfStudy = field; break; }
  }

  // === Degree level ===
  if (msg.includes('masters') || msg.includes("master's") || msg.includes('msc') || msg.includes('ma ') || msg.includes('m.a.') || msg.includes('mba')) updates.degreeLevel = 'masters';
  if (msg.includes('phd') || msg.includes('ph.d') || msg.includes('doctoral') || msg.includes('doctorate')) updates.degreeLevel = 'phd';
  if (msg.includes('undergraduate') || msg.includes('bachelors') || msg.includes("bachelor's") || msg.includes('bsc') || msg.includes('b.sc')) updates.degreeLevel = 'bachelors';
  if (msg.includes('diploma') || msg.includes('certificate') || msg.includes('vocational')) updates.degreeLevel = 'diploma';

  // GPA
  const gpaMatch = msg.match(/(\d+\.?\d*)\s*(?:\/\s*(\d+\.?\d*)|\s*gpa)/i);
  if (gpaMatch) {
    updates.gpaValue = parseFloat(gpaMatch[1]);
    updates.gpaScale = gpaMatch[2] ? parseFloat(gpaMatch[2]) : 4.0;
  }

  // Funding
  if (msg.includes('fully funded') || msg.includes('full scholarship') || msg.includes("can't afford") || msg.includes('free') || msg.includes('no money')) {
    updates.fundingNeeds = 'fully_funded';
  }

  // === Region/country targets (comprehensive) ===
  if (msg.includes('europe') || msg.includes('european')) updates.targetRegions = [...(updates.targetRegions || []), 'Europe'];
  if (msg.includes('asia') || msg.includes('asian')) updates.targetRegions = [...(updates.targetRegions || []), 'Asia'];
  if (msg.includes('north america')) updates.targetRegions = [...(updates.targetRegions || []), 'North America'];
  if (msg.includes('oceania') || msg.includes('australia') || msg.includes('new zealand')) updates.targetRegions = [...(updates.targetRegions || []), 'Oceania'];
  if (msg.includes('middle east')) updates.targetRegions = [...(updates.targetRegions || []), 'Middle East'];
  if (msg.includes('latin america') || msg.includes('south america')) updates.targetRegions = [...(updates.targetRegions || []), 'Latin America'];
  if (msg.includes('africa') && !msg.includes('south africa')) updates.targetRegions = [...(updates.targetRegions || []), 'Africa'];

  const countryTargets: Record<string, string> = {
    'uk': 'United Kingdom', 'united kingdom': 'United Kingdom', 'britain': 'United Kingdom', 'england': 'United Kingdom',
    'germany': 'Germany', 'german': 'Germany',
    'canada': 'Canada', 'canadian': 'Canada',
    'usa': 'United States', 'united states': 'United States', 'america': 'United States',
    'australia': 'Australia', 'australian': 'Australia',
    'new zealand': 'New Zealand',
    'japan': 'Japan', 'japanese': 'Japan',
    'south korea': 'South Korea', 'korea': 'South Korea',
    'china': 'China',
    'france': 'France', 'french': 'France',
    'netherlands': 'Netherlands', 'holland': 'Netherlands', 'dutch': 'Netherlands',
    'sweden': 'Sweden', 'swedish': 'Sweden',
    'norway': 'Norway', 'norwegian': 'Norway',
    'denmark': 'Denmark', 'danish': 'Denmark',
    'finland': 'Finland', 'finnish': 'Finland',
    'switzerland': 'Switzerland', 'swiss': 'Switzerland',
    'italy': 'Italy', 'italian': 'Italy',
    'spain': 'Spain', 'spanish': 'Spain',
    'turkey': 'Turkey', 'türkiye': 'Turkey',
    'hungary': 'Hungary', 'hungarian': 'Hungary',
    'ireland': 'Ireland', 'irish': 'Ireland',
    'belgium': 'Belgium',
    'austria': 'Austria',
    'singapore': 'Singapore',
    'malaysia': 'Malaysia',
    'uae': 'United Arab Emirates', 'dubai': 'United Arab Emirates',
  };
  for (const [keyword, country] of Object.entries(countryTargets)) {
    if (msg.includes(keyword)) {
      updates.targetCountries = [...(updates.targetCountries || []), country];
    }
  }
  // Deduplicate
  if (updates.targetCountries) updates.targetCountries = [...new Set(updates.targetCountries)];
  if (updates.targetRegions) updates.targetRegions = [...new Set(updates.targetRegions)];

  // Work experience
  const expMatch = msg.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|work|professional)/i);
  if (expMatch) {
    updates.workExperienceYears = parseInt(expMatch[1]);
  }
  if (msg.includes('backend') || msg.includes('software') || msg.includes('developer')) {
    updates.workExperienceField = 'Software Engineering';
  }
  if (msg.includes('fintech') || msg.includes('finance')) {
    updates.workExperienceDetails = 'Fintech/financial services';
  }
  if (msg.includes('nurse') || msg.includes('hospital') || msg.includes('clinical')) {
    updates.workExperienceField = 'Healthcare';
  }

  // Determine if we have enough to search
  const mergedProfile = applyProfileUpdates(profile, updates);
  if (mergedProfile.nationality && mergedProfile.fieldOfStudy && mergedProfile.degreeLevel) {
    shouldSearch = true;
  }

  // Generate conversational response
  let responseMessage: string;
  let adviceCards: AdviceCard[] = [];
  let suggestedQuestions: string[] = [];
  let newGoalStage: GoalStage = goalStage;

  if (shouldSearch) {
    responseMessage = `Great — I have a good picture of your profile now! Let me search through our verified database and find the best opportunities for you.`;
    newGoalStage = 'options_researched';
    adviceCards = [
      {
        title: 'Application Strategy',
        body: `With your profile, I recommend applying to scholarships with the nearest deadlines first, then working backward. This gives you the best chance of securing at least one offer.`,
        priority: 'strategic',
        icon: '🎯',
      },
    ];
  } else if (Object.keys(updates).length > 0) {
    const missing: string[] = [];
    if (!mergedProfile.nationality) missing.push('nationality');
    if (!mergedProfile.fieldOfStudy) missing.push('field of study');
    if (!mergedProfile.degreeLevel) missing.push('degree level (Masters, PhD, etc.)');

    responseMessage = `Thanks for sharing! I've noted what you told me. Before I search, I still need to know your ${missing.join(' and ')}. This will dramatically change which opportunities I recommend.`;
    newGoalStage = 'goal_identified';
    suggestedQuestions = missing.map((m) => `What is your ${m}?`);
  } else {
    // If we are in the middle of a conversation, don't reset to the welcome message!
    if (history.length > 0) {
      responseMessage = `I'm here to help, but I need a bit more detail. Could you tell me what course or field of study you're interested in (for example, Nursing, Engineering, or Computer Science)?`;
      suggestedQuestions = ['Nursing', 'Computer Science', 'Business Administration'];
    } else {
      responseMessage = `Welcome to AtlasFind! 👋 I'm your personal scholarship research agent.\n\nI don't just list scholarships. I learn who you are, find what fits you best, and give you real strategic advice.\n\nTell me about yourself: Where are you from? What do you want to study? What degree level? I'll take it from there.`;
      suggestedQuestions = [
        "I'm a Nigerian CS grad with 3.7 GPA, want a fully funded Masters in Europe",
        "Find me PhD scholarships in the UK for engineering",
        "What scholarships can I get with no work experience?",
      ];
    }
  }

  return {
    message: responseMessage,
    shouldSearch,
    profileUpdates: Object.keys(updates).length > 0 ? updates : undefined,
    adviceCards: adviceCards.length > 0 ? adviceCards : undefined,
    suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : undefined,
    goalStage: newGoalStage,
  };
}

// ===== Profile merge =====
function applyProfileUpdates(
  current: UserProfile,
  updates?: GeminiResponse['profileUpdates']
): UserProfile {
  if (!updates) return current;

  const result = { ...current };
  if (updates.nationality) result.nationality = updates.nationality;
  if (updates.fieldOfStudy) result.fieldOfStudy = updates.fieldOfStudy;
  if (updates.degreeLevel) result.degreeLevel = updates.degreeLevel as UserProfile['degreeLevel'];
  if (updates.gpaValue && updates.gpaScale) result.gpa = { value: updates.gpaValue, scale: updates.gpaScale };
  if (updates.fundingNeeds) result.fundingNeeds = updates.fundingNeeds as UserProfile['fundingNeeds'];
  if (updates.targetCountries) result.targetCountries = [...new Set([...result.targetCountries, ...updates.targetCountries])];
  if (updates.targetRegions) result.targetRegions = [...new Set([...result.targetRegions, ...updates.targetRegions])];
  if (updates.workExperienceYears) {
    result.workExperience = {
      years: updates.workExperienceYears,
      field: updates.workExperienceField || result.workExperience?.field || '',
      details: updates.workExperienceDetails || result.workExperience?.details || '',
    };
  }
  if (updates.constraints) result.constraints = [...new Set([...result.constraints, ...updates.constraints])];
  if (updates.languages) result.languages = [...new Set([...result.languages, ...updates.languages])];
  return result;
}

// ===== Context pill builder =====
function buildContextPills(
  newProfile: UserProfile,
  oldProfile: UserProfile
) {
  const pills: { key: string; label: string; icon: string; source: string }[] = [];

  if (newProfile.nationality && newProfile.nationality !== oldProfile.nationality) {
    pills.push({ key: 'nationality', label: newProfile.nationality, icon: '🌍', source: 'this message' });
  }
  if (newProfile.fieldOfStudy && newProfile.fieldOfStudy !== oldProfile.fieldOfStudy) {
    pills.push({ key: 'field', label: newProfile.fieldOfStudy, icon: '📚', source: 'this message' });
  }
  if (newProfile.degreeLevel && newProfile.degreeLevel !== oldProfile.degreeLevel) {
    pills.push({ key: 'degree', label: newProfile.degreeLevel, icon: '🎓', source: 'this message' });
  }
  if (newProfile.gpa && (!oldProfile.gpa || newProfile.gpa.value !== oldProfile.gpa.value)) {
    pills.push({ key: 'gpa', label: `${newProfile.gpa.value}/${newProfile.gpa.scale} GPA`, icon: '📊', source: 'this message' });
  }
  if (newProfile.workExperience && !oldProfile.workExperience) {
    pills.push({ key: 'experience', label: `${newProfile.workExperience.years}yr exp`, icon: '💼', source: 'this message' });
  }
  if (newProfile.fundingNeeds && newProfile.fundingNeeds !== oldProfile.fundingNeeds) {
    pills.push({ key: 'funding', label: newProfile.fundingNeeds.replace('_', ' '), icon: '💰', source: 'this message' });
  }
  if (newProfile.targetRegions.length > oldProfile.targetRegions.length) {
    pills.push({ key: 'region', label: newProfile.targetRegions.join(', '), icon: '🗺️', source: 'this message' });
  }

  return pills;
}
