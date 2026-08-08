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
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="question">
        Ask a Mercado Libre Marketplace knowledge question
      </label>
      <Textarea
        className="min-h-24 resize-none border-input bg-card shadow-sm"
        disabled={disabled}
        id="question"
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask about returns, claims, refunds, Mercado Envíos, or marketplace procedures..."
        value={question}
      />
      <div className="flex justify-end">
        <Button disabled={disabled || !question.trim()} type="submit">
          <SendHorizontal aria-hidden="true" className="h-4 w-4" />
          Send
        </Button>
      </div>
    </form>
  );
}
