import { NextResponse } from 'next/server';
import { googleAI } from '@/lib/ai/config';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const aiConfigured = !!(key && key.trim().length > 0 && !key.includes('placeholder'));
  
  let availableModels: string[] = [];
  if (searchParams.get('listModels') === 'true' && aiConfigured) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await res.json();
      if (Array.isArray(data?.models)) {
        availableModels = data.models.map((m: any) => m.name?.replace('models/', '')).filter(Boolean);
      }
    } catch (e) {
      console.error('[Health API] Failed to list models from Google API:', e);
    }
  }

  let modelDetails: any = null;
  const inspectModel = searchParams.get('inspectModel');
  if (inspectModel && aiConfigured) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${inspectModel}?key=${key}`);
      modelDetails = await res.json();
    } catch (e: any) {
      modelDetails = { error: e?.message };
    }
  }

  let modelTestResult: any = null;
  const testModel = searchParams.get('testModel');
  if (testModel && aiConfigured) {
    const t0 = Date.now();
    try {
      const res = await generateText({
        model: googleAI(testModel),
        prompt: 'Respond with exactly: MODEL_VERIFIED_SUCCESSFUL',
        maxRetries: 1,
        abortSignal: AbortSignal.timeout(12000),
      });
      modelTestResult = {
        model: testModel,
        status: 200,
        durationMs: Date.now() - t0,
        output: res.text.trim(),
      };
    } catch (e: any) {
      modelTestResult = {
        model: testModel,
        status: e?.statusCode || 500,
        durationMs: Date.now() - t0,
        error: e?.message || String(e),
      };
    }
  }

  return NextResponse.json({
    status: 'ok',
    aiConfigured,
    ...(availableModels.length > 0 ? { availableModels } : {}),
    ...(modelDetails ? { modelDetails } : {}),
    ...(modelTestResult ? { modelTestResult } : {}),
  });
}
