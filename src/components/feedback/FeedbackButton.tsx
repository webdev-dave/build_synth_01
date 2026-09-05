"use client";

/**
 * FeedbackButton — the one control behind every "Suggest an improvement" and
 * "Contribute" affordance (history articles, map panels, and later songs /
 * artists / genres). It owns the whole flow so callers only say *what* the
 * suggestion is about:
 *
 *   <FeedbackButton targetType="history" targetId="klezmer" subject="this article" />
 *
 * Graceful degradation is the point: before the owner provisions Supabase,
 * the trigger is just a link to /contact — no modal, no auth, nothing to
 * break. Once configured, the same trigger opens a modal that gates on a
 * passwordless sign-in (Google or email magic link) and then shows the form.
 */
import { useEffect, useState } from "react";
import { PenLine, X } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  insertSubmission,
  type SubmissionKind,
  type TargetType,
} from "@/lib/supabase/submissions";
import { cn } from "@/lib/utils";

interface FeedbackButtonProps {
  targetType: TargetType;
  targetId: string;
  /** Human label for the thing, used in the copy ("this article", "Odessa"). */
  subject?: string;
  /** Pre-select the suggestion kind (unmapped regions default to "addition"). */
  defaultKind?: SubmissionKind;
  /** Extra classes for the trigger. */
  className?: string;
  /** Trigger label; defaults to "Suggest an improvement". */
  children?: React.ReactNode;
}

const KIND_OPTIONS: { value: SubmissionKind; label: string }[] = [
  { value: "correction", label: "A correction" },
  { value: "addition", label: "Something to add" },
  { value: "source", label: "A better source" },
  { value: "general", label: "General feedback" },
];

export function FeedbackButton({
  targetType,
  targetId,
  subject = "this page",
  defaultKind = "correction",
  className,
  children,
}: FeedbackButtonProps) {
  const { configured } = useAuth();
  const [open, setOpen] = useState(false);

  const triggerClass = cn(
    "text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline",
    className,
  );

  // Before Supabase is wired up, keep the old behaviour: a plain contact link.
  if (!configured) {
    return (
      <a href="/contact" className={triggerClass}>
        {children ?? "Suggest an improvement"}
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        {children ?? "Suggest an improvement"}
      </button>
      {open && (
        <FeedbackModal
          targetType={targetType}
          targetId={targetId}
          subject={subject}
          defaultKind={defaultKind}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ── The modal ────────────────────────────────────────────────────────────

interface FeedbackModalProps {
  targetType: TargetType;
  targetId: string;
  subject: string;
  defaultKind: SubmissionKind;
  onClose: () => void;
}

function FeedbackModal({
  targetType,
  targetId,
  subject,
  defaultKind,
  onClose,
}: FeedbackModalProps) {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Suggest an improvement"
    >
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg border bg-card p-5 shadow-lg sm:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-foreground">
            Suggest an improvement
          </h2>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : user ? (
          <FeedbackForm
            targetType={targetType}
            targetId={targetId}
            subject={subject}
            defaultKind={defaultKind}
            onDone={onClose}
          />
        ) : (
          <SignInStep
            subject={subject}
            signInWithGoogle={signInWithGoogle}
            signInWithEmail={signInWithEmail}
          />
        )}
      </div>
    </div>
  );
}

// ── Sign-in gate ───────────────────────────────────────────────────────────

function SignInStep({
  subject,
  signInWithGoogle,
  signInWithEmail,
}: {
  subject: string;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    setError(null);
    if (!/.+@.+\..+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setSending(true);
    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Check <span className="font-mono text-foreground">{email}</span> for a
        sign-in link. Open it in this browser and you&rsquo;ll come right back
        here to finish your suggestion.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        We write to the best of our knowledge, but {subject} can always get
        better. A quick sign-in lets us credit and follow up on your
        suggestion — that&rsquo;s all it&rsquo;s for.
      </p>

      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <GoogleGlyph />
        Continue with Google
      </button>

      <div className="my-3 flex items-center gap-3 text-xs text-muted-foreground/60">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <label className="block text-xs text-muted-foreground" htmlFor="fb-email">
        Email me a sign-in link
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="fb-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void sendLink()}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={() => void sendLink()}
          disabled={sending}
          className="shrink-0 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ── The suggestion form ──────────────────────────────────────────────────

function FeedbackForm({
  targetType,
  targetId,
  subject,
  defaultKind,
  onDone,
}: {
  targetType: TargetType;
  targetId: string;
  subject: string;
  defaultKind: SubmissionKind;
  onDone: () => void;
}) {
  const [kind, setKind] = useState<SubmissionKind>(defaultKind);
  const [body, setBody] = useState("");
  const [sources, setSources] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      await insertSubmission({
        targetType,
        targetId,
        kind,
        body,
        sources: sources
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Thank you — your suggestion about{" "}
          <span className="text-foreground">{subject}</span> is in. We review
          everything by hand and fold accepted changes into the site.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-4 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-xs text-muted-foreground">
        About <span className="text-foreground">{subject}</span>
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {KIND_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setKind(o.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              kind === o.value
                ? "border-foreground/30 bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        placeholder="What should we fix, add, or reconsider? The more specific, the better."
        className="mt-3 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring"
      />

      <label className="mt-3 block text-xs text-muted-foreground" htmlFor="fb-sources">
        Sources (optional) — links, one per line
      </label>
      <textarea
        id="fb-sources"
        value={sources}
        onChange={(e) => setSources(e.target.value)}
        rows={2}
        placeholder="https://…"
        className="mt-1 w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring"
      />

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting || body.trim().length < 4}
        className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send suggestion"}
      </button>
    </div>
  );
}

/** Minimal Google "G" so we don't pull in a brand-icon dependency. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
