import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL_ID, isAIConfigured } from '@/lib/ai/config';

export { GEMINI_MODEL_ID };

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

let client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!isAIConfigured() || !apiKey) return null;
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Simple in-memory cache with 6-hour TTL
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}
