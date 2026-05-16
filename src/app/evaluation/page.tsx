import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

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
  "Reduces time spent searching internal documents.",
  "Improves consistency in customer service answers.",
  "Supports onboarding of new employees.",
  "Reduces dependency on senior staff for routine questions.",
  "Helps employees verify answers through sources.",
];

const risks = [
  "Hallucinated responses if context is insufficient.",
  "Outdated documents.",
  "Sensitive information exposure.",
  "Overreliance on AI.",
  "Incorrect document ingestion or poor PDF extraction.",
];

const mitigations = [
  "Answer only from retrieved context.",
  "Show sources.",
  "Use fallback when context is insufficient.",
  "Keep documents updated.",
  "Restrict admin upload access in future versions.",
  "Add human review for critical procedures.",
];

export default async function EvaluationPage() {
  const metricsResult = await loadMetrics();

  return (
    <AppShell active="evaluation">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Impact Evaluation</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">
            Prototype Evaluation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Evaluation focuses on knowledge-base readiness, grounded answer
            behavior, operational impact, risks, and mitigation controls.
          </p>
        </section>

        {metricsResult.ok ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries({
              "Uploaded documents": metricsResult.metrics.uploadedDocuments,
              "Indexed chunks": metricsResult.metrics.indexedChunks,
              "Total feedback": metricsResult.metrics.totalFeedback,
              "Helpful feedback": metricsResult.metrics.helpfulFeedback,
              "Not helpful feedback": metricsResult.metrics.notHelpfulFeedback,
              "Helpful percentage": metricsResult.metrics.helpfulPercentage,
              "Knowledge base status":
                metricsResult.metrics.knowledgeBaseStatus,
              "Demo questions available": metricsResult.metrics.demoQuestions,
              "Average expected response time":
                metricsResult.metrics.averageExpectedResponseTime,
              "Grounded-answer requirement":
                metricsResult.metrics.groundedAnswerRequirement,
            }).map(([label, value]) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-xl">{value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </section>
        ) : (
          <Alert variant="destructive">{metricsResult.error}</Alert>
        )}

        <EvaluationList icon="impact" items={impacts} title="Expected Impact" />
        <EvaluationList icon="risk" items={risks} title="Risks" />
        <EvaluationList
          icon="mitigation"
          items={mitigations}
          title="Mitigations"
        />
      </div>
    </AppShell>
  );
}

function EvaluationList({
  icon,
  items,
  title,
}: {
  icon: "impact" | "risk" | "mitigation";
  items: string[];
  title: string;
}) {
  const Icon =
    icon === "risk"
      ? AlertTriangle
      : icon === "impact"
        ? CheckCircle2
        : ShieldCheck;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <li className="flex gap-3 rounded-md border p-3" key={item}>
              <Icon
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              />
              <span className="text-sm">{item}</span>
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
