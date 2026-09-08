import "server-only";

import { parseStoredChatSources } from "@/features/chat/validation/chat-source.schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type {
  KnowledgeGapRecord,
  KnowledgeGapSummary,
} from "@/features/knowledge-gaps/types/knowledge-gap.types";

export async function getKnowledgeGaps(): Promise<KnowledgeGapSummary> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("chat_queries")
    .select("question, sources, had_fallback, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load knowledge gaps: ${error.message}`);
  }

  const queries = data ?? [];
  const fallbackQueries = queries.filter((query) => query.had_fallback);
  const sourceBackedQueries = queries.filter(
    (query) =>
      !query.had_fallback && parseStoredChatSources(query.sources).length > 0,
  );
  const eligibleKnowledgeQueries =
    fallbackQueries.length + sourceBackedQueries.length;
  const groupedGaps = new Map<string, KnowledgeGapRecord>();

  for (const query of fallbackQueries) {
    const key = normalizeQuestion(query.question);
    const current = groupedGaps.get(key);

    if (current) {
      current.occurrences += 1;
      current.firstSeenAt = query.created_at;
      continue;
    }

    groupedGaps.set(key, {
      question: query.question,
      occurrences: 1,
      firstSeenAt: query.created_at,
      latestSeenAt: query.created_at,
      reason: "No qualifying context retrieved",
    });
  }

  const records = Array.from(groupedGaps.values()).sort(
    (left, right) =>
      right.occurrences - left.occurrences ||
      Date.parse(right.latestSeenAt) - Date.parse(left.latestSeenAt),
  );

  return {
    unresolvedQueries: fallbackQueries.length,
    uniqueGaps: records.length,
    repeatedGaps: records.filter((record) => record.occurrences > 1).length,
    eligibleKnowledgeQueries,
    fallbackRate: formatRate(fallbackQueries.length, eligibleKnowledgeQueries),
    records,
  };
}

function normalizeQuestion(question: string): string {
  return question
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("es-AR")
    .replace(/[¿?¡!.,;:]+$/g, "")
    .replace(/\s+/g, " ");
}

function formatRate(numerator: number, denominator: number): string {
  if (denominator === 0) {
    return "No eligible queries yet";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}
