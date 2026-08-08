import { FileSearch, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import {
  DOCUMENT_CATEGORIES,
  getDocumentCategoryLabel,
  isDocumentCategory,
} from "@/features/documents/constants/document-categories";
import {
  getDocumentSourceTypeLabel,
  getDocumentStatusLabel,
  resolveDocumentStatus,
  type DocumentStatus,
} from "@/features/documents/constants/document-metadata";
import { listUploadedDocuments } from "@/features/documents/services/document-list.service";
import type { DocumentRecord } from "@/features/documents/types/document.types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SourcesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function SourcesPage({ searchParams }: SourcesPageProps) {
  const { category } = await searchParams;
  const selectedCategory = isDocumentCategory(category) ? category : null;
  const sourcesResult = await loadSources();

  return (
    <AppShell active="sources">
      <div className="space-y-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-dark-blue">Knowledge base</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Sources
          </h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Browse the real documents available to retrieval. Governance status,
            provenance, scope, upload date, and chunk coverage remain visible.
          </p>
        </section>

        {sourcesResult.ok ? (
          <SourcesContent
            documents={sourcesResult.documents}
            selectedCategory={selectedCategory}
          />
        ) : (
          <Alert variant="destructive">{sourcesResult.error}</Alert>
        )}
      </div>
    </AppShell>
  );
}

function SourcesContent({
  documents,
  selectedCategory,
}: {
  documents: DocumentRecord[];
  selectedCategory: string | null;
}) {
  const filteredDocuments = selectedCategory
    ? documents.filter((document) => document.category === selectedCategory)
    : documents;
  const statuses = documents.map(resolveDocumentStatus);

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryMetric label="Total sources" value={documents.length} />
        <SummaryMetric
          label="Active sources"
          tone="success"
          value={statuses.filter((status) => status === "active").length}
        />
        <SummaryMetric
          label="Legacy / review needed"
          tone="warning"
          value={
            statuses.filter(
              (status) => status === "legacy" || status === "needs-review",
            ).length
          }
        />
      </section>

      <nav
        aria-label="Filter sources by category"
        className="flex flex-wrap gap-2"
      >
        <FilterLink active={!selectedCategory} href="/sources" label="All" />
        {DOCUMENT_CATEGORIES.map((category) => (
          <FilterLink
            active={selectedCategory === category.value}
            href={`/sources?category=${category.value}`}
            key={category.value}
            label={category.label}
          />
        ))}
      </nav>

      {filteredDocuments.length === 0 ? (
        <div className="rounded-[10px] border bg-card p-8 text-center shadow-sm">
          <FileSearch
            aria-hidden="true"
            className="mx-auto h-8 w-8 text-primary"
          />
          <p className="mt-3 font-medium">
            {documents.length === 0
              ? "No active knowledge sources are available."
              : "No sources match this category."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            An administrator can add a permitted PDF from the Admin workspace.
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto rounded-[10px] border bg-card shadow-sm">
          <table className="min-w-[920px] w-full text-left text-sm">
            <caption className="sr-only">
              Uploaded knowledge sources and governance metadata
            </caption>
            <thead className="sticky top-0 bg-surface-subtle text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Source
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Category
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Provenance
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Scope
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Coverage
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Uploaded
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document) => {
                const status = resolveDocumentStatus(document);

                return (
                  <tr className="border-t align-top" key={document.id}>
                    <td className="max-w-xs px-4 py-4">
                      <div className="flex min-w-0 items-start gap-2">
                        <FileText
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        />
                        <span className="break-words font-medium">
                          {document.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getDocumentCategoryLabel(document.category)}
                    </td>
                    <td className="px-4 py-4">
                      {getDocumentSourceTypeLabel(document.sourceType)}
                    </td>
                    <td className="px-4 py-4">
                      {document.country ?? "Not verified"}
                    </td>
                    <td className="px-4 py-4">{document.chunkCount} chunks</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(document.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function SummaryMetric({
  label,
  tone = "default",
  value,
}: {
  label: string;
  tone?: "default" | "success" | "warning";
  value: number;
}) {
  return (
    <div className="rounded-[10px] border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
        <ShieldCheck
          aria-hidden="true"
          className={cn(
            "h-5 w-5",
            tone === "default" && "text-primary",
            tone === "success" && "text-success",
            tone === "warning" && "text-warning",
          )}
        />
      </div>
    </div>
  );
}

function FilterLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border bg-card px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-accent",
        active && "border-primary bg-accent text-accent-foreground",
      )}
      href={href}
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
        status === "active" && "bg-success/10 text-success",
        status === "needs-review" && "bg-brand-yellow/25 text-warning",
        status === "legacy" && "bg-surface-subtle text-warning",
        status === "inactive" && "bg-surface-subtle text-muted-foreground",
      )}
    >
      {getDocumentStatusLabel(status)}
    </span>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

async function loadSources() {
  try {
    const documents = await listUploadedDocuments();
    return { ok: true as const, documents };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Knowledge sources could not be loaded.",
    };
  }
}
