import { DocumentList } from "@/components/documents/document-list";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listUploadedDocuments } from "@/features/documents/services/document-list.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const documentsResult = await loadDocuments();

  return (
    <AppShell active="admin">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Upload corporate policies, manuals, FAQs, warranty procedures,
              logistics guides, and internal process documents. These documents
              become searchable through the RAG assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploadForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Recent documents available to the assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documentsResult.ok ? (
              <DocumentList documents={documentsResult.documents} />
            ) : (
              <Alert variant="destructive">{documentsResult.error}</Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

async function loadDocuments() {
  try {
    const documents = await listUploadedDocuments();
    return { ok: true as const, documents };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load uploaded documents.",
    };
  }
}
