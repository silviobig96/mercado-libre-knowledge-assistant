import { ArrowDown, FileText, MessageSquareText } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const components = [
  { title: "Experience", detail: "Next.js Chat and protected Admin UI" },
  { title: "Ingestion", detail: "PDF extraction and text chunking" },
  { title: "Embedding", detail: "Gemini embedding service (768 dimensions)" },
  { title: "Vector store", detail: "Supabase PostgreSQL with pgvector" },
  { title: "Retrieval", detail: "Thresholded semantic similarity search" },
  { title: "Generation", detail: "Gemini answer constrained by RAG context" },
  { title: "Evidence", detail: "Sources, excerpts, match score, confidence" },
  { title: "Evaluation", detail: "Query logs, feedback, and live metrics" },
];

const ingestionPipeline = [
  "Approved PDF",
  "Text extraction",
  "Chunking",
  "Gemini embeddings",
  "Supabase pgvector",
];

const queryPipeline = [
  "Agent question",
  "Query embedding",
  "Semantic retrieval",
  "Relevant context",
  "Gemini generation",
  "Answer + sources",
];

export default function ArchitecturePage() {
  return (
    <AppShell active="architecture">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">
            Solution Design · Retrieval-Augmented Generation
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            System Architecture
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            The domain changed, but the working technical foundation remains:
            modular Next.js services, Gemini embeddings and generation, and
            Supabase pgvector retrieval with source attribution.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Core components</CardTitle>
            <CardDescription>
              Focused services keep presentation, ingestion, retrieval,
              generation, and storage concerns separate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {components.map((component, index) => (
                <div
                  className="rounded-lg border bg-surface-subtle p-4"
                  key={component.title}
                >
                  <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-brand-yellow text-xs font-bold text-dark-blue">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold">{component.title}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {component.detail}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <PipelineCard
            icon={FileText}
            steps={ingestionPipeline}
            subtitle="How approved academic sources become searchable knowledge."
            title="Document ingestion"
          />
          <PipelineCard
            icon={MessageSquareText}
            steps={queryPipeline}
            subtitle="How an agent receives an evidence-backed answer."
            title="Question answering"
          />
        </div>

        <div className="rounded-[10px] border-l-4 border-l-primary bg-card p-5 shadow-sm">
          <p className="font-semibold">Security and trust boundary</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Secret keys and privileged Supabase access stay server-side. This
            academic prototype has no connection to private Mercado Libre APIs,
            CRM records, tickets, employees, or internal policy systems.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function PipelineCard({
  icon: Icon,
  steps,
  subtitle,
  title,
}: {
  icon: typeof FileText;
  steps: string[];
  subtitle: string;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2">
          {steps.map((step, index) => (
            <li className="grid gap-2" key={step}>
              <div className="rounded-lg border bg-card px-3 py-2 text-sm font-medium">
                {step}
              </div>
              {index < steps.length - 1 && (
                <ArrowDown
                  aria-hidden="true"
                  className="ml-3 h-4 w-4 text-primary"
                />
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
