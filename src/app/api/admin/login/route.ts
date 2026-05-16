import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import {
  isValidAdminPassword,
  setAdminSessionCookie,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const adminLoginRequestSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { password } = adminLoginRequestSchema.parse(body);

    if (!isValidAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 },
      );
    }

    await setAdminSessionCookie();

    return NextResponse.json({ success: true });
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
    return error.issues[0]?.message ?? "Invalid admin login request.";
  }

  return "Unexpected admin login error.";
}
