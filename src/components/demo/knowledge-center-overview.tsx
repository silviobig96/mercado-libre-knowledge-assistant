import {
  BadgeHelp,
  ClipboardCheck,
  Headphones,
  PackageSearch,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/domain/app-config";

const businessAreas = [
  {
    title: "Customer Experience",
    description:
      "Support agents with policy, claim, return, refund, and escalation questions.",
    icon: Headphones,
  },
  {
    title: "Mercado Envíos",
    description:
      "Delivery incidents, shipment procedures, exceptions, evidence, and escalation.",
    icon: PackageSearch,
  },
  {
    title: "Claims & Buyer Protection",
    description:
      "Source-backed next steps for damaged, incomplete, incorrect, or disputed purchases.",
    icon: ShieldCheck,
  },
  {
    title: "Returns & Refunds",
    description:
      "Return eligibility, required evidence, procedures, refunds, and documented exceptions.",
    icon: RefreshCcw,
  },
  {
    title: "Marketplace Operations",
    description:
      "Operational knowledge for buyer and seller support within the defined Marketplace MVP.",
    icon: ShoppingBag,
  },
  {
    title: "Knowledge Administration",
    description:
      "Upload and manage approved knowledge documents for the academic RAG knowledge base.",
    icon: ClipboardCheck,
  },
];

export function KnowledgeCenterOverview() {
  return (
    <section className="space-y-5">
      <div className="grid gap-4 rounded-[10px] border bg-card p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-6">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-dark-blue">
              Knowledge Engineering · RAG prototype
            </p>
            <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-semibold text-dark-blue">
              Argentina scope
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {APP_CONFIG.knowledgeCenterName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {APP_CONFIG.subtitle} Answers are grounded in retrieved documents,
            sources remain visible, and a human employee makes the final
            decision.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-accent p-4 text-accent-foreground lg:max-w-xs">
          <BadgeHelp aria-hidden="true" className="h-6 w-6 shrink-0" />
          <p className="text-sm font-medium">
            Scope: returns, refunds, claims, delivery incidents, and escalation.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {businessAreas.map((area) => {
          const Icon = area.icon;

          return (
            <Card
              className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              key={area.title}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-brand-yellow p-2 text-dark-blue">
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
