import { isLegacyDocumentCategory } from "@/features/documents/constants/document-categories";

export const DOCUMENT_SOURCE_TYPES = [
  { value: "public-reference", label: "Public reference" },
  { value: "academic-test", label: "Test document" },
  { value: "simulated-process", label: "Simulated process document" },
] as const;

export const DEFAULT_DOCUMENT_SOURCE_TYPE = "academic-test";
export const DEFAULT_DOCUMENT_COUNTRY = "Argentina";
export const DEFAULT_DOCUMENT_STATUS = "active";

export type DocumentSourceType =
  (typeof DOCUMENT_SOURCE_TYPES)[number]["value"];
export type DocumentStatus = "active" | "needs-review" | "legacy" | "inactive";

export function isDocumentSourceType(
  value: unknown,
): value is DocumentSourceType {
  return (
    typeof value === "string" &&
    DOCUMENT_SOURCE_TYPES.some((sourceType) => sourceType.value === value)
  );
}

export function getDocumentSourceTypeLabel(sourceType: string | null): string {
  if (!sourceType) {
    return "Not specified";
  }

  return (
    DOCUMENT_SOURCE_TYPES.find((item) => item.value === sourceType)?.label ??
    sourceType
  );
}

export function resolveDocumentStatus(input: {
  category: string;
  status: DocumentStatus | null;
}): DocumentStatus {
  if (isLegacyDocumentCategory(input.category)) {
    return "legacy";
  }

  return input.status ?? "needs-review";
}

export function getDocumentStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
    active: "Active",
    "needs-review": "Needs review",
    legacy: "Legacy",
    inactive: "Inactive",
  };

  return labels[status];
}
