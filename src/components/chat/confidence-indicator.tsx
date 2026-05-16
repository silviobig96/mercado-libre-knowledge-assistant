import type { ConfidenceLevel } from "@/features/chat/types/chat.types";
import { cn } from "@/lib/utils";

type ConfidenceIndicatorProps = {
  confidence: ConfidenceLevel | null | undefined;
};

export function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  if (!confidence) {
    return null;
  }

  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Confidence:{" "}
      <span
        className={cn(
          "font-medium",
          confidence === "High" && "text-primary",
          confidence === "Medium" && "text-foreground",
          confidence === "Low" && "text-destructive",
        )}
      >
        {confidence}
      </span>
    </p>
  );
}
