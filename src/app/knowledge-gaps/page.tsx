import { AlertTriangle, CircleHelp, Repeat2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import { getKnowledgeGaps } from "@/features/knowledge-gaps/services/knowledge-gap.service";
import type { KnowledgeGapSummary } from "@/features/knowledge-gaps/types/knowledge-gap.types";

export const dynamic = "force-dynamic";

export default async function KnowledgeGapsPage() {
  const gapsResult = await loadKnowledgeGaps();

  return (
    <AppShell active="knowledge-gaps">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">
            Knowledge quality
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Knowledge Gaps
          </h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Turn real fallback queries into a prioritized signal for missing or
            insufficient organizational knowledge.
          </p>
        </section>

        {gapsResult.ok ? (
          <KnowledgeGapsContent summary={gapsResult.summary} />
        ) : (
          <Alert variant="destructive">{gapsResult.error}</Alert>
        )}
      </div>
    </AppShell>
  );
}

function KnowledgeGapsContent({ summary }: { summary: KnowledgeGapSummary }) {
  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Unresolved queries"
          value={summary.unresolvedQueries}
        />
        <MetricCard label="Unique gaps" value={summary.uniqueGaps} />
        <MetricCard label="Repeated gaps" value={summary.repeatedGaps} />
        <MetricCard label="Fallback rate" value={summary.fallbackRate} />
      </section>

      <p className="text-sm text-muted-foreground">
        Fallback rate uses eligible knowledge queries as its denominator:
        source-backed answers plus fallback responses. Conversational and
        unscored interactions are excluded. Current eligible population:{" "}
        {summary.eligibleKnowledgeQueries}.
      </p>

      {summary.records.length === 0 ? (
        <div className="rounded-[10px] border bg-card p-8 text-center shadow-sm">
          <CircleHelp
            aria-hidden="true"
            className="mx-auto h-8 w-8 text-primary"
          />
          <p className="mt-3 font-medium">
            No unresolved knowledge gaps have been detected.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            New insufficient-context queries will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto rounded-[10px] border bg-card shadow-sm">
          <table className="min-w-[760px] w-full text-left text-sm">
            <caption className="sr-only">
              Questions that produced the insufficient-context fallback
            </caption>
            <thead className="sticky top-0 bg-surface-subtle text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Unresolved question
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Occurrences
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Latest detection
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.records.map((record) => (
                <tr
                  className="border-t align-top"
                  key={`${record.question}-${record.latestSeenAt}`}
                >
                  <td className="max-w-xl px-4 py-4 font-medium leading-6">
                    {record.question}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2 py-1 font-semibold text-accent-foreground">
                      <Repeat2 aria-hidden="true" className="h-3.5 w-3.5" />
                      {record.occurrences}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDateTime(record.latestSeenAt)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-warning">
                      <AlertTriangle
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                      />
                      {record.reason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[10px] border bg-card p-4 shadow-sm">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

async function loadKnowledgeGaps() {
  try {
    const summary = await getKnowledgeGaps();
    return { ok: true as const, summary };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Knowledge gaps could not be loaded.",
    };
  }
}
