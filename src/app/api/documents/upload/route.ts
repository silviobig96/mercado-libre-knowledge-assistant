import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ingestPdfDocument } from "@/features/documents/services/document-ingestion.service";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A PDF file is required." },
        { status: 400 },
      );
    }

    const result = await ingestPdfDocument(file);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusCode(error) },
    );
  }
}

function getStatusCode(error: unknown) {
  if (error instanceof ZodError || error instanceof Error) {
    return 400;
  }

  return 500;
}

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Invalid upload request.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected upload error.";
}
