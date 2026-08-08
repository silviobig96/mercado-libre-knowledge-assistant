import {
  AlertTriangle,
  Clock3,
  Database,
  FileCheck2,
  Gauge,
  MessageSquareText,
  ThumbsUp,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import { getAnalyticsMetrics } from "@/features/analytics/services/analytics-metrics.service";
import type {
  AnalyticsMetrics,
  RankedUsageItem,
} from "@/features/analytics/types/analytics.types";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const metricsResult = await loadMetrics();

  return (
    <AppShell active="analytics">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">
            Supervisor workspace
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Analytics
          </h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Monitor knowledge-base coverage, usage, answer grounding, fallback
            behavior, confidence, performance, and user feedback from real
            persisted data.
          </p>
        </section>

        {metricsResult.ok ? (
          <AnalyticsContent metrics={metricsResult.metrics} />
        ) : (
          <Alert variant="destructive">
            Metrics could not be loaded. {metricsResult.error}
          </Alert>
        )}
      </div>
    </AppShell>
  );
}

function AnalyticsContent({ metrics }: { metrics: AnalyticsMetrics }) {
  return (
    <>
      <section aria-labelledby="overview-title" className="space-y-3">
        <h3 className="text-lg font-semibold" id="overview-title">
          Overview
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            icon={MessageSquareText}
            label="Total queries"
            value={metrics.totalQueries}
          />
          <MetricCard
            icon={FileCheck2}
            label="Source-backed rate"
            tone="success"
            value={metrics.sourceBackedRate}
          />
          <MetricCard
            icon={AlertTriangle}
            label="Fallback rate"
            tone="warning"
            value={metrics.fallbackRate}
          />
          <MetricCard
            icon={ThumbsUp}
            label="Helpful rate"
            tone="success"
            value={metrics.helpfulRate}
          />
          <MetricCard
            icon={Clock3}
            label="Average response time"
            value={metrics.averageResponseTime}
          />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Source-backed and fallback rates use{" "}
          {metrics.eligibleKnowledgeQueries} eligible knowledge queries as their
          population: {metrics.sourceBackedAnswers} source-backed +{" "}
          {metrics.fallbackQueries} fallback.{" "}
          {metrics.conversationalOrUnscoredQueries} conversational or unscored
          interactions are excluded from those rates.
        </p>
      </section>

      <section aria-labelledby="knowledge-base-title" className="space-y-3">
        <h3 className="text-lg font-semibold" id="knowledge-base-title">
          Knowledge Base
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Database}
            label="Uploaded documents"
            value={metrics.uploadedDocuments}
          />
          <MetricCard
            icon={Database}
            label="Indexed chunks"
            value={metrics.indexedChunks}
          />
          <MetricCard
            icon={Database}
            label="Categories covered"
            value={metrics.categoriesCovered}
          />
          <MetricCard
            icon={Gauge}
            label="Readiness"
            tone={
              metrics.knowledgeBaseStatus === "Ready" ? "success" : "warning"
            }
            value={metrics.knowledgeBaseStatus}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[10px] border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">Answer quality</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Confidence distribution applies only to rated, source-backed
            answers—not fallback or conversational responses.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <DataPoint label="Rated" value={metrics.confidenceRatedAnswers} />
            <DataPoint label="High" value={metrics.highConfidenceAnswers} />
            <DataPoint label="Medium" value={metrics.mediumConfidenceAnswers} />
            <DataPoint label="Low" value={metrics.lowConfidenceAnswers} />
          </dl>
          {metrics.unratedSourceBackedAnswers > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {metrics.unratedSourceBackedAnswers} source-backed answers were
              not confidence-rated.
            </p>
          )}
        </div>

        <div className="rounded-[10px] border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">User feedback</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Helpful rate is helpful feedback divided by all recorded ratings.
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            <DataPoint label="Total" value={metrics.totalFeedback} />
            <DataPoint label="Helpful" value={metrics.helpfulFeedback} />
            <DataPoint label="Not helpful" value={metrics.notHelpfulFeedback} />
          </dl>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RankedList
          emptyLabel="No document usage has been recorded yet."
          items={metrics.topDocuments}
          title="Top used documents"
        />
        <RankedList
          emptyLabel="No current document categories could be attributed yet."
          items={metrics.topCategories}
          title="Top categories by source usage"
        />
      </section>

      <section className="rounded-[10px] border bg-card p-5 shadow-sm">
        <h3 className="font-semibold">Recent knowledge gaps</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Most recent queries that triggered the insufficient-context fallback.
        </p>
        {metrics.recentKnowledgeGaps.length === 0 ? (
          <p className="mt-4 rounded-lg bg-surface-subtle p-4 text-sm text-muted-foreground">
            No unresolved knowledge gaps have been detected.
          </p>
        ) : (
          <ul className="mt-4 divide-y rounded-lg border">
            {metrics.recentKnowledgeGaps.map((gap, index) => (
              <li
                className="flex flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between"
                key={`${gap.createdAt}-${index}`}
              >
                <span className="text-sm font-medium">{gap.question}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(gap.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function MetricCard({
  icon: Icon,
  label,
  tone = "default",
  value,
}: {
  icon: typeof Database;
  label: string;
  tone?: "default" | "success" | "warning";
  value: number | string;
}) {
  return (
    <div className="rounded-[10px] border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
        <Icon
          aria-hidden="true"
          className={
            tone === "success"
              ? "h-5 w-5 text-success"
              : tone === "warning"
                ? "h-5 w-5 text-warning"
                : "h-5 w-5 text-primary"
          }
        />
      </div>
    </div>
  );
}

function DataPoint({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-surface-subtle p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-semibold">{value}</dd>
    </div>
  );
}

function RankedList({
  emptyLabel,
  items,
  title,
}: {
  emptyLabel: string;
  items: RankedUsageItem[];
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-[10px] border bg-card p-5 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="mt-4 divide-y rounded-lg border">
          {items.map((item, index) => (
            <li className="flex items-center gap-3 p-3" key={item.label}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-yellow text-xs font-bold text-dark-blue">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-primary">
                {item.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

async function loadMetrics() {
  try {
    const metrics = await getAnalyticsMetrics();
    return { ok: true as const, metrics };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Metrics could not be loaded.",
    };
  }
}
