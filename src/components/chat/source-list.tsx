import { FileText } from "lucide-react";

import type { ChatSource } from "@/features/chat/types/chat.types";

type SourceListProps = {
  sources: ChatSource[];
};

export function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t pt-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Sources
      </p>
      <ul className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <li
            className="inline-flex max-w-full items-center gap-2 rounded-md bg-accent px-2.5 py-1.5 text-xs text-accent-foreground"
            key={source.documentId}
            title={`${source.documentName} (${Math.round(
              source.similarity * 100,
            )}% match)`}
          >
            <FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{source.documentName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
