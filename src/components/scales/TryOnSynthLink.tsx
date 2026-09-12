import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { APP_ICONS } from "@/lib/appIcons";
import { cn } from "@/lib/utils";

interface TryOnSynthLinkProps {
  href: string;
  className?: string;
}

/**
 * Door from a lesson piano into the synth, with the current root + type
 * already selected. Lives under the keys, bottom-right — not in the
 * toolbar above, where it competed with the root picker.
 */
export function TryOnSynthLink({ href, className }: TryOnSynthLinkProps) {
  const SynthIcon = APP_ICONS.synth;
  return (
    <div className={cn("flex justify-end", className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <SynthIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Try it on the synth
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
