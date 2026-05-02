"use client";

import { Button } from "@/components/ui/button";
import { suggestedQuestions } from "@/features/chat/constants/suggested-questions";

type SuggestedQuestionsProps = {
  disabled?: boolean;
  onSelect: (question: string) => Promise<void>;
};

export function SuggestedQuestions({
  disabled = false,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <section aria-label="Suggested demo questions" className="space-y-2">
      <p className="text-sm font-medium">Suggested demo questions</p>
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((question) => (
          <Button
            className="h-auto max-w-full whitespace-normal text-left"
            disabled={disabled}
            key={question}
            onClick={() => void onSelect(question)}
            type="button"
            variant="outline"
          >
            {question}
          </Button>
        ))}
      </div>
    </section>
  );
}
