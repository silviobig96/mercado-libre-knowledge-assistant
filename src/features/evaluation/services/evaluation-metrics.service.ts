import "server-only";

import { suggestedQuestions } from "@/features/chat/constants/suggested-questions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { EvaluationMetrics } from "@/features/evaluation/types/evaluation.types";

export async function getEvaluationMetrics(): Promise<EvaluationMetrics> {
  const supabase = createSupabaseAdminClient();
  const [documentsResult, chunksResult, feedbackResult, helpfulResult] =
    await Promise.all([
      supabase.from("documents").select("id", { count: "exact", head: true }),
      supabase
        .from("document_chunks")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("chat_feedback")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("chat_feedback")
        .select("id", { count: "exact", head: true })
        .eq("feedback", "helpful"),
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

  const uploadedDocuments = documentsResult.count ?? 0;
  const indexedChunks = chunksResult.count ?? 0;
  const totalFeedback = feedbackResult.count ?? 0;
  const helpfulFeedback = helpfulResult.count ?? 0;
  const notHelpfulFeedback = totalFeedback - helpfulFeedback;

  return {
    uploadedDocuments,
    indexedChunks,
    totalFeedback,
    helpfulFeedback,
    notHelpfulFeedback,
    helpfulPercentage: formatHelpfulPercentage(helpfulFeedback, totalFeedback),
    knowledgeBaseStatus:
      uploadedDocuments > 0 && indexedChunks > 0 ? "Ready" : "Needs documents",
    demoQuestions: suggestedQuestions.length,
    averageExpectedResponseTime: "Demo target: under 10 seconds",
    groundedAnswerRequirement: "Answers must use retrieved context and sources",
  };
}

function formatHelpfulPercentage(helpful: number, total: number): string {
  if (total === 0) {
    return "No feedback yet";
  }

  return `${Math.round((helpful / total) * 100)}%`;
}
