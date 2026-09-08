export const DOCUMENT_CATEGORIES = [
  { value: "customer-experience", label: "Customer Experience" },
  { value: "mercado-envios", label: "Mercado Envíos" },
  {
    value: "claims-buyer-protection",
    label: "Claims & Buyer Protection",
  },
  { value: "returns-refunds", label: "Returns & Refunds" },
  { value: "marketplace-operations", label: "Marketplace Operations" },
  { value: "general-policy", label: "General Policy" },
] as const;

export const DEFAULT_DOCUMENT_CATEGORY = "general-policy";

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]["value"];

const LEGACY_DOCUMENT_CATEGORIES = new Set([
  "Customer Service",
  "Logistics",
  "Warranties",
  "Returns",
  "Store Operations",
  "General Policy",
]);

export function isDocumentCategory(value: unknown): value is DocumentCategory {
  return (
    typeof value === "string" &&
    DOCUMENT_CATEGORIES.some((category) => category.value === value)
  );
}

export function getDocumentCategoryLabel(category: string): string {
  return (
    DOCUMENT_CATEGORIES.find((item) => item.value === category)?.label ??
    category
  );
}

export function isLegacyDocumentCategory(category: string): boolean {
  return LEGACY_DOCUMENT_CATEGORIES.has(category);
}
