import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { formatEmbeddingForPgvector } from "@/lib/ai/embedding.service";
import { createSupabaseAdminClient, type Database } from "@/lib/supabase/admin";

import type { RetrievedDocumentChunk } from "@/features/documents/types/document.types";

const DEFAULT_MATCH_COUNT = 5;
export const DEFAULT_SIMILARITY_THRESHOLD = 0.25;

export async function findRelevantDocumentChunks(
  questionEmbedding: number[],
  matchCount = DEFAULT_MATCH_COUNT,
  similarityThreshold = DEFAULT_SIMILARITY_THRESHOLD,
): Promise<RetrievedDocumentChunk[]> {
  const supabase = createSupabaseAdminClient();
  const data = await matchDocumentChunks(
    supabase,
    questionEmbedding,
    matchCount,
    similarityThreshold,
  );

  return (data ?? []).map((chunk) => ({
    id: chunk.id,
    documentId: chunk.document_id,
    documentName: chunk.document_name,
    content: chunk.content,
    source: chunk.source,
    chunkIndex: chunk.chunk_index,
    similarity: chunk.similarity,
  }));
}

type MatchDocumentChunkRow =
  Database["public"]["Functions"]["match_document_chunks"]["Returns"][number];

type LegacyRpcClient = {
  rpc: (
    functionName: "match_document_chunks",
    args: {
      query_embedding: string;
      match_count: number;
      similarity_threshold: number;
    },
  ) => Promise<{ data: MatchDocumentChunkRow[] | null; error: Error | null }>;
};

async function matchDocumentChunks(
  supabase: SupabaseClient<Database, "public">,
  questionEmbedding: number[],
  matchCount: number,
  similarityThreshold: number,
): Promise<MatchDocumentChunkRow[]> {
  const queryEmbedding = formatEmbeddingForPgvector(questionEmbedding);
  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: similarityThreshold,
    match_count: matchCount,
  });

  if (!error) {
    const matches = data ?? [];

    if (matches.length > 0) {
      return matches;
    }

    return matchDocumentChunksInApplication(
      supabase,
      questionEmbedding,
      matchCount,
      similarityThreshold,
    );
  }

  const legacyResult = await (supabase as unknown as LegacyRpcClient).rpc(
    "match_document_chunks",
    {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      similarity_threshold: similarityThreshold,
    },
  );

  if (legacyResult.error) {
    throw new Error(
      `Failed to search document chunks: ${legacyResult.error.message}`,
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.info(
      "[RAG retrieval] used legacy match_document_chunks RPC arguments; rerun db/migrations/003_create_similarity_search_function.sql",
    );
  }

  const legacyMatches = legacyResult.data ?? [];

  if (legacyMatches.length > 0) {
    return legacyMatches;
  }

  return matchDocumentChunksInApplication(
    supabase,
    questionEmbedding,
    matchCount,
    similarityThreshold,
  );
}

async function matchDocumentChunksInApplication(
  supabase: SupabaseClient<Database, "public">,
  questionEmbedding: number[],
  matchCount: number,
  similarityThreshold: number,
): Promise<MatchDocumentChunkRow[]> {
  const { data: chunks, error: chunksError } = await supabase
    .from("document_chunks")
    .select("id, document_id, content, source, chunk_index, embedding");

  if (chunksError) {
    throw new Error(`Failed to load document chunks: ${chunksError.message}`);
  }

  if (!chunks || chunks.length === 0) {
    return [];
  }

  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("id, name");

  if (documentsError) {
    throw new Error(`Failed to load documents: ${documentsError.message}`);
  }

  const documentNames = new Map(
    (documents ?? []).map((document) => [document.id, document.name]),
  );
  const normalizedQueryEmbedding = normalizeVector(questionEmbedding);

  const matches = chunks
    .map((chunk) => {
      if (!chunk.embedding) {
        return null;
      }

      const storedEmbedding = normalizeVector(parsePgvector(chunk.embedding));

      return {
        id: chunk.id,
        document_id: chunk.document_id,
        content: chunk.content,
        source: chunk.source,
        chunk_index: chunk.chunk_index,
        document_name: documentNames.get(chunk.document_id) ?? chunk.source,
        similarity: cosineSimilarity(normalizedQueryEmbedding, storedEmbedding),
      };
    })
    .filter((chunk): chunk is MatchDocumentChunkRow => chunk !== null)
    .filter((chunk) => chunk.similarity > similarityThreshold)
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, matchCount);

  if (process.env.NODE_ENV === "development") {
    console.info(
      "[RAG retrieval] used application cosine fallback because pgvector RPC returned no rows",
    );
  }

  return matches;
}

function parsePgvector(value: string): number[] {
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => Number(item));
}

function normalizeVector(values: number[]): number[] {
  const magnitude = Math.sqrt(
    values.reduce((sum, value) => sum + value * value, 0),
  );

  if (magnitude === 0) {
    return values;
  }

  return values.map((value) => value / magnitude);
}

function cosineSimilarity(left: number[], right: number[]): number {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}
