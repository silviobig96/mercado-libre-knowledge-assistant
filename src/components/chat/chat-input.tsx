"use client";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  disabled?: boolean;
  onSubmit: (question: string) => Promise<void>;
};

export function ChatInput({ disabled = false, onSubmit }: ChatInputProps) {
  const [question, setQuestion] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    setQuestion("");
    await onSubmit(trimmedQuestion);
  }

  return (
    <form
      className="rounded-lg border border-primary/20 bg-accent/25 p-3 shadow-sm sm:p-4"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="question">
        Ask a Mercado Libre Marketplace knowledge question
      </label>
      <Textarea
        className="min-h-28 resize-none border-input bg-card text-base shadow-sm"
        disabled={disabled}
        id="question"
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask about returns, claims, refunds, Mercado Envíos, or marketplace procedures..."
        value={question}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="hidden text-xs text-muted-foreground sm:block">
          Responses use only qualifying knowledge-base sources.
        </p>
        <Button disabled={disabled || !question.trim()} type="submit">
          <SendHorizontal aria-hidden="true" className="h-4 w-4" />
          Send
        </Button>
      </div>
    </form>
  );
}
