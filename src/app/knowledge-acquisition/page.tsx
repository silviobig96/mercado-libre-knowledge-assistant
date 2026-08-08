import {
  Bot,
  Database,
  FileText,
  HelpCircle,
  Network,
  ShieldAlert,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sourceGroups = [
  {
    title: "Proposed human sources",
    icon: Users,
    description:
      "For a real implementation; no employee interviews or private access are claimed.",
    items: [
      "Customer Experience subject-matter expert",
      "Marketplace Operations specialist",
      "Mercado Envíos or logistics specialist",
    ],
  },
  {
    title: "Documentary sources",
    icon: FileText,
    description: "Permitted, reviewed material prepared as uploadable PDFs.",
    items: [
      "Public Help Center content",
      "Returns, refunds, claims, and buyer-protection guidance",
      "Mercado Envíos and seller-support guidance",
      "Academic or simulated process documents",
    ],
  },
  {
    title: "Project data",
    icon: Database,
    description: "Evidence produced by this prototype and its test process.",
    items: [
      "Chat query history and fallback behavior",
      "Evaluation metrics and response time",
      "Helpful / not-helpful feedback",
      "Curated test cases",
    ],
  },
  {
    title: "Processes",
    icon: Network,
    description: "Operational knowledge the MVP must explain from sources.",
    items: [
      "Return and refund",
      "Claim and buyer protection",
      "Delivery incident",
      "Human escalation",
    ],
  },
  {
    title: "Systems",
    icon: Bot,
    description: "Technical systems used by the academic prototype.",
    items: [
      "Knowledge assistant and document administration",
      "Supabase PostgreSQL with pgvector",
      "Gemini embeddings and generation",
    ],
  },
];

const acquisitionRows = [
  {
    source: "Public Help Center content",
    type: "Documentary",
    owner: "Mercado Libre / public Help Center",
    access: "Public",
    reliability: "High after scope and date review",
    sensitivity: "Low",
    risk: "Content changes or differs by country",
    use: "Core reference prepared as permitted PDF",
    evidence: "Public URL and access date recorded by the project",
  },
  {
    source: "Returns and refunds guidance",
    type: "Documentary",
    owner: "Public publisher / academic project",
    access: "Public or project-prepared",
    reliability: "Medium–high after validation",
    sensitivity: "Low",
    risk: "Outdated deadlines or exceptions",
    use: "Return and refund question coverage",
    evidence: "Source reference included with uploaded PDF",
  },
  {
    source: "Claims and buyer-protection guidance",
    type: "Documentary",
    owner: "Public publisher / academic project",
    access: "Public or project-prepared",
    reliability: "Medium–high after validation",
    sensitivity: "Low",
    risk: "Incomplete edge cases",
    use: "Claim evidence and escalation questions",
    evidence: "Reviewed source list and academic document label",
  },
  {
    source: "Mercado Envíos guidance",
    type: "Documentary",
    owner: "Mercado Libre / public Help Center",
    access: "Public",
    reliability: "High after Argentina check",
    sensitivity: "Low",
    risk: "Status-specific procedures may change",
    use: "Delivery incident and exception coverage",
    evidence: "Public URL and verification date",
  },
  {
    source: "Simulated escalation procedure",
    type: "Academic document",
    owner: "Academic project team",
    access: "Project controlled",
    reliability: "Medium; requires instructor review",
    sensitivity: "Low",
    risk: "May not reflect a real company process",
    use: "Demonstrate escalation behavior without private claims",
    evidence: "Clearly labeled simulated document",
  },
  {
    source: "Chat queries and feedback",
    type: "Project data",
    owner: "Academic project team",
    access: "Application database",
    reliability: "High for recorded prototype behavior",
    sensitivity: "Medium; avoid personal data",
    risk: "Small or biased sample",
    use: "Evaluation and retrieval tuning",
    evidence: "Supabase query and feedback tables",
  },
  {
    source: "Domain specialists",
    type: "Proposed human source",
    owner: "Future real implementation",
    access: "Not accessed in this prototype",
    reliability: "Potentially high with validation",
    sensitivity: "Potentially high",
    risk: "Unavailable; must not be implied as interviewed",
    use: "Future elicitation and conflict resolution",
    evidence: "Proposal only",
  },
];

const inScopeQuestions = [
  "What is the documented return process?",
  "When should a claim be escalated?",
  "What applies when a purchase is marked delivered but not received?",
  "What should an agent do after a buyer reports a damaged product?",
  "What procedure follows an approved refund?",
  "What information must be validated before starting a return?",
  "What procedure applies to a Mercado Envíos incident?",
  "What should a seller do after receiving a claim?",
];

const outOfScopeQuestions = [
  "Which Mercado Pago investment should a user choose?",
  "What will the exchange rate be next month?",
  "Who won an unrelated sporting event?",
];

const risks = [
  [
    "Incomplete sources",
    "Define a minimum corpus and map every test question to evidence.",
  ],
  [
    "Outdated documents",
    "Record source date and review material before each demo.",
  ],
  [
    "Contradictory policies",
    "Flag conflicts and require human validation or escalation.",
  ],
  [
    "Country-specific differences",
    "Label the MVP Argentina-only and reject unsupported generalization.",
  ],
  [
    "Sensitive or private data",
    "Use permitted sources and exclude personal or unauthorized content.",
  ],
  [
    "Hallucinations",
    "Constrain generation to context and keep the required fallback.",
  ],
  [
    "Irrelevant retrieval",
    "Use thresholding, source review, and a curated evaluation set.",
  ],
  [
    "Bias or incomplete representation",
    "Cover buyer, seller, delivery, claim, and escalation scenarios.",
  ],
  [
    "External service dependency",
    "Handle failures clearly and retain a free-tier-friendly design.",
  ],
  [
    "Unauthorized documents",
    "Protect Admin and require provenance before upload.",
  ],
  [
    "Lack of human validation",
    "Keep a human as final decision-maker for every operational case.",
  ],
] as const;

export default function KnowledgeAcquisitionPage() {
  return (
    <AppShell active="knowledge-acquisition">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">
            Knowledge Engineering Deliverable
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Knowledge Acquisition
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A transparent source strategy for a viable 10-week academic MVP,
            scoped to Marketplace and Mercado Envíos operations in Argentina.
          </p>
        </section>

        <section aria-labelledby="source-map-title">
          <div className="mb-4">
            <h3 className="text-xl font-semibold" id="source-map-title">
              Knowledge Source Map
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Proposed people, permitted documents, project data, processes, and
              systems involved in knowledge acquisition.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sourceGroups.map((group) => {
              const Icon = group.icon;
              return (
                <Card key={group.title}>
                  <CardHeader>
                    <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-brand-yellow text-dark-blue">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-base">{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm leading-5">
                      {group.items.map((item) => (
                        <li
                          className="border-l-2 border-primary/30 pl-3"
                          key={item}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Acquisition Matrix</CardTitle>
            <CardDescription>
              Source ownership, access, reliability, sensitivity, risk, and MVP
              use. The table scrolls within its card on narrow screens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-full overflow-x-auto rounded-lg border">
              <table className="min-w-[1450px] w-full text-left text-sm">
                <caption className="sr-only">
                  Acquisition matrix for the Mercado Libre Argentina academic
                  MVP
                </caption>
                <thead className="sticky top-0 bg-brand-yellow text-dark-blue">
                  <tr>
                    {[
                      "Source",
                      "Type",
                      "Owner",
                      "Access",
                      "Reliability",
                      "Sensitivity",
                      "Risk",
                      "Use in MVP",
                      "Evidence / source reference",
                    ].map((heading) => (
                      <th
                        className="px-4 py-3 font-semibold"
                        key={heading}
                        scope="col"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {acquisitionRows.map((row) => (
                    <tr
                      className="border-t align-top even:bg-surface-subtle"
                      key={row.source}
                    >
                      <td className="px-4 py-3 font-semibold">{row.source}</td>
                      <td className="px-4 py-3">{row.type}</td>
                      <td className="px-4 py-3">{row.owner}</td>
                      <td className="px-4 py-3">{row.access}</td>
                      <td className="px-4 py-3">{row.reliability}</td>
                      <td className="px-4 py-3">{row.sensitivity}</td>
                      <td className="px-4 py-3">{row.risk}</td>
                      <td className="px-4 py-3">{row.use}</td>
                      <td className="px-4 py-3">{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <section
          className="grid gap-6 lg:grid-cols-2"
          aria-labelledby="knowledge-questions-title"
        >
          <Card>
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2"
                id="knowledge-questions-title"
              >
                <HelpCircle
                  aria-hidden="true"
                  className="h-5 w-5 text-primary"
                />
                In-scope knowledge questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {inScopeQuestions.map((question) => (
                  <li
                    className="rounded-lg bg-surface-subtle p-3 text-sm leading-6"
                    key={question}
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deliberately out of scope</CardTitle>
              <CardDescription>
                These should use the safe insufficient-context behavior rather
                than general model knowledge.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {outOfScopeQuestions.map((question) => (
                  <li
                    className="rounded-lg border border-warning/25 bg-brand-yellow/10 p-3 text-sm leading-6"
                    key={question}
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert
                aria-hidden="true"
                className="h-5 w-5 text-warning"
              />
              Initial risks and mitigations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {risks.map(([risk, mitigation]) => (
                <div className="rounded-lg border p-4" key={risk}>
                  <p className="text-sm font-semibold">{risk}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {mitigation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="rounded-[10px] border-l-4 border-l-success bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-success">
            10-week advancement criterion
          </p>
          <h3 className="mt-2 text-xl font-semibold">
            The team must demonstrate that its knowledge sources are sufficient
            to build and validate a viable MVP within 10 weeks.
          </h3>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
            The selected public references, clearly labeled academic process
            documents, representative knowledge questions, and prototype query
            and feedback data cover the deliberately narrow MVP. They are
            sufficient to test ingestion, retrieval, grounded generation,
            fallback, source attribution, and human escalation—while remaining
            explicitly academic and not claiming access to private Mercado Libre
            knowledge.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
