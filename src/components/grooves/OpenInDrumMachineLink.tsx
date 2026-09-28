import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { APP_ICONS } from "@/lib/appIcons";
import { drumsHrefFor } from "@/lib/grooves/param";
import { cn } from "@/lib/utils";

interface OpenInDrumMachineLinkProps {
  /** Groove slug to open on. */
  slug: string;
  className?: string;
}

/**
 * Door from a lesson grid into the drum machine with this groove loaded —
 * the "Try it on the synth" pattern for rhythm. Under the grid, bottom
 * right, out of the toolbar's way.
 */
export function OpenInDrumMachineLink({ slug, className }: OpenInDrumMachineLinkProps) {
  const Icon = APP_ICONS["drum-machine"];
  return (
    <div className={cn("flex justify-end", className)}>
      <Link
        href={drumsHrefFor(slug)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Open in the drum machine
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
