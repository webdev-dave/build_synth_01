/**
 * Citation primitives for Musical History articles.
 *
 * Deliberately server components (no "use client") so every quote, footnote,
 * and source link ships in the static HTML — the whole point of the module is
 * sourced prose a reader (or a crawler) can verify without running the app.
 *
 * Footnote numbers derive from a source's position in the article's `sources`
 * array (see src/lib/history/registry.ts), so the inline `[n]` and the numbered
 * bibliography always agree — there is one ordering, not two.
 */
import type { ReactNode } from "react";

import type { Source } from "@/lib/history/registry";

/**
 * Inline superscript footnote. When the source has a URL, it links straight out
 * to the book/website/archive (new tab); otherwise it jumps down to the
 * bibliography entry. The `[n]` matches the numbered list below.
 *
 * Pass `label` (e.g. an attribution like `Library of Congress, "Blues"`) to
 * make the whole label + `[n]` one clickable target — a bigger hit area than a
 * lone superscript.
 */
export function Cite({
  id,
  sources,
  label,
}: {
  id: string;
  sources: Source[];
  label?: string;
}) {
  const i = sources.findIndex((s) => s.id === id);
  if (i === -1) return null;
  const source = sources[i];
  const n = i + 1;
  const external = Boolean(source.url);
  const opens = external ? " (opens in a new tab)" : "";
  return (
    <a
      href={external ? source.url : `#source-${id}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      title={source.title}
      aria-label={
        label
          ? `${label} — source ${n}: ${source.title}${opens}`
          : `Source ${n}: ${source.title}${opens}`
      }
    >
      {label}
      <sup className="ml-0.5 font-mono text-[0.65rem] font-medium leading-none">
        [{n}]
      </sup>
    </a>
  );
}

/** A short, attributed quotation with an optional footnote on the attribution. */
export function Blockquote({
  children,
  attribution,
  cite,
  sources,
}: {
  children: ReactNode;
  attribution?: string;
  cite?: string;
  sources?: Source[];
}) {
  return (
    <figure className="my-6 border-l-2 border-border pl-4">
      <blockquote className="text-sm italic leading-relaxed text-foreground/90">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-2 text-xs text-muted-foreground">
          —{" "}
          {cite && sources ? (
            <Cite id={cite} sources={sources} label={attribution} />
          ) : (
            attribution
          )}
        </figcaption>
      )}
    </figure>
  );
}

/** The numbered "Sources & further reading" bibliography. */
export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="sources-heading">
      <h2
        id="sources-heading"
        className="text-sm font-medium text-muted-foreground"
      >
        Sources &amp; further reading
      </h2>
      <ol className="mt-3 space-y-3">
        {sources.map((s, i) => (
          <li
            key={s.id}
            id={`source-${s.id}`}
            className="scroll-mt-24 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="mr-2 font-mono text-xs text-muted-foreground/70">
              [{i + 1}]
            </span>
            {s.author && <span>{s.author}. </span>}
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline-offset-2 hover:underline"
              >
                {s.title}
              </a>
            ) : (
              <span className="text-foreground">{s.title}</span>
            )}
            {s.publication && (
              <span>
                . <span className="italic">{s.publication}</span>
              </span>
            )}
            {s.year && <span> ({s.year})</span>}
            {s.publicDomain && (
              <span className="ml-1.5 rounded bg-muted px-1 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-muted-foreground">
                Public domain
              </span>
            )}
            {s.access && (
              <span className="text-muted-foreground/70"> · {s.access}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
