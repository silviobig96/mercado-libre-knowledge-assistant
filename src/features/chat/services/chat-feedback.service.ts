import "server-only";

import { createSupabaseAdminClient, type Json } from "@/lib/supabase/admin";

import type {
  SaveChatFeedbackInput,
  SaveChatFeedbackResult,
} from "@/features/chat/types/feedback.types";
import type { ChatSource } from "@/features/chat/types/chat.types";

export async function saveChatFeedback(
  input: SaveChatFeedbackInput,
): Promise<SaveChatFeedbackResult> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("chat_feedback").insert({
    question: input.question,
    answer: input.answer,
    sources: serializeSources(input.sources),
    feedback: input.feedback,
  });

  if (error) {
    throw new Error(`Failed to save chat feedback: ${error.message}`);
  }

  return { success: true };
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
