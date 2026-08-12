import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Use the Vercel AI SDK & Google provider once fully configured, 
// but for the Alpha MVP fallback we will reuse our orchestrated logic if needed.
// We are importing the generic fallback for now until env variables are set.
import { SYSTEM_PROMPT } from '@/lib/gemini/prompts/systemPrompt';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const from = params.get('From'); // e.g., whatsapp:+1234567890
    const body = params.get('Body') || '';
    

    // Here we will eventually:
    // 1. Fetch user from DB using 'from' (Prisma)
    // 2. If no user, create one.
    // 3. Fetch conversation history from DB.
    // 4. Send to Gemini using the Vercel AI SDK.
    // 5. Save the updated profile and response back to DB.
    
    // For now, we simulate the AI processing and return a clean formatted response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    let responseMessage = '';

    if (body.toLowerCase().includes('hi') || body.toLowerCase().includes('hello')) {
      responseMessage = `*Welcome to AtlasFind!* 👋\n\nI'm your personal scholarship research AI. I don't just list scholarships—I learn who you are, find what fits you best, and guide you through the process.\n\nTell me about yourself:\n🌍 Where are you from?\n📚 What do you want to study?\n🎓 What degree level (Bachelors, Masters, PhD)?`;
    } else {
      responseMessage = `*Got it!* I'm currently running in Alpha mode without a connected database.\n\nOnce my brain is fully plugged in, I will search for verified scholarships matching: _"${body}"_ and reply right here!\n\n*(This is a simulated AI response)*`;
    }

    twiml.message(responseMessage);

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
