"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useId, useState } from "react";

import type { ChatSource } from "@/features/chat/types/chat.types";
import { cn } from "@/lib/utils";

type SourceListProps = {
  sources: ChatSource[];
};

export function SourceList({ sources }: SourceListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t pt-3">
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-md px-0 py-1 text-left text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:text-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        <span>Sources ({sources.length})</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul className="mt-2 grid gap-2" id={contentId}>
          {sources.map((source) => (
            <li
              className="rounded-md border border-primary/15 bg-accent px-3 py-2 text-xs text-accent-foreground"
              key={`${source.id}-${source.chunkIndex}`}
            >
              <div className="flex flex-wrap items-center gap-2 font-medium">
                <FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{source.documentName}</span>
                <span className="rounded-sm bg-background/70 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  Chunk {source.chunkIndex + 1}
                </span>
                <span className="rounded-sm bg-background/70 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {Math.round(source.similarity * 100)}% match
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-muted-foreground">
                {source.excerpt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
