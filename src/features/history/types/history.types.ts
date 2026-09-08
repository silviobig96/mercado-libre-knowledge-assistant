import type {
  ChatSource,
  ConfidenceLevel,
} from "@/features/chat/types/chat.types";
import type { ChatFeedbackValue } from "@/features/chat/types/feedback.types";

export type QueryOutcome = "source-backed" | "fallback" | "conversational";

export type QueryHistoryRecord = {
  question: string;
  answer: string;
  sources: ChatSource[];
  categories: string[];
  confidence: ConfidenceLevel | null;
  outcome: QueryOutcome;
  responseTimeMs: number;
  createdAt: string;
  feedback: ChatFeedbackValue | null;
};
