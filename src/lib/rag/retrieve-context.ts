import "server-only";

import { findRelevantDocumentChunks } from "@/features/documents/services/document-query.service";

import type { RetrievedDocumentChunk } from "@/features/documents/types/document.types";

export async function retrieveRelevantContext(
  questionEmbedding: number[],
): Promise<RetrievedDocumentChunk[]> {
  return findRelevantDocumentChunks(questionEmbedding);
}
