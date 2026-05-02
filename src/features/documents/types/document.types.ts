export type DocumentRecord = {
  id: string;
  name: string;
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
  chunkCount: number;
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
