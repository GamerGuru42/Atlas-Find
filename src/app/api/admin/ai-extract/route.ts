import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import * as cheerio from 'cheerio';

function checkAdminAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'atlasadmin';
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url, rawText } = await request.json();

    if (!url && !rawText) {
      return NextResponse.json(
        { error: 'Must provide either url or rawText' },
        { status: 400 }
      );
    }

    let textToProcess = rawText || '';

    // If url provided and no rawText, try to fetch and extract text
    if (url && !rawText) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AtlasFindBot/1.0',
          },
        });
        if (response.ok) {
          const html = await response.text();
          const $ = cheerio.load(html);
          // Remove scripts, styles, etc.
          $('script, style, nav, footer, header, noscript, iframe').remove();
          textToProcess = $('body').text().replace(/\s+/g, ' ').trim();
        }
      } catch (e) {
        console.warn('Failed to fetch URL directly, falling back to basic extraction or empty', e);
      }
    }

    if (!textToProcess) {
      return NextResponse.json(
        { error: 'Could not extract text from URL and no rawText provided.' },
        { status: 400 }
      );
    }

    // Use Gemini to extract data
    // Restrict text to avoid token limits if the page is huge
    const textSample = textToProcess.slice(0, 15000);

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        title: z.string().optional().describe('The name of the scholarship, fellowship, or opportunity.'),
        sponsor: z.string().optional().describe('The organization, university, or government sponsoring the opportunity.'),
        description: z.string().optional().describe('A brief summary of the opportunity (max 300 characters).'),
        eligibility: z.string().optional().describe('Key eligibility requirements.'),
        hostCountry: z.string().optional().describe('The country where the opportunity takes place.'),
        continent: z.string().optional().describe('The continent where the host country is located, e.g., Europe, Asia, North America.'),
      }),
      prompt: `Extract structured information about an academic or professional opportunity from the following text.\n\nText:\n${textSample}`,
    });

    return NextResponse.json({ extracted: object });
  } catch (error) {
    console.error('AI Extraction Error:', error);
    return NextResponse.json(
      { error: 'Failed to extract information using AI' },
      { status: 500 }
    );
  }
}
