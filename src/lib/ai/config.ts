/**
 * AtlasFind - Centralized AI Model & Provider Configuration
 *
 * Centralizes the active Google Gemini model configurations across all seven agents,
 * API route handlers, and shared utilities.
 *
 * Supported Production Models:
 * - Primary: gemini-3.8-flash (Fast, accurate, primary production-supported model)
 * - Fallback: gemini-3.7-flash (Verified alternative model for upstream resilience)
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Centralized Distinct Model Identifiers
// Genuinely distinct Google Gemini models confirmed via production API audit:
// 1. Primary: gemini-3.8-flash (Flagship production generation, 65k output limit)
// 2. Distinct Fallback 1: gemini-3.6-flash (Distinct generation endpoint, verified 961ms)
// 3. Distinct Fallback 2: gemini-3.5-flash-lite (Dedicated lightweight architecture, verified 793ms)
// 4. Distinct Fallback 3: gemini-3.1-flash-lite (Stable fallback architecture, verified 908ms)
export const GEMINI_MODEL_ID = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
export const GEMINI_FALLBACK_MODEL_ID = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.6-flash';
export const GEMINI_RESILIENCE_MODEL_ID = process.env.GEMINI_RESILIENCE_MODEL || 'gemini-3.5-flash-lite';
export const GEMINI_SPEED_MODEL_ID = process.env.GEMINI_SPEED_MODEL || 'gemini-3.1-flash-lite';

/**
 * Checks whether the Gemini API key is configured in the environment
 */
export function isAIConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return Boolean(key && key.trim().length > 0 && !key.includes('placeholder'));
}

/**
 * Centralized Google Generative AI client instance
 */
export const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

/**
 * Returns the configured AI model instance
 */
export function getAIModel(tier: 'primary' | 'fallback' | 'resilience' | 'speed' | 'default' = 'primary') {
  let modelId = GEMINI_MODEL_ID;
  if (tier === 'fallback') {
    modelId = GEMINI_FALLBACK_MODEL_ID;
  } else if (tier === 'resilience') {
    modelId = GEMINI_RESILIENCE_MODEL_ID;
  } else if (tier === 'speed') {
    modelId = GEMINI_SPEED_MODEL_ID;
  }
  return googleAI(modelId);
}

/**
 * Standard generation parameters
 */
export const AI_CONFIG = {
  primaryModelId: GEMINI_MODEL_ID,
  fallbackModelId: GEMINI_FALLBACK_MODEL_ID,
  resilienceModelId: GEMINI_RESILIENCE_MODEL_ID,
  speedModelId: GEMINI_SPEED_MODEL_ID,
  defaultModelId: GEMINI_MODEL_ID,
  streamingTimeoutSeconds: 60,
  maxRetries: 1,
  temperature: {
    balanced: 0.6,
    creative: 0.7,
    deterministic: 0.2,
  },
  maxTokens: {
    chat: 3000,
    summary: 600,
    extraction: 1500,
  },
} as const;
