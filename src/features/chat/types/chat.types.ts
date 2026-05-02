export type ChatSource = {
  documentId: string;
  documentName: string;
  source: string;
  similarity: number;
};

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
};
