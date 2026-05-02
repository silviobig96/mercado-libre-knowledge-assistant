import { ArrowRight } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const components = [
  "Next.js web application",
  "Admin document upload UI",
  "PDF extraction service",
  "Chunking service",
  "Gemini embedding service",
  "Supabase PostgreSQL + pgvector",
  "RAG retrieval service",
  "Gemini generation service",
  "Chat UI with source attribution",
];

const pipeline = [
  "PDF documents",
  "Text extraction",
  "Chunking",
  "Gemini embeddings",
  "Supabase pgvector",
  "User question",
  "Query embedding",
  "Semantic search",
  "Retrieved context",
  "Gemini answer",
  "Response with sources",
];

export default function ArchitecturePage() {
  return (
    <AppShell active="architecture">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Solution Design</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">
            System Architecture
          </h2>
          <p className="mt-3 text-muted-foreground">
            The prototype separates presentation, ingestion, retrieval,
            generation, and storage concerns so each part of the RAG workflow is
            easy to explain and maintain.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Core Components</CardTitle>
            <CardDescription>
              Services and interfaces used by the corporate knowledge assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {components.map((component) => (
                <div
                  className="rounded-md border bg-secondary/40 p-3"
                  key={component}
                >
                  <p className="text-sm font-medium">{component}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RAG Data Flow</CardTitle>
            <CardDescription>
              Presentation-ready view of ingestion, retrieval, and answer
              generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {pipeline.map((step, index) => (
                <div className="flex items-center gap-2" key={step}>
                  <span className="rounded-md border bg-card px-3 py-2 text-sm font-medium">
                    {step}
                  </span>
                  {index < pipeline.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 text-muted-foreground"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
