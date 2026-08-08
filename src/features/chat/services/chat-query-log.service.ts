import "server-only";

import { RAG_FALLBACK_MESSAGE } from "@/features/chat/constants/chat-copy";
import { createSupabaseAdminClient, type Json } from "@/lib/supabase/admin";

import type {
  ChatResponse,
  ChatSource,
} from "@/features/chat/types/chat.types";

export type SaveChatQueryLogInput = {
  question: string;
  response: ChatResponse;
  responseTimeMs: number;
};

export async function saveChatQueryLog({
  question,
  response,
  responseTimeMs,
}: SaveChatQueryLogInput): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("chat_queries").insert({
    question,
    answer: response.answer,
    sources: serializeSources(response.sources),
    confidence_label: response.confidence,
    top_similarity_score: getTopSimilarityScore(response.sources),
    had_fallback: response.answer === RAG_FALLBACK_MESSAGE,
    response_time_ms: responseTimeMs,
  });

  if (error) {
    throw new Error(`Failed to save chat query log: ${error.message}`);
  }
}

function getTopSimilarityScore(sources: ChatSource[]): number | null {
  return sources[0]?.similarity ?? null;
}

function serializeSources(sources: ChatSource[]): Json {
  return sources.map((source) => ({
    id: source.id,
    documentId: source.documentId,
    documentName: source.documentName,
    source: source.source,
    chunkIndex: source.chunkIndex,
    similarity: source.similarity,
    excerpt: source.excerpt,
  }));
}
