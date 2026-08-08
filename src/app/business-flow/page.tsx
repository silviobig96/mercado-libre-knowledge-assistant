import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  MessageCircleQuestion,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const flowSteps = [
  "Buyer or seller case enters the support workflow",
  "Customer Experience or Marketplace Operations agent reviews the case",
  "Agent asks the knowledge assistant a natural-language question",
  "Gemini converts the question to an embedding",
  "Supabase pgvector retrieves qualifying knowledge chunks",
  "Gemini generates an answer grounded only in that context",
  "The interface presents the answer, confidence, and source attribution",
  "The human agent reviews the evidence and decides the next step",
];

const scenarios = [
  "A purchase is marked delivered, but the buyer reports it was not received.",
  "A buyer reports a damaged or incomplete product and opens a claim.",
  "An agent must validate return requirements before starting the process.",
  "A Mercado Envíos incident needs documented handling or escalation.",
];

const principles = [
  "The assistant supports the employee; it does not replace the final human decision.",
  "Answers are limited to qualifying knowledge-base context and retain visible sources.",
  "Cases can be escalated when context is missing, conflicting, sensitive, or inconclusive.",
  "Query and feedback signals support continuous academic evaluation without fabricating outcomes.",
];

export default function BusinessFlowPage() {
  return (
    <AppShell active="business-flow">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">
            Business Process Integration · Argentina MVP
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Marketplace Support Flow
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            The assistant fits into Customer Experience and Marketplace
            Operations as a source-backed decision-support step for returns,
            refunds, claims, delivery incidents, and escalation.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Human-in-the-loop interaction</CardTitle>
            <CardDescription>
              End-to-end path from a buyer or seller case to resolution or
              escalation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-2">
              {flowSteps.map((step, index) => (
                <li className="grid gap-2" key={step}>
                  <div className="flex items-center gap-3 rounded-lg border bg-surface-subtle p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-6">
                      {step}
                    </span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <ArrowDown
                      aria-hidden="true"
                      className="ml-3.5 h-4 w-4 text-primary"
                    />
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-lg border border-success/25 bg-success/5 p-4">
                <CheckCircle2
                  aria-hidden="true"
                  className="mb-2 h-5 w-5 text-success"
                />
                <p className="font-semibold">Resolve</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Apply the verified procedure and record the case outcome.
                </p>
              </div>
              <ArrowRight
                aria-hidden="true"
                className="hidden h-5 w-5 text-muted-foreground sm:block"
              />
              <div className="rounded-lg border border-warning/25 bg-brand-yellow/15 p-4">
                <ShieldAlert
                  aria-hidden="true"
                  className="mb-2 h-5 w-5 text-warning"
                />
                <p className="font-semibold">Escalate</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Route ambiguous, sensitive, or unsupported cases to the
                  responsible human team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircleQuestion className="h-5 w-5 text-primary" />
                Example cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {scenarios.map((scenario) => (
                  <li
                    className="flex gap-3 rounded-lg border p-3"
                    key={scenario}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    />
                    <span className="text-sm leading-6">{scenario}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Operating principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {principles.map((principle) => (
                  <li
                    className="rounded-lg bg-surface-subtle p-3 text-sm leading-6"
                    key={principle}
                  >
                    {principle}
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
