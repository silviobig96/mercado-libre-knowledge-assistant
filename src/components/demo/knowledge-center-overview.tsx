import {
  ClipboardCheck,
  Headphones,
  PackageSearch,
  RefreshCcw,
  ShieldCheck,
  Store,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const businessAreas = [
  {
    title: "Customer Service",
    description:
      "Helps advisors answer policy, escalation, and customer-case questions with source-backed guidance.",
    icon: Headphones,
  },
  {
    title: "Logistics",
    description:
      "Supports package status, delivery exception, carrier investigation, and fulfillment procedure lookups.",
    icon: PackageSearch,
  },
  {
    title: "Warranties",
    description:
      "Retrieves warranty coverage, validation requirements, approval rules, and escalation criteria.",
    icon: ShieldCheck,
  },
  {
    title: "Returns",
    description:
      "Guides employees through return eligibility, required evidence, refund timing, and exception handling.",
    icon: RefreshCcw,
  },
  {
    title: "Store Operations",
    description:
      "Provides quick access to operating procedures, internal checklists, and store support flows.",
    icon: Store,
  },
  {
    title: "Document Administration",
    description:
      "Lets authorized users upload manuals, FAQs, policy PDFs, and process guides into the knowledge base.",
    icon: ClipboardCheck,
  },
];

export function KnowledgeCenterOverview() {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-primary">
          Project 1 · Intelligent Corporate Knowledge Assistant
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-normal">
          NovaRetail Knowledge Center
        </h2>
        <p className="mt-3 text-muted-foreground">
          Internal AI-powered knowledge assistant for NovaRetail employees. The
          prototype helps teams consult corporate policies, procedures, manuals,
          warranty rules, logistics guides, customer service flows, and internal
          FAQs through a retrieval-augmented chat experience.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {businessAreas.map((area) => {
          const Icon = area.icon;

          return (
            <Card key={area.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-accent p-2 text-primary">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <CardTitle className="text-base">{area.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{area.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
