import { NextResponse } from 'next/server';

export async function GET() {
  const aiConfigured = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  return NextResponse.json({
    status: 'ok',
    aiConfigured,
  });
}
