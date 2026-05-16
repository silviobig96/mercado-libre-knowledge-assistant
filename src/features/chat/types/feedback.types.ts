import type { ChatSource } from "@/features/chat/types/chat.types";

export type ChatFeedbackValue = "helpful" | "not_helpful";

export type SaveChatFeedbackInput = {
  question: string;
  answer: string;
  sources: ChatSource[];
  feedback: ChatFeedbackValue;
};

export type SaveChatFeedbackResult = {
  success: true;
};
