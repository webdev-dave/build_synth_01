"use client";

/**
 * AuthProvider — a thin session context over the Supabase browser client.
 *
 * Auth exists ONLY to attribute contributions; browsing, playing, and reading
 * never touch it. When Supabase is unconfigured the provider is inert
 * (`configured: false`), so nothing that isn't a contribution form ever knows
 * or cares that auth is missing.
 *
 * No passwords: Google SSO or an email magic link. Both redirect back to the
 * page the user left, where supabase-js parses the session out of the URL.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthState {
  /** Whether a Supabase project is wired up at all. */
  configured: boolean;
  /** True until the initial session check resolves. */
  loading: boolean;
  session: Session | null;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** Where OAuth / magic-link should return to (current page, minus any tokens). */
function redirectTarget(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.origin + window.location.pathname;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTarget() },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTarget() },
    });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      user: session?.user ?? null,
      signInWithGoogle,
      signInWithEmail,
      signOut,
    }),
    [loading, session, signInWithGoogle, signInWithEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>.");
  return ctx;
}
