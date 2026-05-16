import { CheckCircle2, MessageSquareText, Route } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const demoSteps = [
  "Open the NovaRetail Knowledge Center landing page.",
  "Go to Admin and sign in with the demo admin password.",
  "Upload a NovaRetail PDF and select the correct document category.",
  "Open Chat and ask a suggested question in Spanish.",
  "Ask a suggested question in English to demonstrate multilingual usage.",
  "Ask an out-of-scope question to show the insufficient-context fallback.",
  "Open the Sources accordion to show document attribution.",
  "Mark an answer as Helpful or Not helpful.",
  "Open Evaluation to show real metrics from documents, queries, and feedback.",
  "Open Architecture and Business Flow to explain solution design and operational integration.",
];

const demoQuestions = [
  {
    label: "Spanish demo question",
    question: "¿Cuál es el proceso para devolver una laptop defectuosa?",
  },
  {
    label: "English demo question",
    question: "What is the process to return a defective laptop?",
  },
  {
    label: "Fallback demo question",
    question:
      "What is NovaRetail's policy for launching a cryptocurrency fund?",
  },
];

const talkingPoints = [
  "Proyecto 1: Asistente Inteligente de Conocimiento Corporativo.",
  "The prototype is an internal assistant, not an ecommerce storefront.",
  "Gemini creates embeddings and grounded answers.",
  "Supabase PostgreSQL with pgvector stores searchable document chunks.",
  "The assistant answers only from retrieved context and shows sources.",
  "Evaluation metrics come from uploaded documents, chat history, and feedback.",
];

export default function DemoPage() {
  return (
    <AppShell active="demo">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Final Demo</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">
            Presentation Walkthrough
          </h2>
          <p className="mt-3 text-muted-foreground">
            Use this page as a concise script for demonstrating the complete
            academic lifecycle: design, AI prototype, business integration,
            evaluation, and final delivery.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route aria-hidden="true" className="h-5 w-5 text-primary" />
              Demo Flow
            </CardTitle>
            <CardDescription>
              Follow these steps during the live presentation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 md:grid-cols-2">
              {demoSteps.map((step, index) => (
                <li className="flex gap-3 rounded-md border p-3" key={step}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm">{step}</span>
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
                Demo Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {demoQuestions.map((item) => (
                  <li className="rounded-md border p-3" key={item.label}>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm">{item.question}</p>
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
                  className="h-5 w-5 text-primary"
                />
                Talking Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {talkingPoints.map((point) => (
                  <li className="rounded-md border p-3 text-sm" key={point}>
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
