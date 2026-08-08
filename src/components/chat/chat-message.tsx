import { cn } from "@/lib/utils";
import type {
  ChatSource,
  ConfidenceLevel,
} from "@/features/chat/types/chat.types";

import { AnswerFeedback } from "@/components/chat/answer-feedback";
import { ConfidenceIndicator } from "@/components/chat/confidence-indicator";
import { SourceList } from "@/components/chat/source-list";

export type ChatMessageModel = {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: ConfidenceLevel | null;
  question?: string;
  sources?: ChatSource[];
};

type ChatMessageProps = {
  message: ChatMessageModel;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[92%] rounded-lg border px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[82%]",
          isUser
            ? "border-primary/25 bg-accent text-foreground"
            : "bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && (
          <>
            <ConfidenceIndicator confidence={message.confidence} />
            <SourceList sources={message.sources ?? []} />
            {message.question && (
              <AnswerFeedback
                answer={message.content}
                question={message.question}
                sources={message.sources ?? []}
              />
            )}
          </>
        )}
      </div>
    </article>
  );
}
