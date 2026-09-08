"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_DOCUMENT_CATEGORY,
  DOCUMENT_CATEGORIES,
  getDocumentCategoryLabel,
  type DocumentCategory,
} from "@/features/documents/constants/document-categories";
import {
  DEFAULT_DOCUMENT_COUNTRY,
  DEFAULT_DOCUMENT_SOURCE_TYPE,
  DOCUMENT_SOURCE_TYPES,
  getDocumentSourceTypeLabel,
  type DocumentSourceType,
  type DocumentStatus,
} from "@/features/documents/constants/document-metadata";

type UploadSuccess = {
  success: true;
  documentId: string;
  documentName: string;
  category: DocumentCategory;
  chunkCount: number;
  sourceType: DocumentSourceType;
  country: string;
  status: DocumentStatus;
};

type UploadError = {
  error: string;
};

export function DocumentUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [category, setCategory] = useState<DocumentCategory>(
    DEFAULT_DOCUMENT_CATEGORY,
  );
  const [sourceType, setSourceType] = useState<DocumentSourceType>(
    DEFAULT_DOCUMENT_SOURCE_TYPE,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const file = inputRef.current?.files?.[0];

    if (!file) {
      setErrorMessage("Choose a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("sourceType", sourceType);
    formData.append("country", DEFAULT_DOCUMENT_COUNTRY);

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await parseUploadResponse(response);

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Upload failed.");
      }

      setSuccessMessage(
        `${payload.documentName} uploaded as ${getDocumentCategoryLabel(payload.category)} (${getDocumentSourceTypeLabel(payload.sourceType)}) with ${payload.chunkCount} chunks.`,
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setSelectedFileName(null);
      router.refresh();
    } catch (uploadError) {
      setErrorMessage(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the PDF.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="pdf-file">
          PDF document
        </label>
        <div className="rounded-lg border-2 border-dashed border-primary/25 bg-accent/30 p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              accept="application/pdf,.pdf"
              className="sr-only"
              disabled={isUploading}
              id="pdf-file"
              onChange={(event) =>
                setSelectedFileName(event.target.files?.[0]?.name ?? null)
              }
              ref={inputRef}
              type="file"
            />
            <Button asChild className="cursor-pointer" variant="outline">
              <label htmlFor="pdf-file">Choose PDF file</label>
            </Button>
            <div className="flex min-h-10 flex-1 items-center rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              {selectedFileName ?? "No file selected"}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Text-based PDF, up to 10 MB. Use approved public references, test
            documents, or clearly simulated sources only.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="document-category">
          Document category
        </label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isUploading}
          id="document-category"
          onChange={(event) =>
            setCategory(event.target.value as DocumentCategory)
          }
          value={category}
        >
          {DOCUMENT_CATEGORIES.map((categoryOption) => (
            <option key={categoryOption.value} value={categoryOption.value}>
              {categoryOption.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="document-source-type">
            Source type
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isUploading}
            id="document-source-type"
            onChange={(event) =>
              setSourceType(event.target.value as DocumentSourceType)
            }
            value={sourceType}
          >
            {DOCUMENT_SOURCE_TYPES.map((sourceTypeOption) => (
              <option
                key={sourceTypeOption.value}
                value={sourceTypeOption.value}
              >
                {sourceTypeOption.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Country / scope</p>
          <div className="flex h-10 items-center rounded-md border bg-surface-subtle px-3 text-sm">
            {DEFAULT_DOCUMENT_COUNTRY}
          </div>
        </div>
      </div>
      <Button disabled={isUploading} type="submit">
        <Upload aria-hidden="true" className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload PDF"}
      </Button>
      {successMessage && <Alert>{successMessage}</Alert>}
      {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
    </form>
  );
}

async function parseUploadResponse(
  response: Response,
): Promise<UploadSuccess | UploadError> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as UploadSuccess | UploadError;
  }

  const responseText = await response.text();

  return {
    error: response.ok
      ? "Upload returned an unexpected response."
      : createUploadErrorMessage(response.status, responseText),
  };
}

function createUploadErrorMessage(
  status: number,
  responseText: string,
): string {
  const plainText = responseText
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return `Upload failed with status ${status}.`;
  }

  return `Upload failed with status ${status}: ${plainText.slice(0, 180)}`;
}
