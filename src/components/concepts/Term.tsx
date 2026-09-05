"use client";

/**
 * An inline music-theory term with a "define on click" popover.
 *
 *   <Term id="pentatonic">pentatonic</Term>
 *
 * The word gets a quiet dotted underline (the classic "there's a definition
 * here" affordance). Clicking pops a small card: a one-line micro-definition
 * from the concepts registry plus a link to the full explanation — which is
 * either the glossary page (`/concepts/<slug>`) or a richer existing page
 * (e.g. the scale page for "pentatonic"). Loanwords also show their native
 * spelling and a listen button (see `src/lib/words/registry.ts`).
 *
 * Client leaf so surrounding article/prose can stay server-rendered. Uses
 * phrasing-level elements only, so it stays valid inside a <p>. Unlike the
 * song player, the popover is a transient overlay (small, text-only, no
 * media) — it never pushes the article's layout around.
 */
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getConcept } from "@/lib/concepts/registry";
import { wordForMention } from "@/lib/words/registry";
import { WordMark } from "@/components/words/WordMark";
import { NativeScript } from "@/components/words/NativeScript";
import { EnglishAlts } from "@/components/words/EnglishAlts";

interface TermProps {
  /** Concept slug in the registry ("pentatonic", "call-and-response"). */
  id: string;
  /**
   * The exact word(s) as they read in the sentence. Defaults to the concept's
   * canonical term, but pass children to match the surrounding prose
   * ("pentatonics", "off-beat accent").
   */
  children?: React.ReactNode;
}

export function Term({ id, children }: TermProps) {
  const concept = getConcept(id);
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

  // Unknown id: render the text plainly rather than a broken affordance.
  // (Loud in dev so a typo'd concept id gets noticed.)
  if (!concept) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<Term> unknown concept id: "${id}"`);
    }
    return <>{children ?? id}</>;
  }

  const label = children ?? concept.term;
  const mention = typeof children === "string" ? children : undefined;
  const word = wordForMention(concept.slug, mention);

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
      {word && (
        <span className="whitespace-nowrap">
          <WordMark word={word} mention={mention ?? concept.term} />
        </span>
      )}

      {open && (
        <span
          id={popoverId}
          role="dialog"
          aria-label={`${concept.term} — definition`}
          className="absolute left-0 top-full z-30 mt-1.5 block w-72 max-w-[min(18rem,calc(100vw-2rem))] rounded-lg border bg-popover p-3 text-left shadow-md"
        >
          <span className="block font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {concept.term}
          </span>
          {word && (
            <span className="mt-0.5 flex items-center gap-2 text-sm text-foreground">
              <NativeScript
                spelling={word.native.spelling}
                lang={word.native.lang}
              />
              <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {word.native.language}
              </span>
            </span>
          )}
          {word && (
            <EnglishAlts
              word={word}
              mention={mention ?? concept.term}
              className="mt-1"
            />
          )}
          <span className="mt-1.5 block text-sm leading-relaxed text-foreground">
            {concept.micro}
          </span>
          <Link
            href={concept.href}
            className="group/more mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Full explanation
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
