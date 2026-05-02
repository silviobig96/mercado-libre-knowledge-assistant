import { cn } from "@/lib/utils";
import type { ChatSource } from "@/features/chat/types/chat.types";

import { SourceList } from "@/components/chat/source-list";

export type ChatMessageModel = {
  id: string;
  role: "user" | "assistant";
  content: string;
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
          "max-w-[85%] rounded-lg border px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "border-primary bg-primary text-primary-foreground"
            : "bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && <SourceList sources={message.sources ?? []} />}
      </div>
    </article>
  );
}
