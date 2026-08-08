"use client";

import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getDocumentCategoryLabel } from "@/features/documents/constants/document-categories";
import {
  getDocumentSourceTypeLabel,
  getDocumentStatusLabel,
  resolveDocumentStatus,
} from "@/features/documents/constants/document-metadata";
import type { DocumentRecord } from "@/features/documents/types/document.types";

type DocumentListProps = {
  documents: DocumentRecord[];
};

type DeleteSuccess = {
  success: true;
  documentId: string;
  documentName: string;
};

type DeleteError = {
  error: string;
};

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter();
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (documents.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        No documents have been uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {successMessage && <Alert>{successMessage}</Alert>}
      {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
      <ul className="divide-y rounded-md border">
        {documents.map((document) => {
          const isDeleting = deletingDocumentId === document.id;
          const resolvedStatus = resolveDocumentStatus(document);

          return (
            <li
              className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
              key={document.id}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {document.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">
                      {getDocumentCategoryLabel(document.category)}
                    </span>
                    <span className="rounded-full bg-surface-subtle px-2 py-0.5 font-medium text-warning">
                      {getDocumentStatusLabel(resolvedStatus)}
                    </span>
                    <span>
                      · {getDocumentSourceTypeLabel(document.sourceType)}
                    </span>
                    <span>· {document.country ?? "Scope not verified"}</span>
                    <span>· {formatFileSize(document.sizeBytes)}</span>
                    <span>· {document.chunkCount} chunks</span>
                    <span>
                      · {new Date(document.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                aria-label={`Delete ${document.name}`}
                disabled={deletingDocumentId !== null}
                onClick={() => handleDelete(document)}
                size="sm"
                type="button"
                variant="destructive"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  async function handleDelete(document: DocumentRecord) {
    const confirmed = window.confirm(
      `Delete "${document.name}" and its indexed chunks? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingDocumentId(document.id);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });
      const payload = await parseDeleteResponse(response);

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Unable to delete document.",
        );
      }

      setSuccessMessage(`${payload.documentName} was deleted.`);
      router.refresh();
    } catch (deleteError) {
      setErrorMessage(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete document.",
      );
    } finally {
      setDeletingDocumentId(null);
    }
  }
}

function formatFileSize(sizeBytes: number | null) {
  if (!sizeBytes) {
    return "Unknown size";
  }

  const sizeInMegabytes = sizeBytes / (1024 * 1024);
  return `${sizeInMegabytes.toFixed(2)} MB`;
}

async function parseDeleteResponse(
  response: Response,
): Promise<DeleteSuccess | DeleteError> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as DeleteSuccess | DeleteError;
  }

  return {
    error: response.ok
      ? "Delete returned an unexpected response."
      : `Delete failed with status ${response.status}.`,
  };
}
