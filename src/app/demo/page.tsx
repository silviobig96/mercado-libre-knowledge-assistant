import {
  CheckCircle2,
  MessageSquareText,
  Presentation,
  Route,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/domain/app-config";

const demoSteps = [
  "Introduce the academic problem and the Argentina Marketplace + Mercado Envíos MVP scope.",
  "Open Knowledge Acquisition to explain sources, questions, risks, and 10-week sufficiency.",
  "Sign in to Admin and upload a permitted academic or public-source PDF in the correct category.",
  "Ask an in-scope question and inspect the grounded answer, confidence, and sources.",
  "Submit Helpful or Not helpful feedback for the answer.",
  "Ask an unrelated or financial question to demonstrate the insufficient-context fallback.",
  "Open Business Flow to show human review, resolution, and escalation.",
  "Open Architecture to explain ingestion, pgvector retrieval, and Gemini generation.",
  "Open Evaluation to show live database-backed metrics, risks, and future improvements.",
];

const demoQuestions = [
  {
    label: "In-scope · returns",
    question: "¿Cuál es el proceso para devolver un producto defectuoso?",
  },
  {
    label: "In-scope · delivery incident",
    question:
      "¿Qué debe hacer un agente si una compra aparece como entregada pero el comprador indica que no la recibió?",
  },
  {
    label: "Out of scope · financial product",
    question: "¿Qué inversión de Mercado Pago tendrá mejor rendimiento?",
  },
];

const talkingPoints = [
  "The prototype supports Customer Experience and Marketplace Operations personnel; it is not an ecommerce storefront.",
  "Gemini creates 768-dimensional embeddings and generates answers from retrieved context.",
  "Supabase PostgreSQL with pgvector stores and searches document chunks.",
  "The assistant must fall back when qualifying evidence is unavailable.",
  "Sources, confidence, feedback, and query behavior remain visible and measurable.",
  "The human agent reviews evidence and remains responsible for resolution or escalation.",
];

export default function DemoPage() {
  return (
    <AppShell active="demo">
      <div className="space-y-6">
        <section className="grid gap-4 rounded-[10px] border bg-card p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-dark-blue">
              Final Demo · Knowledge Engineering / AI
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Presentation Walkthrough
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Present a coherent path from knowledge acquisition to a working,
              source-grounded RAG interaction and its evaluation.
            </p>
          </div>
          <div className="rounded-lg bg-brand-yellow p-4 text-dark-blue lg:max-w-xs">
            <Presentation aria-hidden="true" className="mb-2 h-6 w-6" />
            <p className="text-sm font-semibold">{APP_CONFIG.subtitle}</p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route aria-hidden="true" className="h-5 w-5 text-primary" />
              Demo flow
            </CardTitle>
            <CardDescription>
              Follow these steps during the live academic presentation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 md:grid-cols-2">
              {demoSteps.map((step, index) => (
                <li className="flex gap-3 rounded-lg border p-3" key={step}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText
                  aria-hidden="true"
                  className="h-5 w-5 text-primary"
                />
                Demo questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {demoQuestions.map((item) => (
                  <li className="rounded-lg border p-3" key={item.label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-6">{item.question}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden="true"
                  className="h-5 w-5 text-success"
                />
                Talking points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {talkingPoints.map((point) => (
                  <li
                    className="rounded-lg bg-surface-subtle p-3 text-sm leading-6"
                    key={point}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
