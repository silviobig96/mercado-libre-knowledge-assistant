export const DOCUMENT_CATEGORIES = [
  "Customer Service",
  "Logistics",
  "Warranties",
  "Returns",
  "Store Operations",
  "General Policy",
] as const;

export const DEFAULT_DOCUMENT_CATEGORY = "General Policy";

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export function isDocumentCategory(value: unknown): value is DocumentCategory {
  return (
    typeof value === "string" &&
    DOCUMENT_CATEGORIES.includes(value as DocumentCategory)
  );
}
