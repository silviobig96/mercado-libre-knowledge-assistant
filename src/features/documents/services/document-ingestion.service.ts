import "server-only";

import {
  generateEmbedding,
  formatEmbeddingForPgvector,
} from "@/lib/ai/embedding.service";
import { extractPdfText } from "@/lib/pdf/extract-pdf-text";
import { chunkText } from "@/lib/rag/chunk-text";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import {
  DEFAULT_DOCUMENT_CATEGORY,
  isDocumentCategory,
  type DocumentCategory,
} from "@/features/documents/constants/document-categories";
import type {
  DocumentChunkInsert,
  UploadDocumentResult,
} from "@/features/documents/types/document.types";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export async function ingestPdfDocument(
  file: File,
  categoryInput: unknown = DEFAULT_DOCUMENT_CATEGORY,
): Promise<UploadDocumentResult> {
  validatePdfFile(file);
  const category = parseDocumentCategory(categoryInput);

  const buffer = Buffer.from(await file.arrayBuffer());
  const extractedText = await extractPdfText(buffer);

  if (!extractedText) {
    throw new Error("The PDF does not contain extractable text.");
  }

  const chunks = chunkText(extractedText);

  if (chunks.length === 0) {
    throw new Error("The PDF text could not be split into searchable chunks.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: document, error: documentError } = await supabase
    .from("documents")
    .insert({
      name: file.name,
      category,
      mime_type: file.type || "application/pdf",
      size_bytes: file.size,
    })
    .select("id, name, category")
    .single();

  if (documentError) {
    throw new Error(
      `Failed to store document metadata: ${documentError.message}`,
    );
  }

  const chunkRows = await Promise.all(
    chunks.map(async (chunk): Promise<DocumentChunkInsert> => {
      const embedding = await generateEmbedding(chunk.content);

      return {
        documentId: document.id,
        content: chunk.content,
        source: file.name,
        chunkIndex: chunk.chunkIndex,
        embedding: formatEmbeddingForPgvector(embedding),
      };
    }),
  );

  const { error: chunksError } = await supabase.from("document_chunks").insert(
    chunkRows.map((chunk) => ({
      document_id: chunk.documentId,
      content: chunk.content,
      source: chunk.source,
      chunk_index: chunk.chunkIndex,
      embedding: chunk.embedding,
    })),
  );

  if (chunksError) {
    await supabase.from("documents").delete().eq("id", document.id);
    throw new Error(`Failed to store document chunks: ${chunksError.message}`);
  }

  return {
    success: true,
    documentId: document.id,
    documentName: document.name,
    category: parseDocumentCategory(document.category),
    chunkCount: chunks.length,
  };
}

function validatePdfFile(file: File) {
  if (!file) {
    throw new Error("A PDF file is required.");
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error("The PDF must be 10 MB or smaller.");
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    throw new Error("Only PDF files are supported.");
  }
}

function parseDocumentCategory(category: unknown): DocumentCategory {
  if (isDocumentCategory(category)) {
    return category;
  }

  if (category === null || category === undefined || category === "") {
    return DEFAULT_DOCUMENT_CATEGORY;
  }

  throw new Error("Invalid document category.");
}
