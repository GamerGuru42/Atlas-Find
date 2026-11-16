import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { getAIModel, isAIConfigured } from '@/lib/ai/config';
import { verifyAdminAccess } from '@/lib/auth/adminAuth';
import { z } from 'zod';

const OpportunityEnrichmentSchema = z.object({
  title: z.string(),
  sponsor: z.string(),
  type: z.enum(['SCHOLARSHIP', 'INTERNSHIP', 'FELLOWSHIP', 'GRANT', 'EXCHANGE']),
  hostCountry: z.string(),
  degreeLevel: z.array(z.string()),
  fundingType: z.enum(['fully_funded', 'partial', 'self_funded']),
  coverageDetails: z.object({
    tuition: z.string().optional(),
    stipend: z.string().optional(),
    travel: z.string().optional(),
    health: z.string().optional(),
  }),
  description: z.string(),
  eligibility: z.string(),
  tags: z.array(z.string()),
});

export async function POST(req: Request) {
  const adminCheck = verifyAdminAccess(req);
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: 'AI service is currently not configured on this environment.' },
      { status: 503 }
    );
  }

  try {
    const { applyUrl, title } = await req.json();

    if (!applyUrl) {
      return NextResponse.json({ error: 'applyUrl is required' }, { status: 400 });
    }

    const prompt = `Analyze this opportunity title and application URL to generate structured metadata for admin verification:
Title: ${title || 'Unknown'}
URL: ${applyUrl}

Provide accurate fields for degree level, funding coverage, host country, description, and eligibility criteria.`;

    const { object } = await generateObject({
      model: getAIModel('default'),
      schema: OpportunityEnrichmentSchema,
      prompt,
    });

    return NextResponse.json({ success: true, enrichedData: object });
  } catch (error) {
    console.error('AI Enrichment Error:', error);
    return NextResponse.json({ error: 'Failed to enrich opportunity data' }, { status: 500 });
  }
}
