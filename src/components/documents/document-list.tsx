import { FileText } from "lucide-react";

import type { DocumentRecord } from "@/features/documents/types/document.types";

type DocumentListProps = {
  documents: DocumentRecord[];
};

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        No documents have been uploaded yet.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-md border">
      {documents.map((document) => (
        <li className="flex items-center gap-3 p-3" key={document.id}>
          <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{document.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.sizeBytes)} ·{" "}
              {new Date(document.createdAt).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatFileSize(sizeBytes: number | null) {
  if (!sizeBytes) {
    return "Unknown size";
  }

  const sizeInMegabytes = sizeBytes / (1024 * 1024);
  return `${sizeInMegabytes.toFixed(2)} MB`;
}
