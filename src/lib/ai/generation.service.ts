import "server-only";

import { generateText } from "ai";

import { createGeminiGenerationModel } from "@/lib/ai/gemini.client";

export async function generateAnswer(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: createGeminiGenerationModel(),
    prompt,
    temperature: 0.2,
    maxOutputTokens: 500,
  });

  return text.trim();
}
