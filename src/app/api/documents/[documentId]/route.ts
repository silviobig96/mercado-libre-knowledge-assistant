import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import {
  deleteUploadedDocument,
  DocumentNotFoundError,
} from "@/features/documents/services/document-delete.service";
import {
  requireAdminSession,
  UnauthorizedAdminError,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const routeParamsSchema = z.object({
  documentId: z.uuid("Document id must be a valid UUID."),
});

type DeleteDocumentRouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: DeleteDocumentRouteContext,
) {
  try {
    await requireAdminSession();

    const params = routeParamsSchema.parse(await context.params);
    const result = await deleteUploadedDocument(params.documentId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusCode(error) },
    );
  }
}

function getStatusCode(error: unknown) {
  if (error instanceof UnauthorizedAdminError) {
    return 401;
  }

  if (error instanceof ZodError) {
    return 400;
  }

  if (error instanceof DocumentNotFoundError) {
    return 404;
  }

  return 500;
}

function getErrorMessage(error: unknown) {
  if (error instanceof UnauthorizedAdminError) {
    return "Unauthorized.";
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Invalid document delete request.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected document delete error.";
}
