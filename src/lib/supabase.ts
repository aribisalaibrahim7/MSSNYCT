import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    console.warn("Supabase: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export default getSupabase;
