import { NextResponse } from "next/server";

import { clearAdminSessionCookie } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function POST() {
  await clearAdminSessionCookie();

  return NextResponse.json({ success: true });
}
