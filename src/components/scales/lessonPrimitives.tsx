/**
 * The prose building blocks every scale lesson composes.
 *
 * Lessons are server components (the words ship as static HTML); these
 * pieces are plain functions with no hooks, so they stay server-safe. The
 * only client leaves are <RootName> / <NoteAt>, which keep the prose true
 * when the reader transposes.
 *
 * Voice: one idea per section, and the widget that plays that idea directly
 * under it. Mono for anything machine-precise (note names, degrees).
 */
import Link from "next/link";
import type { ReactNode } from "react";

import type { ScaleDegree } from "@/lib/music/scaleCatalog";
import { cn } from "@/lib/utils";
import { H2, P, PROSE_LINK, ProseList } from "@/components/content/prose";
import { NoteAt, RootName } from "./LessonInline";

export { H2, P, ProseList };

export function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-foreground">{children}</span>;
}

/** Inline link to another page in the app, styled for lesson prose. */
export function LessonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={PROSE_LINK}>
      {children}
    </Link>
  );
}

/** The standard opening paragraph: how to read a lesson page. */
export function LessonIntro() {
  return (
    <P>
      This page is a lesson, not a poster. Read it top to bottom; every
      section has something to press, and the whole page follows one root and
      one octave — change either and everything below changes with it. If the
      low keys are hard to hear on your speaker, use <Mono>Octave +</Mono> to
      lift the whole lesson.
    </P>
  );
}

export interface LessonSource {
  label: string;
  url: string;
}

/**
 * Where the lesson's specific claims come from. Scale lessons are not
 * history articles (no footnote apparatus), but a number or a name we
 * took from someone still gets pointed at.
 */
export function Sources({ items }: { items: LessonSource[] }) {
  return (
    <div className="mt-10 border-t pt-4">
      <h2 className="text-base font-medium text-muted-foreground">Sources</h2>
      <ul className="mt-2 space-y-1 text-base text-muted-foreground">
        {items.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface DegreeRow extends ScaleDegree {
  /** What the degree is, in plain words ("lowered third"). */
  role: string;
}

interface DegreeTableProps {
  rows: DegreeRow[];
  /** Offset that gets the burnt-orange spotlight — the note the lesson is about. */
  spotlightOffset?: number;
  className?: string;
}

/**
 * Degree · half steps above the root · the note in the current root · role.
 * The third column is live: transpose the page and it re-renders.
 */
export function DegreeTable({ rows, spotlightOffset, className }: DegreeTableProps) {
  return (
    <div className={cn("mt-4 overflow-hidden rounded-md border", className)}>
      <table className="w-full text-base">
        <thead className="bg-muted/30 text-base text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              Degree
            </th>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              Half steps (keys) above the root
            </th>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              In <RootName />
            </th>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              What it is
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const spot = row.offset === spotlightOffset;
            return (
              <tr
                key={row.offset}
                className={spot ? "border-t bg-orange-700/10" : "border-t"}
              >
                <td
                  className={cn(
                    "px-3 py-2 font-mono",
                    spot ? "text-orange-600" : "text-foreground",
                  )}
                >
                  {row.label}
                </td>
                <td className="px-3 py-2 font-mono text-muted-foreground">
                  {row.offset}
                </td>
                <td className="px-3 py-2">
                  <NoteAt offset={row.offset} />
                </td>
                <td className="px-3 py-2 text-muted-foreground">{row.role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
