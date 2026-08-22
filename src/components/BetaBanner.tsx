import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

import { cn } from "@/lib/utils";

interface BetaBannerProps {
  /** Route of the v2 beta page */
  href: string;
  /** Human name of the tool, e.g. "Synth" */
  toolName: string;
  className?: string;
}

/**
 * Invitation strip shown at the top of legacy pages while their v2 redesign
 * is in beta. Orange = spotlight (asks for the user's eyes once); retire the
 * banner when v2 becomes the default.
 *
 * `font-sans` is set explicitly because some legacy pages override the page
 * font (e.g. Harmonica Lab's serif) and the banner belongs to the new design.
 */
export function BetaBanner({ href, toolName, className }: BetaBannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-4 py-3 font-sans text-card-foreground",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex items-center gap-2.5 text-sm not-italic">
          <FlaskConical className="h-4 w-4 shrink-0 text-orange-600" />
          <span>
            <span className="font-medium">{toolName} v2</span>{" "}
            <span className="text-muted-foreground">
              — a redesigned version of this page is in beta.
            </span>
          </span>
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try the beta
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
