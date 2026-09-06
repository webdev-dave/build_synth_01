/**
 * Submissions — the universal, target-anchored feedback table.
 *
 * One row per suggestion, tied to any content type (a history article, a map
 * place, a song, an artist, a genre) so the same form and table serve every
 * page without redesign. See docs/plans/music-history-map-and-contributions.md
 * (Part 3) and the SQL in supabase/migrations/0001_submissions.sql.
 *
 * Editorial control stays in git: accepted rows are folded into the typed
 * registries by hand. This table is the inbox, not the source of truth.
 */
import { supabase } from "./client";

/** The kind of page a suggestion is about. */
export type TargetType =
  | "history"
  | "place"
  | "song"
  | "artist"
  | "genre"
  | "cousin";

/** What sort of suggestion it is. */
export type SubmissionKind = "correction" | "addition" | "source" | "general";

export interface SubmissionInput {
  targetType: TargetType;
  /** Registry slug / id of the thing being discussed ("klezmer", "odessa"). */
  targetId: string;
  kind: SubmissionKind;
  body: string;
  /** Optional supporting URLs / citations. */
  sources?: string[];
}

/**
 * Insert a suggestion for the signed-in user. RLS requires user_id to equal
 * the caller, so we read the current user and stamp it explicitly. Throws with
 * a friendly message when unconfigured or signed out — callers surface it.
 */
export async function insertSubmission(input: SubmissionInput): Promise<void> {
  if (!supabase) {
    throw new Error("Suggestions aren’t wired up yet — please use the contact page.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Please sign in to send a suggestion.");
  }

  const body = input.body.trim();
  if (body.length < 4) {
    throw new Error("Please write a little more so we can act on it.");
  }

  const { error } = await supabase.from("submissions").insert({
    user_id: user.id,
    target_type: input.targetType,
    target_id: input.targetId,
    kind: input.kind,
    body,
    sources: (input.sources ?? [])
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  });

  if (error) throw new Error(error.message);
}
