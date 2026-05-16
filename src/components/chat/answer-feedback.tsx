"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ChatSource } from "@/features/chat/types/chat.types";
import type { ChatFeedbackValue } from "@/features/chat/types/feedback.types";

type AnswerFeedbackProps = {
  answer: string;
  question: string;
  sources: ChatSource[];
};

type FeedbackApiSuccess = {
  success: true;
};

type FeedbackApiError = {
  error: string;
};

export function AnswerFeedback({
  answer,
  question,
  sources,
}: AnswerFeedbackProps) {
  const [selectedFeedback, setSelectedFeedback] =
    useState<ChatFeedbackValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitFeedback(feedback: ChatFeedbackValue) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/chat/feedback", {
        body: JSON.stringify({
          answer,
          feedback,
          question,
          sources,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as
        | FeedbackApiSuccess
        | FeedbackApiError;

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Unable to save feedback.",
        );
      }

      setSelectedFeedback(feedback);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save feedback.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Was this answer helpful?
        </span>
        <Button
          disabled={isSubmitting || selectedFeedback !== null}
          onClick={() => void submitFeedback("helpful")}
          size="sm"
          type="button"
          variant={selectedFeedback === "helpful" ? "secondary" : "outline"}
        >
          <ThumbsUp aria-hidden="true" className="h-3.5 w-3.5" />
          Helpful
        </Button>
        <Button
          disabled={isSubmitting || selectedFeedback !== null}
          onClick={() => void submitFeedback("not_helpful")}
          size="sm"
          type="button"
          variant={selectedFeedback === "not_helpful" ? "secondary" : "outline"}
        >
          <ThumbsDown aria-hidden="true" className="h-3.5 w-3.5" />
          Not helpful
        </Button>
        {selectedFeedback && (
          <span className="text-xs text-muted-foreground">Feedback saved.</span>
        )}
      </div>
      {errorMessage && (
        <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
