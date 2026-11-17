/**
 * AtlasFind - Centralized AI Model & Provider Configuration
 *
 * Centralizes the active Google Gemini model configurations across all seven agents,
 * API route handlers, and shared utilities.
 *
 * Supported Production Models:
 * - Default: gemini-3.8-flash (Fast, accurate, production-supported)
 * - Reasoning: gemini-3.8-pro (In-depth analysis and complex document review)
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Centralized Model Identifiers
export const GEMINI_MODEL_ID = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
export const GEMINI_REASONING_MODEL_ID = process.env.GEMINI_REASONING_MODEL || 'gemini-3.8-pro';

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
export function getAIModel(tier: 'default' | 'reasoning' = 'default') {
  const modelId = tier === 'reasoning' ? GEMINI_REASONING_MODEL_ID : GEMINI_MODEL_ID;
  return googleAI(modelId);
}

/**
 * Standard generation parameters
 */
export const AI_CONFIG = {
  defaultModelId: GEMINI_MODEL_ID,
  reasoningModelId: GEMINI_REASONING_MODEL_ID,
  streamingTimeoutSeconds: 60,
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

