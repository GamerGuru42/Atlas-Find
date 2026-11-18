import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const aiConfigured = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  let availableModels: string[] = [];
  if (searchParams.get('listModels') === 'true' && aiConfigured) {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
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

  let modelTestResult: any = null;
  const testModel = searchParams.get('testModel');
  if (testModel && aiConfigured) {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    try {
      const t0 = Date.now();
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with exactly: MODEL_VERIFIED_SUCCESSFUL' }] }]
        })
      });
      const data = await res.json();
      modelTestResult = {
        model: testModel,
        status: res.status,
        durationMs: Date.now() - t0,
        output: data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null,
        error: data?.error?.message || null,
      };
    } catch (e: any) {
      modelTestResult = { model: testModel, error: e?.message };
    }
  }

  return NextResponse.json({
    status: 'ok',
    aiConfigured,
    ...(availableModels.length > 0 ? { availableModels } : {}),
    ...(modelTestResult ? { modelTestResult } : {}),
  });
}
