"use client";

/**
 * An inline artist mention with a "who is this" popover.
 *
 *   <ArtistLink id="bessie-smith">Bessie Smith</ArtistLink>
 *
 * The name gets a quiet dotted underline; clicking pops a one-line bio from the
 * artists catalog plus a link to the full page (`/artists/<slug>`). Same
 * transient-overlay behavior as the concept `<Term>` — small, text-only, never
 * pushes the layout. Phrasing-level, so it's valid inside a <p>.
 */
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getArtist } from "@/lib/catalog/artists";
import { GenrePills } from "@/components/content/GenrePills";

interface ArtistLinkProps {
  /** Artist slug in the catalog ("bessie-smith"). */
  id: string;
  /** Name as it reads in the sentence; defaults to the catalog name. */
  children?: React.ReactNode;
}

export function ArtistLink({ id, children }: ArtistLinkProps) {
  const artist = getArtist(id);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (e.target instanceof Node && wrapRef.current.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Unknown id: render the name plainly (loud in dev so typos get caught).
  if (!artist) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<ArtistLink> unknown artist id: "${id}"`);
    }
    return <>{children ?? id}</>;
  }

  const label = children ?? artist.name;

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        className={cn(
          "cursor-help rounded-sm border-b border-dotted border-muted-foreground/50 font-medium text-foreground transition-colors hover:border-foreground",
          open && "border-foreground",
        )}
      >
        {label}
      </button>

      {open && (
        <span
          id={popoverId}
          role="dialog"
          aria-label={`${artist.name} — about`}
          className="absolute left-0 top-full z-30 mt-1.5 block w-72 max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-popover p-3 text-left shadow-md"
        >
          <span className="flex items-baseline justify-between gap-2">
            <span className="block font-medium text-foreground">
              {artist.name}
            </span>
            {artist.era && (
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {artist.era}
              </span>
            )}
          </span>
          <span className="mt-1.5 block text-sm leading-relaxed text-foreground">
            {artist.micro}
          </span>
          {/* `inline`: the popover is span-only so it can open inside a
              prose <p>; a <ul> here would break hydration. */}
          <GenrePills slugs={artist.genres} compact inline className="mt-2" />
          <Link
            href={`/artists/${artist.slug}`}
            className="group/more mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            More about {artist.name}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover/more:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </span>
      )}
    </span>
  );
}
