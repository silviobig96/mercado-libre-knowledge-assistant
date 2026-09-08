export type RankedUsageItem = {
  label: string;
  count: number;
};

export type RecentKnowledgeGap = {
  question: string;
  createdAt: string;
};

export type AnalyticsMetrics = {
  uploadedDocuments: number;
  indexedChunks: number;
  categoriesCovered: number;
  knowledgeBaseStatus: "Ready" | "Needs documents";
  totalQueries: number;
  sourceBackedAnswers: number;
  fallbackQueries: number;
  conversationalOrUnscoredQueries: number;
  eligibleKnowledgeQueries: number;
  sourceBackedRate: string;
  fallbackRate: string;
  averageResponseTime: string;
  confidenceRatedAnswers: number;
  highConfidenceAnswers: number;
  mediumConfidenceAnswers: number;
  lowConfidenceAnswers: number;
  unratedSourceBackedAnswers: number;
  totalFeedback: number;
  helpfulFeedback: number;
  notHelpfulFeedback: number;
  helpfulRate: string;
  topDocuments: RankedUsageItem[];
  topCategories: RankedUsageItem[];
  recentKnowledgeGaps: RecentKnowledgeGap[];
};
