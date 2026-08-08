import { Clock3, History, MessageSquareText } from "lucide-react";

import { SourceList } from "@/components/chat/source-list";
import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import { getQueryHistory } from "@/features/history/services/query-history.service";
import type {
  QueryHistoryRecord,
  QueryOutcome,
} from "@/features/history/types/history.types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const historyResult = await loadHistory();

  return (
    <AppShell active="history">
      <div className="space-y-6">
        <PageHeading />
        {historyResult.ok ? (
          <HistoryContent records={historyResult.records} />
        ) : (
          <Alert variant="destructive">{historyResult.error}</Alert>
        )}
      </div>
    </AppShell>
  );
}

function PageHeading() {
  return (
    <section className="max-w-3xl">
      <p className="text-sm font-semibold text-dark-blue">Agent workspace</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">History</h2>
      <p className="mt-2 leading-7 text-muted-foreground">
        Review previous questions, answer outcomes, retrieved evidence,
        confidence, response time, and recorded feedback.
      </p>
    </section>
  );
}

function HistoryContent({ records }: { records: QueryHistoryRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="rounded-[10px] border bg-card p-8 text-center shadow-sm">
        <History aria-hidden="true" className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 font-medium">No questions have been recorded yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          New Assistant interactions will appear here after they are processed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border bg-card shadow-sm">
      <div className="border-b px-4 py-3 text-sm text-muted-foreground sm:px-5">
        Showing the {records.length} most recent recorded interactions.
      </div>
      <div className="divide-y">
        {records.map((record, index) => (
          <details key={`${record.createdAt}-${index}`}>
            <summary className="grid cursor-pointer list-none gap-3 px-4 py-4 transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <p className="truncate font-medium">{record.question}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <OutcomeBadge outcome={record.outcome} />
                  {record.confidence && (
                    <span>Confidence: {record.confidence}</span>
                  )}
                  {record.categories.map((category) => (
                    <span
                      className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground"
                      key={category}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                {formatDateTime(record.createdAt)}
              </div>
            </summary>
            <div className="border-t bg-surface-subtle px-4 py-5 sm:px-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquareText
                      aria-hidden="true"
                      className="h-4 w-4 text-primary"
                    />
                    Answer
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                    {record.answer}
                  </p>
                  <SourceList sources={record.sources} />
                </div>
                <dl className="grid content-start gap-3 rounded-lg border bg-card p-4 text-sm">
                  <Detail
                    label="Outcome"
                    value={getOutcomeLabel(record.outcome)}
                  />
                  <Detail
                    label="Confidence"
                    value={record.confidence ?? "Not scored"}
                  />
                  <Detail
                    label="Response time"
                    value={`${record.responseTimeMs} ms`}
                  />
                  <Detail
                    label="Feedback"
                    value={
                      record.feedback === "helpful"
                        ? "Helpful"
                        : record.feedback === "not_helpful"
                          ? "Not helpful"
                          : "Not rated"
                    }
                  />
                </dl>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: QueryOutcome }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-semibold",
        outcome === "source-backed" && "bg-success/10 text-success",
        outcome === "fallback" && "bg-brand-yellow/25 text-warning",
        outcome === "conversational" &&
          "bg-surface-subtle text-muted-foreground",
      )}
    >
      {getOutcomeLabel(outcome)}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function getOutcomeLabel(outcome: QueryOutcome): string {
  const labels: Record<QueryOutcome, string> = {
    "source-backed": "Answered with sources",
    fallback: "Fallback",
    conversational: "Conversational / unscored",
  };

  return labels[outcome];
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

async function loadHistory() {
  try {
    const records = await getQueryHistory();
    return { ok: true as const, records };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Query history could not be loaded.",
    };
  }
}
