export type EvaluationMetrics = {
  uploadedDocuments: number;
  indexedChunks: number;
  knowledgeBaseStatus: "Ready" | "Needs documents";
  demoQuestions: number;
  averageExpectedResponseTime: string;
  groundedAnswerRequirement: string;
};
