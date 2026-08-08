import "server-only";

import { parseStoredChatSources } from "@/features/chat/validation/chat-source.schema";
import { getDocumentCategoryLabel } from "@/features/documents/constants/document-categories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type {
  AnalyticsMetrics,
  RankedUsageItem,
} from "@/features/analytics/types/analytics.types";
import type { ConfidenceLevel } from "@/features/chat/types/chat.types";

export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  const supabase = createSupabaseAdminClient();
  const [documentsResult, chunksResult, feedbackResult, queriesResult] =
    await Promise.all([
      supabase.from("documents").select("id, name, category"),
      supabase
        .from("document_chunks")
        .select("id", { count: "exact", head: true }),
      supabase.from("chat_feedback").select("feedback"),
      supabase
        .from("chat_queries")
        .select(
          "question, sources, confidence_label, had_fallback, response_time_ms, created_at",
        )
        .order("created_at", { ascending: false }),
    ]);

  if (documentsResult.error) {
    throw new Error(
      `Failed to load document metrics: ${documentsResult.error.message}`,
    );
  }

  if (chunksResult.error) {
    throw new Error(
      `Failed to count indexed chunks: ${chunksResult.error.message}`,
    );
  }

  if (feedbackResult.error) {
    throw new Error(
      `Failed to load feedback metrics: ${feedbackResult.error.message}`,
    );
  }

  if (queriesResult.error) {
    throw new Error(
      `Failed to load query metrics: ${queriesResult.error.message}`,
    );
  }

  const documents = documentsResult.data ?? [];
  const feedback = feedbackResult.data ?? [];
  const queries = (queriesResult.data ?? []).map((query) => ({
    ...query,
    parsedSources: parseStoredChatSources(query.sources),
  }));
  const sourceBackedQueries = queries.filter(
    (query) => !query.had_fallback && query.parsedSources.length > 0,
  );
  const fallbackQueries = queries.filter((query) => query.had_fallback);
  const eligibleKnowledgeQueries =
    sourceBackedQueries.length + fallbackQueries.length;
  const conversationalOrUnscoredQueries = Math.max(
    queries.length - eligibleKnowledgeQueries,
    0,
  );
  const confidenceRatedQueries = sourceBackedQueries.filter(
    (query) => query.confidence_label !== null,
  );
  const helpfulFeedback = feedback.filter(
    (item) => item.feedback === "helpful",
  ).length;
  const categoryByDocumentId = new Map(
    documents.map((document) => [
      document.id,
      getDocumentCategoryLabel(document.category),
    ]),
  );

  return {
    uploadedDocuments: documents.length,
    indexedChunks: chunksResult.count ?? 0,
    categoriesCovered: new Set(documents.map((document) => document.category))
      .size,
    knowledgeBaseStatus:
      documents.length > 0 && (chunksResult.count ?? 0) > 0
        ? "Ready"
        : "Needs documents",
    totalQueries: queries.length,
    sourceBackedAnswers: sourceBackedQueries.length,
    fallbackQueries: fallbackQueries.length,
    conversationalOrUnscoredQueries,
    eligibleKnowledgeQueries,
    sourceBackedRate: formatRate(
      sourceBackedQueries.length,
      eligibleKnowledgeQueries,
      "No eligible queries yet",
    ),
    fallbackRate: formatRate(
      fallbackQueries.length,
      eligibleKnowledgeQueries,
      "No eligible queries yet",
    ),
    averageResponseTime: formatAverageResponseTime(
      queries.map((query) => query.response_time_ms),
    ),
    confidenceRatedAnswers: confidenceRatedQueries.length,
    highConfidenceAnswers: countConfidence(confidenceRatedQueries, "High"),
    mediumConfidenceAnswers: countConfidence(confidenceRatedQueries, "Medium"),
    lowConfidenceAnswers: countConfidence(confidenceRatedQueries, "Low"),
    unratedSourceBackedAnswers:
      sourceBackedQueries.length - confidenceRatedQueries.length,
    totalFeedback: feedback.length,
    helpfulFeedback,
    notHelpfulFeedback: feedback.length - helpfulFeedback,
    helpfulRate: formatRate(
      helpfulFeedback,
      feedback.length,
      "No feedback yet",
    ),
    topDocuments: rankUsage(
      sourceBackedQueries.flatMap((query) =>
        query.parsedSources.map((source) => source.documentName),
      ),
    ),
    topCategories: rankUsage(
      sourceBackedQueries.flatMap((query) =>
        query.parsedSources
          .map((source) => categoryByDocumentId.get(source.documentId))
          .filter((category): category is string => Boolean(category)),
      ),
    ),
    recentKnowledgeGaps: fallbackQueries.slice(0, 5).map((query) => ({
      question: query.question,
      createdAt: query.created_at,
    })),
  };
}

function formatRate(
  numerator: number,
  denominator: number,
  emptyLabel: string,
): string {
  if (denominator === 0) {
    return emptyLabel;
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function formatAverageResponseTime(responseTimes: number[]): string {
  if (responseTimes.length === 0) {
    return "No queries yet";
  }

  const total = responseTimes.reduce((sum, value) => sum + value, 0);

  return `${Math.round(total / responseTimes.length)} ms`;
}

function countConfidence(
  queries: { confidence_label: ConfidenceLevel | null }[],
  confidence: ConfidenceLevel,
): number {
  return queries.filter((query) => query.confidence_label === confidence)
    .length;
}

function rankUsage(labels: string[], limit = 5): RankedUsageItem[] {
  const counts = new Map<string, number>();

  for (const label of labels) {
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts, ([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
}
