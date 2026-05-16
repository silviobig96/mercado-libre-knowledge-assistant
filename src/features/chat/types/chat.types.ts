export type ChatSource = {
  id: string;
  documentId: string;
  documentName: string;
  source: string;
  chunkIndex: number;
  similarity: number;
  excerpt: string;
};

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
  confidence: ConfidenceLevel | null;
};
