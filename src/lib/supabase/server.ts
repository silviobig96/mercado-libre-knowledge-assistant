import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/validation/env";
import type { Database } from "@/lib/supabase/admin";

export function createSupabaseServerClient() {
  const env = getServerEnv();

  return createClient<Database, "public">(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
