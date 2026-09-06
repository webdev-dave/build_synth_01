"use client";

import Link from "next/link";

import { resolveGenres } from "@/lib/search/options";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";

/**
 * Genre tags that open the matching `/genres/[slug]` page.
 *
 * Unknown slugs (MIDI labels like "jewish" that aren't a genre) are skipped,
 * so a pill is never a dead end. Do not nest these inside a parent `<a>` —
 * sit them above a stretched card-hit link (`relative z-10`) instead.
 * Clicks also stop at the pill so they don't fire a parent button.
 */
export function GenrePills({
  slugs,
  className,
  compact = false,
}: {
  slugs?: readonly string[] | null;
  className?: string;
  compact?: boolean;
}) {
  const genres = resolveGenres(slugs);
  if (genres.length === 0) return null;

  return (
    <ul
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label="Genres"
    >
      {genres.map((genre) => (
        <li key={genre.slug}>
          <Link
            href={`/genres/${genre.slug}`}
            title={genre.question}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              badgeVariants({ variant: "outline" }),
              "text-muted-foreground hover:border-foreground/25 hover:bg-accent/40 hover:text-foreground",
              compact && "px-2 py-0 text-[10px] leading-4",
            )}
          >
            {genre.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
