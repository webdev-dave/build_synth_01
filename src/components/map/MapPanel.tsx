"use client";

/**
 * MapPanel — the reading pane beside the music-history map.
 *
 * Three states, all honest:
 * - a registry place: name + historical names, the music blurb, and doorways
 *   into /history, /genres, and the Piano Roll library;
 * - an unmapped feature: "not written yet" + an invitation to contribute
 *   (links to /contact until the account-gated feedback flow ships — see
 *   docs/plans/music-history-map-and-contributions.md);
 * - nothing selected: how to read the map.
 */
import Link from "next/link";

import { getPlace, placesByGenre, type Place } from "@/lib/places/registry";
import { getArticle, getArticleByGenre } from "@/lib/history/registry";
import { getGenre } from "@/lib/genres/registry";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import type { TargetType } from "@/lib/supabase/submissions";
import type { MapSelection } from "./MusicMap";

interface MapPanelProps {
  selection: MapSelection | null;
  /** Active genre filter, if any — drives the genre overview state. */
  genre: string | null;
  /** Piano Roll tune counts per manifest label, computed server-side. */
  songCounts: Record<string, number>;
  /** Jump to a place (from the genre overview's region list). */
  onPickPlace: (id: string) => void;
}

const KIND_LABEL: Record<Place["kind"], string> = {
  country: "country",
  state: "state",
  region: "region",
  city: "city",
  "historical-region": "historical region",
};

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <aside
      aria-live="polite"
      className="flex min-h-[16rem] flex-col rounded-lg border bg-card/50 p-4 sm:p-5"
    >
      {children}
    </aside>
  );
}

/** The humble-feedback footer every content view carries. */
function ContributeFooter({
  targetType,
  targetId,
  subject,
}: {
  targetType: TargetType;
  targetId: string;
  subject: string;
}) {
  return (
    <p className="mt-auto border-t pt-3 text-xs leading-relaxed text-muted-foreground/70">
      Written to the best of our knowledge — corrections and additions are
      welcome.{" "}
      <FeedbackButton
        targetType={targetType}
        targetId={targetId}
        subject={subject}
        className="text-xs"
      >
        Suggest an improvement
      </FeedbackButton>
    </p>
  );
}

export function MapPanel({
  selection,
  genre,
  songCounts,
  onPickPlace,
}: MapPanelProps) {
  const linkTerms = makeTermLinker();

  // ── A genre filter is on, with no specific place picked: genre overview ───
  if (!selection && genre) {
    const genreData = getGenre(genre);
    const article = getArticleByGenre(genre);
    const places = placesByGenre(genre);
    const label = genreData?.name ?? genre;
    return (
      <PanelShell>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {label}
        </h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          genre · {places.length} places mapped
        </p>
        {genreData && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {linkTerms(genreData.answer)}
          </p>
        )}

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
          Places on the map
        </p>
        <ul className="mt-2 flex flex-col gap-0.5">
          {places.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPickPlace(p.id)}
                className="w-full rounded px-1.5 py-1 text-left text-sm text-foreground transition-colors hover:bg-muted"
              >
                {p.name}
                <span className="ml-1.5 font-mono text-xs text-muted-foreground/60">
                  {p.kind.replace("-", " ")}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-1.5">
          {article && (
            <Link
              href={`/history/${article.slug}`}
              className="text-sm text-foreground underline-offset-2 hover:underline"
            >
              {article.question} →
            </Link>
          )}
          {genreData && (
            <Link
              href={`/genres/${genreData.slug}`}
              className="text-sm text-foreground underline-offset-2 hover:underline"
            >
              {genreData.question} →
            </Link>
          )}
        </div>

        <ContributeFooter
          targetType="genre"
          targetId={genre}
          subject={`the ${label} map`}
        />
      </PanelShell>
    );
  }

  // ── Nothing selected: how to read the map ─────────────────────────────────
  if (!selection) {
    return (
      <PanelShell>
        <h2 className="text-sm font-semibold text-foreground">
          Reading the map
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tinted places have a story we&rsquo;ve written; dots are cities;
          dashed shapes are historical regions — places like the Pale of
          Settlement or the Mississippi Delta that no modern border shows.
          Click anything, or search above, including by historical names
          (Kishinev, Vilna, Bessarabia&hellip;).
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Most of the world is still quiet here. Instrumaps is growing map by
          map — blues and klezmer are written; more stories are coming.
        </p>
        <ContributeFooter
          targetType="place"
          targetId="world-map"
          subject="the map"
        />
      </PanelShell>
    );
  }

  // ── Unmapped feature: honest emptiness + invitation ───────────────────────
  if (selection.kind === "unknown") {
    return (
      <PanelShell>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {selection.label}
        </h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          not mapped yet
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We haven&rsquo;t written this region&rsquo;s musical story yet.
          Instrumaps is growing map by map — as the site builds out, more of
          the world will light up. Please come back.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Know this region&rsquo;s music? We&rsquo;d love your help getting it
          right.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex w-fit items-center rounded-md border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Contribute
        </Link>
      </PanelShell>
    );
  }

  // ── A registry place ──────────────────────────────────────────────────────
  const place = getPlace(selection.id);
  if (!place) return null;

  const historyArticles = (place.music.history ?? [])
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const genres = (place.music.genres ?? [])
    .map((slug) => getGenre(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const tuneCount = (place.music.songLabels ?? []).reduce(
    (sum, label) => sum + (songCounts[label] ?? 0),
    0,
  );

  return (
    <PanelShell>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {place.name}
      </h2>
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        {KIND_LABEL[place.kind]}
        {place.aliases?.map((a) => (
          <span key={a.name}>
            {" · "}
            {a.name}
            {a.era ? (
              <span className="text-muted-foreground/60"> ({a.era})</span>
            ) : null}
          </span>
        ))}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {linkTerms(place.music.blurb)}
      </p>

      {(historyArticles.length > 0 || genres.length > 0 || tuneCount > 0) && (
        <div className="mt-4 flex flex-col gap-1.5">
          {historyArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/history/${article.slug}`}
              className="text-sm text-foreground underline-offset-2 hover:underline"
            >
              {article.question} →
            </Link>
          ))}
          {genres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/genres/${genre.slug}`}
              className="text-sm text-foreground underline-offset-2 hover:underline"
            >
              {genre.question} →
            </Link>
          ))}
          {tuneCount > 0 && (
            <Link
              href="/piano-roll"
              className="text-sm text-foreground underline-offset-2 hover:underline"
            >
              <span className="font-mono">{tuneCount}</span> related tunes in
              the Piano Roll →
            </Link>
          )}
        </div>
      )}

      <ContributeFooter
        targetType="place"
        targetId={place.id}
        subject={place.name}
      />
    </PanelShell>
  );
}
