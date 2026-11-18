import test from 'node:test';
import assert from 'node:assert';

// Simulated model runner matching the chat route's fallback architecture
interface MockModel {
  id: string;
  failBeforeStart?: boolean;
  chunks: string[];
}

async function simulateChatStream(primaryModel: MockModel, fallbackModel: MockModel) {
  let activeModelUsed = 'primary';
  let firstChunk: string | null = null;
  let remainingChunks: string[] = [];

  // Step 1: Attempt Primary Model
  try {
    if (primaryModel.failBeforeStart) {
      throw new Error('503 UNAVAILABLE Model High Demand');
    }
    firstChunk = primaryModel.chunks[0] || null;
    remainingChunks = primaryModel.chunks.slice(1);
    activeModelUsed = 'primary';
  } catch (primaryErr: any) {
    // Step 2: Primary failed before streaming started -> Try Fallback
    try {
      if (fallbackModel.failBeforeStart) {
        throw new Error('503 UNAVAILABLE Fallback High Demand');
      }
      firstChunk = fallbackModel.chunks[0] || null;
      remainingChunks = fallbackModel.chunks.slice(1);
      activeModelUsed = 'fallback';
    } catch (fallbackErr: any) {
      // Step 3: Both failed before streaming started
      return {
        status: 503,
        error: 'The AI advisor is temporarily experiencing high upstream demand from Google AI services. Please try again in a few moments.',
        modelUsed: null,
        fullText: null,
      };
    }
  }

  // Step 4: Stream response without switching mid-stream
  const chunksReceived: string[] = [];
  if (firstChunk) chunksReceived.push(firstChunk);
  for (const chunk of remainingChunks) {
    chunksReceived.push(chunk);
  }

  return {
    status: 200,
    modelUsed: activeModelUsed === 'primary' ? primaryModel.id : fallbackModel.id,
    firstChunk,
    fullText: chunksReceived.join(''),
  };
}

test('Chat Fallback Scenario A: Successful streaming on primary model from first chunk through completion', async () => {
  const primary: MockModel = {
    id: 'gemini-3.8-flash',
    chunks: ['Welcome to AtlasFind! ', 'Here is your personalized roadmap.'],
  };
  const fallback: MockModel = {
    id: 'gemini-3.7-flash',
    chunks: ['Fallback chunk.'],
  };

  const result = await simulateChatStream(primary, fallback);

  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.modelUsed, 'gemini-3.8-flash');
  assert.strictEqual(result.firstChunk, 'Welcome to AtlasFind! ');
  assert.strictEqual(result.fullText, 'Welcome to AtlasFind! Here is your personalized roadmap.');
});

test('Chat Fallback Scenario B: Primary failure triggers successful fallback to gemini-3.7-flash', async () => {
  const primary: MockModel = {
    id: 'gemini-3.8-flash',
    failBeforeStart: true,
    chunks: [],
  };
  const fallback: MockModel = {
    id: 'gemini-3.7-flash',
    chunks: ['Fallback response active. ', 'Here are the matching opportunities.'],
  };

  const result = await simulateChatStream(primary, fallback);

  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.modelUsed, 'gemini-3.7-flash');
  assert.strictEqual(result.firstChunk, 'Fallback response active. ');
  assert.strictEqual(result.fullText, 'Fallback response active. Here are the matching opportunities.');
});

test('Chat Fallback Scenario C: Both models fail -> returns prompt honest 503 error without hanging', async () => {
  const primary: MockModel = {
    id: 'gemini-3.8-flash',
    failBeforeStart: true,
    chunks: [],
  };
  const fallback: MockModel = {
    id: 'gemini-3.7-flash',
    failBeforeStart: true,
    chunks: [],
  };

  const result = await simulateChatStream(primary, fallback);

  assert.strictEqual(result.status, 503);
  assert.strictEqual(result.modelUsed, null);
  assert.ok(result.error?.includes('high upstream demand from Google AI services'));
  assert.strictEqual(result.fullText, null);
});
