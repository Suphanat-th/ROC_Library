import { createClient } from "@supabase/supabase-js";

/** The Supabase client with the service key (server only): reads and writes Members. Null when not configured. */
export function adminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
