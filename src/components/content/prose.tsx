/**
 * Reading-column primitives for every long-form entry — history and cousin
 * articles, scale lessons, and the prose on song / artist / concept / genre
 * pages. One source for type, contrast, measure, and link style, so the
 * house readability rules (`.cursor/rules/history-articles.mdc`, “Reading
 * column”) are a class list, not a habit.
 *
 * Server-safe: no hooks. `OnThisPage` is a native <details>, so the contents
 * list ships in the static HTML.
 */
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Body copy: 18px on a 1.85 line (~33px) — long paragraphs need a size and
 * far more air between lines than UI text does. Captions and notes stay at
 * the 16px floor, so size also separates reading from metadata. A step darker
 * than captions (muted gray is for notes, not for reading a page of it), and
 * a 65-character measure.
 */
export const PROSE_BODY =
  "max-w-[65ch] text-pretty text-lg leading-[1.85] text-foreground/85";

/** The quotable opening answer under an entry's `<h1>`: full foreground. */
export const PROSE_LEAD =
  "max-w-[65ch] text-pretty text-lg leading-[1.85] text-foreground";

/** Gap between paragraphs — a little under one blank line at the body leading. */
export const PROSE_GAP = "mt-6";

/** Section heading. More space above than below, so it binds to what follows. */
export const PROSE_H2 =
  "mt-12 scroll-mt-24 text-balance text-xl font-semibold tracking-tight text-foreground";

/**
 * A link that navigates. Always underlined (thin, quiet) so it reads as a
 * link before hover; the dotted underline is reserved for popover triggers
 * (`<Term>`, `<ArtistLink>`), so the eye can tell "go" from "peek".
 */
export const PROSE_LINK =
  "text-foreground underline decoration-foreground/30 decoration-1 underline-offset-4 transition-colors hover:decoration-foreground";

export interface ProseSection {
  id: string;
  label: string;
}

/**
 * Name an article's sections once. The same record feeds each `<H2>` and the
 * `<OnThisPage>` contents list, in insertion order, so they cannot drift.
 */
export function defineSections<K extends string>(
  labels: Record<K, string>,
): Record<K, ProseSection> {
  const out = {} as Record<K, ProseSection>;
  for (const id of Object.keys(labels) as K[]) {
    out[id] = { id, label: labels[id] };
  }
  return out;
}

export function H2({
  id,
  label,
  children,
}: {
  id: string;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <h2 id={id} className={PROSE_H2}>
      {children ?? label}
    </h2>
  );
}

export function P({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn(PROSE_GAP, PROSE_BODY, className)}>{children}</p>;
}

/** Three or more parallel items — traits, instruments, places — as a list. */
export function ProseList({
  children,
  ordered = false,
}: {
  children: ReactNode;
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <List
      className={cn(
        PROSE_GAP,
        "space-y-3 ps-5 marker:text-muted-foreground",
        ordered ? "list-decimal" : "list-disc",
        PROSE_BODY,
      )}
    >
      {children}
    </List>
  );
}

/** Contents line for an article with four or more sections. */
export function OnThisPage({
  sections,
}: {
  sections: Record<string, ProseSection>;
}) {
  const list = Object.values(sections);
  if (list.length < 4) return null;
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-base text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        On this page
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ol className="mt-2 space-y-1">
        {list.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-base text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
