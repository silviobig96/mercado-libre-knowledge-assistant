import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { DocumentRecord } from "@/features/documents/types/document.types";

export async function listUploadedDocuments(): Promise<DocumentRecord[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, name, mime_type, size_bytes, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Failed to load documents: ${error.message}`);
  }

  return (data ?? []).map((document) => ({
    id: document.id,
    name: document.name,
    mimeType: document.mime_type,
    sizeBytes: document.size_bytes,
    createdAt: document.created_at,
  }));
}
