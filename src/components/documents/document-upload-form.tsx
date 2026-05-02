"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UploadSuccess = {
  success: true;
  documentId: string;
  documentName: string;
  chunkCount: number;
};

type UploadError = {
  error: string;
};

export function DocumentUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as UploadSuccess | UploadError;

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Upload failed.");
      }

      setSuccessMessage(
        `${payload.documentName} uploaded with ${payload.chunkCount} chunks.`,
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="pdf-file">
          PDF document
        </label>
        <Input
          accept="application/pdf,.pdf"
          disabled={isUploading}
          id="pdf-file"
          ref={inputRef}
          type="file"
        />
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
