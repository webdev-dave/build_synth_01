import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { compareByLabel } from "@/lib/search/normalize";

export interface RelatedPageItem {
  href: string;
  label: string;
}

/**
 * Shared footer list for the teaching trees (genres, scales, history,
 * concepts). One card per related page — the same visual language everywhere
 * so a spoke always has a way out to its siblings.
 */
export function RelatedPages({
  heading,
  headingId,
  items,
}: {
  heading: string;
  headingId: string;
  items: RelatedPageItem[];
}) {
  if (items.length === 0) return null;

  const ordered = items
    .slice()
    .sort((a, b) => compareByLabel(a.label, b.label));

  return (
    <section className="mt-10" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-sm font-medium text-muted-foreground">
        {heading}
      </h2>
      <div className="mt-3 space-y-2">
        {ordered.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:border-foreground/25 hover:bg-accent/40"
          >
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
