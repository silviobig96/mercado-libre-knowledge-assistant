import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { answerQuestion } from "@/features/chat/services/chat.service";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  question: z.string().trim().min(1, "Question is required."),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { question } = chatRequestSchema.parse(body);
    const response = await answerQuestion(question);

    return NextResponse.json(response);
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
    return error.issues[0]?.message ?? "Invalid chat request.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected chat error.";
}
