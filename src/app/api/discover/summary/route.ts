import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { searchParams, opportunitiesCount, topOpportunities } = await req.json();

    const instructions = `You are a helpful AI assistant for the Atlas-Find scholarship and opportunity search platform.
The user is currently browsing the Discover page with specific search filters.
Currently, there are ${opportunitiesCount} opportunities matching their criteria.
The top opportunities currently visible include:
${topOpportunities.map((o: any) => `- ${o.title} in ${o.hostCountry} by ${o.sponsor} (Deadline: ${new Date(o.deadline).toDateString()})`).join('\n')}

Based on the search parameters (Filters: ${JSON.stringify(searchParams)}), generate a short, conversational summary (2-3 paragraphs max) about what the user is looking at. 
Offer some helpful advice on what to apply to first or what trends you see in these opportunities. 
If no filters are applied, just give a general summary of the wide range of opportunities available right now.
Be encouraging and helpful. Use markdown.
Do NOT hallucinate opportunities that aren't in the list provided.`;

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages: [{ role: 'user', content: "Please summarize the current opportunities." }],
      system: instructions,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Summary Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate summary' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
