/**
 * @file ai.ts
 * @description This file is responsible for initializing and exporting the AI provider instance for server-side use.
 * Groq is the primary provider, with OpenRouter as a fallback, then Gemini as a final fallback.
 */
import { createAIProvider, AIProvider } from './aiProvider.js';

// Create the AI provider with primary/fallback logic
// Groq is tried first, then OpenRouter, then Gemini on failure
export const ai: AIProvider = createAIProvider();