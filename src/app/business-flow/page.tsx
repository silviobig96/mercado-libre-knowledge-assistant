import { ArrowDown, CheckCircle2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const flowSteps = [
  "Customer request or internal doubt",
  "Employee opens NovaRetail Knowledge Center",
  "Employee asks a question in natural language",
  "System generates query embedding",
  "Supabase pgvector retrieves relevant document chunks",
  "Gemini generates a grounded answer using retrieved context",
  "Employee reviews answer and sources",
  "Employee resolves the case or escalates it to the appropriate area",
];

const scenarios = [
  "Customer asks about returning a defective laptop.",
  "Customer reports package marked as delivered but not received.",
  "Employee needs to verify warranty coverage.",
  "New employee needs onboarding support.",
];

export default function BusinessFlowPage() {
  return (
    <AppShell active="business-flow">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-primary">
            Business Process Integration
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">
            NovaRetail Business Flow
          </h2>
          <p className="mt-3 text-muted-foreground">
            The assistant integrates into employee workflows as a source-backed
            decision support tool for customer service, logistics, warranties,
            returns, store operations, and onboarding.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Employee Interaction Flow</CardTitle>
            <CardDescription>
              End-to-end flow from business question to operational resolution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3">
              {flowSteps.map((step, index) => (
                <li className="grid gap-3" key={step}>
                  <div className="flex items-center gap-3 rounded-md border bg-secondary/40 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{step}</span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <ArrowDown
                      aria-hidden="true"
                      className="ml-3 h-4 w-4 text-muted-foreground"
                    />
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Scenarios</CardTitle>
            <CardDescription>
              Demo cases that show how the assistant supports NovaRetail
              operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              {scenarios.map((scenario) => (
                <li className="flex gap-3 rounded-md border p-3" key={scenario}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  />
                  <span className="text-sm">{scenario}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
