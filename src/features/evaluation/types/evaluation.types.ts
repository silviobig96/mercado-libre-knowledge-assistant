export type EvaluationMetrics = {
  uploadedDocuments: number;
  indexedChunks: number;
  totalFeedback: number;
  helpfulFeedback: number;
  notHelpfulFeedback: number;
  helpfulPercentage: string;
  knowledgeBaseStatus: "Ready" | "Needs documents";
  demoQuestions: number;
  averageExpectedResponseTime: string;
  groundedAnswerRequirement: string;
};
