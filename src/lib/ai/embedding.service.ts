import "server-only";

import {
  createGeminiEmbeddingClient,
  GEMINI_EMBEDDING_DIMENSIONS,
  GEMINI_EMBEDDING_MODEL,
} from "@/lib/ai/gemini.client";

function normalizeVector(values: number[]): number[] {
  const magnitude = Math.sqrt(
    values.reduce((sum, value) => sum + value * value, 0),
  );

  if (magnitude === 0) {
    return values;
  }

  return values.map((value) => value / magnitude);
}

export function formatEmbeddingForPgvector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = createGeminiEmbeddingClient();
  const response = await client.models.embedContent({
    model: GEMINI_EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: GEMINI_EMBEDDING_DIMENSIONS,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length !== GEMINI_EMBEDDING_DIMENSIONS) {
    throw new Error("Gemini did not return a valid embedding.");
  }

  return normalizeVector(embedding);
}
