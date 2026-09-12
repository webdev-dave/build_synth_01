import Link from "next/link";
import { ArrowRight, Hammer } from "lucide-react";
import type { ReactNode } from "react";

import { HubLink } from "@/components/content/HubLink";
import { RelatedPages, type RelatedPageItem } from "@/components/content/RelatedPages";
import { WordBanner } from "@/components/words/WordBanner";
import type { SpokenWord } from "@/lib/words/registry";

export interface QuickReferenceItem {
  label: ReactNode;
  value: ReactNode;
}

interface LessonSpokeProps {
  /** Back to the module hub ("All scales"). */
  hubHref: string;
  hubLabel: string;
  /** The page question — the <h1>. */
  question: string;
  /** Badges beside the title (kind, Coming soon). */
  badges?: ReactNode;
  /** Loanword banner under the title, when the page's name is one. */
  word?: SpokenWord;
  /** Other names, rendered under the title before the answer. */
  aliases?: ReactNode;
  /** The quotable lead, already run through the page's term linker. */
  lead: ReactNode;
  /** Optional origin paragraph under the lead. */
  history?: ReactNode;
  /** FAQ structured data object (see `faqJsonLd`). */
  jsonLd: object;
  /** The formula box: label/value pairs shown after the lesson body. */
  quickReference: QuickReferenceItem[];
  /** "Explore all scales" link back to the hub, under the quick reference. */
  exploreHref: string;
  exploreLabel: string;
  related: RelatedPageItem[];
  /** Shown in a dashed box when there is no lesson body yet. */
  placeholderCopy: ReactNode;
  /** The lesson body — server prose with client widgets interleaved. */
  children?: ReactNode;
}

/**
 * The frame every lesson spoke shares: hub link, question, lead, body,
 * quick reference, related pages, placeholder. Scales, progressions,
 * grooves, and forms all render through this so a change to the spoke
 * shape is one edit, and module-specific bits arrive through the slots.
 * Server component — the prose ships in static HTML.
 */
export function LessonSpoke({
  hubHref,
  hubLabel,
  question,
  badges,
  word,
  aliases,
  lead,
  history,
  jsonLd,
  quickReference,
  exploreHref,
  exploreLabel,
  related,
  placeholderCopy,
  children,
}: LessonSpokeProps) {
  const hasBody = children != null && children !== false;
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <HubLink href={hubHref}>{hubLabel}</HubLink>

        <header className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight">{question}</h1>
            {badges}
          </div>
          {word && <WordBanner word={word} />}
          {aliases}
          <p className="mt-5 text-base leading-relaxed text-foreground">{lead}</p>
          {history && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {history}
            </p>
          )}
        </header>

        {/* The lesson: server-rendered prose with the widgets that play each
            idea interleaved. The reference box below is the quick lookup
            once the reader knows what the symbols mean. */}
        {children}

        <section className="mt-10" aria-labelledby="build-heading">
          <h2
            id="build-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            Quick reference
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickReference.map((item, i) => (
              <div key={i} className="rounded-md border bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 font-mono text-sm text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Link
          href={exploreHref}
          className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {exploreLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <RelatedPages
          heading="Related"
          headingId="related-heading"
          items={related}
        />

        {!hasBody && (
          <div className="mt-10 rounded-lg border border-dashed p-6 text-center">
            <Hammer
              className="mx-auto h-5 w-5 text-muted-foreground"
              strokeWidth={1.75}
            />
            <p className="mt-3 text-sm text-muted-foreground">{placeholderCopy}</p>
          </div>
        )}
      </div>
    </main>
  );
}
