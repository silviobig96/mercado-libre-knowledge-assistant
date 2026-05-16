import "server-only";

import { suggestedQuestions } from "@/features/chat/constants/suggested-questions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { EvaluationMetrics } from "@/features/evaluation/types/evaluation.types";

export async function getEvaluationMetrics(): Promise<EvaluationMetrics> {
  const supabase = createSupabaseAdminClient();
  const [
    documentsResult,
    chunksResult,
    feedbackResult,
    helpfulResult,
    chatQueriesResult,
  ] = await Promise.all([
    supabase.from("documents").select("id, category"),
    supabase
      .from("document_chunks")
      .select("id", { count: "exact", head: true }),
    supabase.from("chat_feedback").select("id", { count: "exact", head: true }),
    supabase
      .from("chat_feedback")
      .select("id", { count: "exact", head: true })
      .eq("feedback", "helpful"),
    supabase
      .from("chat_queries")
      .select("confidence_label, had_fallback, response_time_ms"),
  ]);

  if (documentsResult.error) {
    throw new Error(
      `Failed to count uploaded documents: ${documentsResult.error.message}`,
    );
  }

  if (chunksResult.error) {
    throw new Error(
      `Failed to count indexed chunks: ${chunksResult.error.message}`,
    );
  }

  if (feedbackResult.error) {
    throw new Error(
      `Failed to count chat feedback: ${feedbackResult.error.message}`,
    );
  }

  if (helpfulResult.error) {
    throw new Error(
      `Failed to count helpful feedback: ${helpfulResult.error.message}`,
    );
  }

  if (chatQueriesResult.error) {
    throw new Error(
      `Failed to load chat query metrics: ${chatQueriesResult.error.message}`,
    );
  }

  const documents = documentsResult.data ?? [];
  const chatQueries = chatQueriesResult.data ?? [];
  const uploadedDocuments = documents.length;
  const indexedChunks = chunksResult.count ?? 0;
  const totalFeedback = feedbackResult.count ?? 0;
  const helpfulFeedback = helpfulResult.count ?? 0;
  const notHelpfulFeedback = totalFeedback - helpfulFeedback;
  const fallbackQuestions = chatQueries.filter(
    (query) => query.had_fallback,
  ).length;
  const answeredWithContext = chatQueries.length - fallbackQuestions;

  return {
    uploadedDocuments,
    indexedChunks,
    totalQuestions: chatQueries.length,
    answeredWithContext,
    fallbackQuestions,
    averageResponseTime: formatAverageResponseTime(
      chatQueries.map((query) => query.response_time_ms),
    ),
    highConfidenceAnswers: countConfidence(chatQueries, "High"),
    mediumConfidenceAnswers: countConfidence(chatQueries, "Medium"),
    lowConfidenceAnswers: countConfidence(chatQueries, "Low"),
    totalFeedback,
    helpfulFeedback,
    notHelpfulFeedback,
    helpfulPercentage: formatHelpfulPercentage(helpfulFeedback, totalFeedback),
    categoriesCovered: formatCategoriesCovered(
      documents.map((document) => document.category),
    ),
    knowledgeBaseStatus:
      uploadedDocuments > 0 && indexedChunks > 0 ? "Ready" : "Needs documents",
    demoQuestions: suggestedQuestions.length,
    groundedAnswerRequirement: "Answers must use retrieved context and sources",
  };
}

function formatHelpfulPercentage(helpful: number, total: number): string {
  if (total === 0) {
    return "No feedback yet";
  }

  return `${Math.round((helpful / total) * 100)}%`;
}

function formatAverageResponseTime(responseTimes: number[]): string {
  if (responseTimes.length === 0) {
    return "No questions yet";
  }

  const totalResponseTime = responseTimes.reduce(
    (total, responseTime) => total + responseTime,
    0,
  );

  return `${Math.round(totalResponseTime / responseTimes.length)} ms`;
}

function countConfidence(
  queries: { confidence_label: string | null }[],
  confidence: "High" | "Medium" | "Low",
): number {
  return queries.filter((query) => query.confidence_label === confidence)
    .length;
}

function formatCategoriesCovered(categories: string[]): string {
  const uniqueCategories = new Set(
    categories.filter((category) => category.trim().length > 0),
  );

  if (uniqueCategories.size === 0) {
    return "No categories yet";
  }

  return String(uniqueCategories.size);
}
