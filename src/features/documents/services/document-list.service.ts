import "server-only";

import { DEFAULT_DOCUMENT_CATEGORY } from "@/features/documents/constants/document-categories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { DocumentRecord } from "@/features/documents/types/document.types";

export async function listUploadedDocuments(): Promise<DocumentRecord[]> {
  const supabase = createSupabaseAdminClient();
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("id, name, category, mime_type, size_bytes, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (documentsError) {
    throw new Error(`Failed to load documents: ${documentsError.message}`);
  }

  const { data: chunks, error: chunksError } = await supabase
    .from("document_chunks")
    .select("document_id");

  if (chunksError) {
    throw new Error(`Failed to load document chunks: ${chunksError.message}`);
  }

  const chunkCounts = new Map<string, number>();

  for (const chunk of chunks ?? []) {
    chunkCounts.set(
      chunk.document_id,
      (chunkCounts.get(chunk.document_id) ?? 0) + 1,
    );
  }

  return (documents ?? []).map((document) => ({
    id: document.id,
    name: document.name,
    category: document.category?.trim() || DEFAULT_DOCUMENT_CATEGORY,
    mimeType: document.mime_type,
    sizeBytes: document.size_bytes,
    createdAt: document.created_at,
    chunkCount: chunkCounts.get(document.id) ?? 0,
  }));
}
