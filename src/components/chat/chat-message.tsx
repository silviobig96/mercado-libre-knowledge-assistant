"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  RAG_FALLBACK_GUIDANCE,
  RAG_FALLBACK_MESSAGE,
} from "@/features/chat/constants/chat-copy";
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
  const isFallback = message.content === RAG_FALLBACK_MESSAGE;
  const [copied, setCopied] = useState(false);

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

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
        {isFallback && (
          <p className="mt-2 rounded-md bg-brand-yellow/15 p-2 text-xs leading-5 text-muted-foreground">
            {RAG_FALLBACK_GUIDANCE}
          </p>
        )}
        {!isUser && (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold",
                  message.sources?.length
                    ? "bg-success/10 text-success"
                    : "bg-surface-subtle text-muted-foreground",
                )}
              >
                {message.sources?.length
                  ? "Source-backed"
                  : "No verified sources"}
              </span>
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => void copyAnswer()}
                size="sm"
                type="button"
                variant="ghost"
              >
                {copied ? (
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                ) : (
                  <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy answer"}
              </Button>
            </div>
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
