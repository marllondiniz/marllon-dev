import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Cliente Supabase com service role — usar apenas no servidor (API routes, Server Components).
 * Nunca exponha SUPABASE_SERVICE_ROLE_KEY no client.
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export type FormSubmission = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  goal: string;
  source: string;
  created_at: string;
};
