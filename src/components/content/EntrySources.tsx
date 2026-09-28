/**
 * Bibliography at the bottom of a catalog spoke (song, artist, and the
 * same slot on any other entry page).
 *
 * Same list history articles use (`SourceList`): numbered, the title is
 * the link, nothing is buried mid-page. An empty list still renders the
 * heading — a page that makes claims without naming where they came from
 * should look unfinished.
 */
import { SourceList } from "@/components/history/citations";
import type { Source } from "@/lib/history/registry";

export interface EntryCredit {
  label: string;
  url?: string;
}

function toSources(items: EntryCredit[]): Source[] {
  return items.map((item, i) => ({
    id: `credit-${i + 1}`,
    title: item.label,
    url: item.url,
  }));
}

export function EntrySources({ items }: { items: EntryCredit[] }) {
  if (items.length === 0) {
    return (
      <section className="mt-12" aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="text-base font-medium text-muted-foreground"
        >
          Sources &amp; further reading
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Sources for this page are not listed yet.
        </p>
      </section>
    );
  }

  return <SourceList sources={toSources(items)} />;
}
