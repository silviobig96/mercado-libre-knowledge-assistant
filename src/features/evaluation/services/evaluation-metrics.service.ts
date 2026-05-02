import "server-only";

import { suggestedQuestions } from "@/features/chat/constants/suggested-questions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { EvaluationMetrics } from "@/features/evaluation/types/evaluation.types";

export async function getEvaluationMetrics(): Promise<EvaluationMetrics> {
  const supabase = createSupabaseAdminClient();
  const [documentsResult, chunksResult] = await Promise.all([
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase
      .from("document_chunks")
      .select("id", { count: "exact", head: true }),
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

  const uploadedDocuments = documentsResult.count ?? 0;
  const indexedChunks = chunksResult.count ?? 0;

  return {
    uploadedDocuments,
    indexedChunks,
    knowledgeBaseStatus:
      uploadedDocuments > 0 && indexedChunks > 0 ? "Ready" : "Needs documents",
    demoQuestions: suggestedQuestions.length,
    averageExpectedResponseTime: "Demo target: under 10 seconds",
    groundedAnswerRequirement: "Answers must use retrieved context and sources",
  };
}
