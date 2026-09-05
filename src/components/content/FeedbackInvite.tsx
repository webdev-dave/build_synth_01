/**
 * FeedbackInvite — the humble footer on articles and map panels.
 *
 * Our histories are written to the best of our knowledge and sourced, but we
 * welcome corrections and additions. The actual flow lives in FeedbackButton:
 * before Supabase is provisioned it links to /contact; once configured it
 * opens the account-gated suggestion modal. See
 * docs/plans/music-history-map-and-contributions.md, Part 3.
 */
import { PenLine } from "lucide-react";

import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import type { TargetType } from "@/lib/supabase/submissions";

interface FeedbackInviteProps {
  /** What page this feedback is about. */
  targetType: TargetType;
  /** Registry slug / id of the target ("klezmer"). */
  targetId: string;
  /** What the feedback would be about, e.g. "this article" or "this region". */
  subject?: string;
}

export function FeedbackInvite({
  targetType,
  targetId,
  subject = "this article",
}: FeedbackInviteProps) {
  return (
    <div className="mt-10 rounded-lg border border-dashed p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <PenLine
          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
          strokeWidth={1.75}
        />
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We wrote {subject} to the best of our knowledge, quoting and
            linking the sources — but music history is bigger than any one
            telling. Corrections, additions, and better sources are genuinely
            welcome.
          </p>
          <FeedbackButton
            targetType={targetType}
            targetId={targetId}
            subject={subject}
            className="mt-2 inline-block text-foreground no-underline hover:underline"
          >
            Suggest an improvement →
          </FeedbackButton>
        </div>
      </div>
    </div>
  );
}
