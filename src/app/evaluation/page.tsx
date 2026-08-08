import {
  AlertTriangle,
  CheckCircle2,
  Database,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEvaluationMetrics } from "@/features/evaluation/services/evaluation-metrics.service";

export const dynamic = "force-dynamic";

const impacts = [
  "Reduces time spent searching approved operational documents.",
  "Improves consistency in source-backed Customer Experience answers.",
  "Supports agent onboarding for the defined Argentina Marketplace scope.",
  "Keeps evidence visible before a human resolves or escalates a case.",
];

const risks = [
  "Incomplete, outdated, or contradictory source documents.",
  "Country-specific differences being applied outside Argentina.",
  "Sensitive or unauthorized documents entering the corpus.",
  "Hallucination, irrelevant retrieval, or overreliance on AI output.",
  "Poor extraction quality from scanned or complex PDFs.",
];

const mitigations = [
  "Answer only from thresholded context and display retrieved sources.",
  "Use the required fallback when qualifying evidence is unavailable.",
  "Limit administration to authenticated users and approved documents.",
  "Keep the human agent as final reviewer and preserve escalation paths.",
  "Track queries, confidence, sources, response time, and feedback.",
];

const futureImprovements = [
  "Add document owner, country, effective date, versioning, and review workflows.",
  "Classify in-scope test queries so retrieval success rate can be calculated accurately.",
  "Replace the shared MVP password with role-based enterprise authentication.",
  "Add OCR, page-level citations, evaluation exports, and a curated test set.",
  "Tune the similarity threshold against validated Argentina-domain questions.",
];

const academicCoverage = [
  "Activity 1: Mercado Libre domain selection, Argentina MVP scope, AI objective, and 10-week delivery framing.",
  "Knowledge Acquisition: source map, acquisition matrix, knowledge questions, risks, and sufficiency criterion.",
  "Activity 2: architecture, technology selection, and modular RAG design.",
  "Activity 3: working Chat, Admin, PDF ingestion, retrieval, generation, and sources.",
  "Activity 4: buyer/seller support flow, human review, resolution, and escalation.",
  "Activity 5: database-backed metrics, impact, risks, mitigations, and improvements.",
  "Activity 6: presentation-ready demo flow and supporting documentation.",
];

export default async function EvaluationPage() {
  const metricsResult = await loadMetrics();

  return (
    <AppShell active="evaluation">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">
            Impact Evaluation · Live prototype data
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            RAG Evaluation
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Metrics come from Supabase documents, chunks, chat query history,
            visible sources, and user feedback. No values are fabricated.
          </p>
        </section>

        {metricsResult.ok ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Database}
                label="Uploaded documents"
                value={metricsResult.metrics.uploadedDocuments}
              />
              <MetricCard
                icon={MessageSquareText}
                label="Total questions"
                value={metricsResult.metrics.totalQuestions}
              />
              <MetricCard
                icon={ShieldCheck}
                label="Source-backed answer rate"
                tone="success"
                value={metricsResult.metrics.sourceBackedAnswerRate}
              />
              <MetricCard
                icon={ThumbsUp}
                label="Helpful feedback"
                tone="success"
                value={metricsResult.metrics.helpfulPercentage}
              />
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Operational metrics</CardTitle>
                <CardDescription>
                  Confidence counts cover only answers with a confidence label;
                  greetings and other conversational responses are reported
                  separately from source-backed answers. The source-backed rate
                  uses non-fallback responses as its denominator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-[760px] w-full text-left text-sm">
                    <thead className="bg-surface-subtle text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          Knowledge base
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Answer behavior
                        </th>
                        <th className="px-4 py-3 font-semibold">Confidence</th>
                        <th className="px-4 py-3 font-semibold">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="align-top">
                        <td className="border-t px-4 py-4 leading-7">
                          {metricsResult.metrics.indexedChunks} indexed chunks
                          <br />
                          {metricsResult.metrics.categoriesCovered} categories
                          <br />
                          Status: {metricsResult.metrics.knowledgeBaseStatus}
                        </td>
                        <td className="border-t px-4 py-4 leading-7">
                          {metricsResult.metrics.answeredWithContext} with
                          sources
                          <br />
                          {metricsResult.metrics.fallbackQuestions} fallbacks
                          <br />
                          {
                            metricsResult.metrics
                              .conversationalOrUnscoredQuestions
                          }{" "}
                          conversational/unscored
                        </td>
                        <td className="border-t px-4 py-4 leading-7">
                          {metricsResult.metrics.confidenceRatedAnswers} rated
                          answers
                          <br />
                          {metricsResult.metrics.highConfidenceAnswers} high ·{" "}
                          {metricsResult.metrics.mediumConfidenceAnswers} medium
                          · {metricsResult.metrics.lowConfidenceAnswers} low
                        </td>
                        <td className="border-t px-4 py-4 leading-7">
                          {metricsResult.metrics.totalFeedback} total
                          <br />
                          {metricsResult.metrics.helpfulFeedback} helpful ·{" "}
                          {metricsResult.metrics.notHelpfulFeedback} not helpful
                          <br />
                          Avg. response:{" "}
                          {metricsResult.metrics.averageResponseTime}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Alert variant="destructive">{metricsResult.error}</Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <EvaluationList
            icon="impact"
            items={impacts}
            title="Expected impact"
          />
          <EvaluationList icon="risk" items={risks} title="Risks" />
          <EvaluationList
            icon="mitigation"
            items={mitigations}
            title="Mitigations"
          />
          <EvaluationList
            icon="future"
            items={futureImprovements}
            title="Future improvements"
          />
        </div>
        <EvaluationList
          icon="academic"
          items={academicCoverage}
          title="Academic activity coverage"
        />
      </div>
    </AppShell>
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
  tone?: "default" | "success";
  value: number | string;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">{value}</CardTitle>
            <CardDescription className="mt-2">{label}</CardDescription>
          </div>
          <span
            className={`rounded-md p-2 ${
              tone === "success"
                ? "bg-success/10 text-success"
                : "bg-accent text-primary"
            }`}
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
    </Card>
  );
}

function EvaluationList({
  icon,
  items,
  title,
}: {
  icon: "academic" | "future" | "impact" | "risk" | "mitigation";
  items: string[];
  title: string;
}) {
  const Icon =
    icon === "risk"
      ? AlertTriangle
      : icon === "future"
        ? Lightbulb
        : icon === "academic"
          ? GraduationCap
          : icon === "impact"
            ? CheckCircle2
            : ShieldCheck;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3">
          {items.map((item) => (
            <li
              className="rounded-lg bg-surface-subtle p-3 text-sm leading-6"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

async function loadMetrics() {
  try {
    const metrics = await getEvaluationMetrics();
    return { ok: true as const, metrics };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load evaluation metrics.",
    };
  }
}
