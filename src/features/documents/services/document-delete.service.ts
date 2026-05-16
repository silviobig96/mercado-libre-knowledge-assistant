import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type { DeleteDocumentResult } from "@/features/documents/types/document.types";

export class DocumentNotFoundError extends Error {
  constructor(documentId: string) {
    super(`Document ${documentId} was not found.`);
    this.name = "DocumentNotFoundError";
  }
}

export async function deleteUploadedDocument(
  documentId: string,
): Promise<DeleteDocumentResult> {
  const supabase = createSupabaseAdminClient();
  const { data: deletedDocument, error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .select("id, name")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }

  if (!deletedDocument) {
    throw new DocumentNotFoundError(documentId);
  }

  return {
    success: true,
    documentId: deletedDocument.id,
    documentName: deletedDocument.name,
  };
}
