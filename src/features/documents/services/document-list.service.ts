import "server-only";

import { DEFAULT_DOCUMENT_CATEGORY } from "@/features/documents/constants/document-categories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { DocumentRecord } from "@/features/documents/types/document.types";

export async function listUploadedDocuments(
  limit = 100,
): Promise<DocumentRecord[]> {
  const supabase = createSupabaseAdminClient();
  const documentsWithGovernance = await supabase
    .from("documents")
    .select(
      "id, name, category, source_type, country, status, mime_type, size_bytes, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  let documents: DocumentListRow[];

  if (documentsWithGovernance.error) {
    if (
      !isMissingGovernanceColumnError(documentsWithGovernance.error.message)
    ) {
      throw new Error(
        `Failed to load documents: ${documentsWithGovernance.error.message}`,
      );
    }

    const legacyDocuments = await supabase
      .from("documents")
      .select("id, name, category, mime_type, size_bytes, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (legacyDocuments.error) {
      throw new Error(
        `Failed to load documents: ${legacyDocuments.error.message}`,
      );
    }

    documents = (legacyDocuments.data ?? []).map((document) => ({
      ...document,
      source_type: null,
      country: null,
      status: null,
    }));
  } else {
    documents = documentsWithGovernance.data ?? [];
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

  return documents.map((document) => ({
    id: document.id,
    name: document.name,
    category: document.category?.trim() || DEFAULT_DOCUMENT_CATEGORY,
    mimeType: document.mime_type,
    sizeBytes: document.size_bytes,
    createdAt: document.created_at,
    chunkCount: chunkCounts.get(document.id) ?? 0,
    sourceType: document.source_type,
    country: document.country,
    status: document.status,
  }));
}

type DocumentListRow = {
  id: string;
  name: string;
  category: string;
  source_type: string | null;
  country: string | null;
  status: DocumentRecord["status"];
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

function isMissingGovernanceColumnError(message: string): boolean {
  return ["source_type", "country", "status"].some((column) =>
    message.includes(column),
  );
}
