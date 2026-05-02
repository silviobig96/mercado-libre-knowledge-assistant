import "server-only";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";

import { getServerEnv } from "@/lib/validation/env";

export const GEMINI_GENERATION_MODEL = "gemini-2.5-flash-lite";
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
export const GEMINI_EMBEDDING_DIMENSIONS = 768;

export function createGeminiEmbeddingClient() {
  const env = getServerEnv();

  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export function createGeminiGenerationModel() {
  const env = getServerEnv();
  const google = createGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
  });

  return google(GEMINI_GENERATION_MODEL);
}
