import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { saveChatFeedback } from "@/features/chat/services/chat-feedback.service";

export const runtime = "nodejs";

const chatSourceSchema = z.object({
  id: z.string().min(1),
  documentId: z.string().min(1),
  documentName: z.string().min(1),
  source: z.string().min(1),
  chunkIndex: z.number().int().nonnegative(),
  similarity: z.number(),
  excerpt: z.string(),
});

const chatFeedbackRequestSchema = z.object({
  question: z.string().trim().min(1).max(1000),
  answer: z.string().trim().min(1).max(8000),
  sources: z.array(chatSourceSchema),
  feedback: z.enum(["helpful", "not_helpful"]),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const feedbackInput = chatFeedbackRequestSchema.parse(body);
    const result = await saveChatFeedback(feedbackInput);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusCode(error) },
    );
  }
}

function getStatusCode(error: unknown) {
  if (error instanceof ZodError) {
    return 400;
  }

  return 500;
}

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Invalid chat feedback request.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected chat feedback error.";
}
