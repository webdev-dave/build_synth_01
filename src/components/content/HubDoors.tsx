import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface HubDoorItem {
  href: string;
  label: string;
  description?: string;
}

/**
 * Quiet sibling doors on a collection hub (History → map, Songs →
 * artists / cousins). Same card language as RelatedPages, but it sits
 * under the intro instead of in the footer and keeps author order.
 */
export function HubDoors({
  heading,
  headingId,
  items,
}: {
  heading: string;
  headingId: string;
  items: HubDoorItem[];
}) {
  if (items.length === 0) return null;

  return (
    <nav className="mb-8" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-sm font-medium text-muted-foreground">
        {heading}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:border-foreground/25 hover:bg-accent/40"
          >
            <span>
              <span className="block text-sm font-medium text-foreground">
                {item.label}
              </span>
              {item.description && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
