/**
 * Supabase browser client — the single client-side handle for auth + the
 * submissions table. Static-export friendly: everything runs in the browser,
 * so there is no server component or API route; Row-Level Security (defined in
 * supabase/migrations/) is the enforcement layer, not a Node backend.
 *
 * Config comes from two public env vars (safe to ship — the anon key is meant
 * to be public; RLS guards the data):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Until those are set (i.e. before the owner provisions the project), the
 * client is `null` and `isSupabaseConfigured` is false, so the UI degrades
 * gracefully to the old /contact link instead of throwing.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the two public env vars are present at build time. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * The shared client, or null when unconfigured. Consumers must handle null
 * (see AuthProvider / FeedbackButton), which keeps the app working with no
 * backend during development and before launch.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // We land back on the page we left from; supabase-js parses the
        // OAuth code / magic-link tokens out of the URL on load.
        detectSessionInUrl: true,
      },
    })
  : null;
