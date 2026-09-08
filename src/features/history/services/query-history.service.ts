import "server-only";

import { parseStoredChatSources } from "@/features/chat/validation/chat-source.schema";
import { getDocumentCategoryLabel } from "@/features/documents/constants/document-categories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { ChatFeedbackValue } from "@/features/chat/types/feedback.types";
import type { QueryHistoryRecord } from "@/features/history/types/history.types";

export async function getQueryHistory(
  limit = 100,
): Promise<QueryHistoryRecord[]> {
  const supabase = createSupabaseAdminClient();
  const [queriesResult, feedbackResult, documentsResult] = await Promise.all([
    supabase
      .from("chat_queries")
      .select(
        "question, answer, sources, confidence_label, had_fallback, response_time_ms, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("chat_feedback")
      .select("question, answer, feedback, created_at")
      .order("created_at", { ascending: false })
      .limit(limit * 2),
    supabase.from("documents").select("id, category"),
  ]);

  if (queriesResult.error) {
    throw new Error(
      `Failed to load query history: ${queriesResult.error.message}`,
    );
  }

  if (feedbackResult.error) {
    throw new Error(
      `Failed to load query feedback: ${feedbackResult.error.message}`,
    );
  }

  if (documentsResult.error) {
    throw new Error(
      `Failed to load history document categories: ${documentsResult.error.message}`,
    );
  }

  const feedbackByResponse = new Map<string, ChatFeedbackValue>();

  for (const feedback of feedbackResult.data ?? []) {
    const key = createResponseKey(feedback.question, feedback.answer);

    if (!feedbackByResponse.has(key)) {
      feedbackByResponse.set(key, feedback.feedback);
    }
  }

  const categoryByDocumentId = new Map(
    (documentsResult.data ?? []).map((document) => [
      document.id,
      getDocumentCategoryLabel(document.category),
    ]),
  );

  return (queriesResult.data ?? []).map((query) => {
    const sources = parseStoredChatSources(query.sources);
    const categories = Array.from(
      new Set(
        sources
          .map((source) => categoryByDocumentId.get(source.documentId))
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return {
      question: query.question,
      answer: query.answer,
      sources,
      categories,
      confidence: query.confidence_label,
      outcome: query.had_fallback
        ? "fallback"
        : sources.length > 0
          ? "source-backed"
          : "conversational",
      responseTimeMs: query.response_time_ms,
      createdAt: query.created_at,
      feedback:
        feedbackByResponse.get(
          createResponseKey(query.question, query.answer),
        ) ?? null,
    };
  });
}

function createResponseKey(question: string, answer: string): string {
  return `${question}\u0000${answer}`;
}
