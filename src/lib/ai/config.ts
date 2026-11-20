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

// Centralized Model Identifiers
export const GEMINI_MODEL_ID = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
export const GEMINI_FALLBACK_MODEL_ID = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.7-flash';
export const GEMINI_RESILIENCE_MODEL_ID = process.env.GEMINI_RESILIENCE_MODEL || 'gemini-3.5-flash';

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
export function getAIModel(tier: 'primary' | 'fallback' | 'resilience' | 'default' = 'primary') {
  let modelId = GEMINI_MODEL_ID;
  if (tier === 'fallback') {
    modelId = GEMINI_FALLBACK_MODEL_ID;
  } else if (tier === 'resilience') {
    modelId = GEMINI_RESILIENCE_MODEL_ID;
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
