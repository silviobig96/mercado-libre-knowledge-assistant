import type { DocumentCategory } from "@/features/documents/constants/document-categories";
import type {
  DocumentSourceType,
  DocumentStatus,
} from "@/features/documents/constants/document-metadata";

export type DocumentRecord = {
  id: string;
  name: string;
  category: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
  chunkCount: number;
  sourceType: string | null;
  country: string | null;
  status: DocumentStatus | null;
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
  sourceType: DocumentSourceType;
  country: string;
  status: DocumentStatus;
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
