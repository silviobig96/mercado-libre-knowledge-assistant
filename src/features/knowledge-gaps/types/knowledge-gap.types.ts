export type KnowledgeGapRecord = {
  question: string;
  occurrences: number;
  firstSeenAt: string;
  latestSeenAt: string;
  reason: "No qualifying context retrieved";
};

export type KnowledgeGapSummary = {
  unresolvedQueries: number;
  uniqueGaps: number;
  repeatedGaps: number;
  eligibleKnowledgeQueries: number;
  fallbackRate: string;
  records: KnowledgeGapRecord[];
};
