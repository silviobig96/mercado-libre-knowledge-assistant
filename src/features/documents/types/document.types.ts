import type { DocumentCategory } from "@/features/documents/constants/document-categories";

export type DocumentRecord = {
  id: string;
  name: string;
  category: DocumentCategory;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
  chunkCount: number;
};

export type DocumentChunkInsert = {
  documentId: string;
  content: string;
  source: string;
  chunkIndex: number;
  embedding: string;
};

export type UploadDocumentResult = {
  success: true;
  documentId: string;
  documentName: string;
  category: DocumentCategory;
  chunkCount: number;
};

export type DeleteDocumentResult = {
  success: true;
  documentId: string;
  documentName: string;
};

export type RetrievedDocumentChunk = {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  source: string;
  chunkIndex: number;
  similarity: number;
};
