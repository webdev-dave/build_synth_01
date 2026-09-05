import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Languages } from "lucide-react";

import {
  LANGUAGES,
  getLanguage,
  languageGenres,
  languageScales,
  languageConcepts,
  languageHistory,
  languageArtists,
  languageCatalogSongs,
  languageWords,
  wordHref,
} from "@/lib/languages/registry";
import { songAttribution } from "@/lib/catalog/songs";
import type { SongManifestEntry } from "@/lib/songs/types";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PageMapSection } from "@/components/map/PageMapSection";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { NativeScript } from "@/components/words/NativeScript";
import manifestJson from "@/lib/songs/manifest.json";

const MANIFEST = manifestJson as unknown as SongManifestEntry[];

interface LanguagePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((language) => ({ slug: language.slug }));
}

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = getLanguage(slug);
  if (!language) return { title: "Languages" };
  return {
    title: language.question,
    description: language.answer,
    alternates: { canonical: `/languages/${language.slug}` },
    keywords: language.keywords,
    // "soon" languages are lenses onto real content but have no sourced
    // editorial framing yet — keep them out of the index until they're live.
    robots:
      language.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

/** Count of playable Piano Roll arrangements tagged for this language. */
function midiCount(labels: string[] | undefined): number {
  if (!labels || labels.length === 0) return 0;
  const set = new Set(labels);
  return MANIFEST.filter((row) => row.labels?.some((l) => set.has(l))).length;
}

export default async function LanguageDetailPage({
  params,
}: LanguagePageProps) {
  const { slug } = await params;
  const language = getLanguage(slug);
  if (!language) notFound();

  const genres = languageGenres(language);
  const scales = languageScales(language);
  const concepts = languageConcepts(language);
  const history = languageHistory(language);
  const artists = languageArtists(language);
  const songs = languageCatalogSongs(language);
  const words = languageWords(language);
  const arrangements = midiCount(language.midiLabels);
  const linkTerms = makeTermLinker();

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/languages"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All languages
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-2.5">
            <Languages className="h-6 w-6 shrink-0" strokeWidth={1.75} />
            <h1 className="text-3xl font-semibold tracking-tight">
              {language.question}
            </h1>
          </div>
          {language.nativeName && (
            <p className="mt-2 text-lg text-muted-foreground">
              {language.name}
              {" · "}
              <NativeScript
                spelling={language.nativeName}
                lang={language.lang}
              />
            </p>
          )}
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {linkTerms(language.answer)}
          </p>
          {language.about && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {linkTerms(language.about)}
            </p>
          )}
        </header>

        <RelatedPages
          heading="Genres"
          headingId="languages-genres"
          items={genres.map((g) => ({
            href: `/genres/${g.slug}`,
            label: g.question,
          }))}
        />

        <RelatedPages
          heading="Scales & modes"
          headingId="languages-scales"
          items={scales.map((s) => ({
            href: `/scales/${s.slug}`,
            label: s.question,
          }))}
        />

        <RelatedPages
          heading="Concepts"
          headingId="languages-concepts"
          items={concepts.map((c) => ({
            href: c.href,
            label: c.question ?? `What is ${c.term}?`,
          }))}
        />

        <RelatedPages
          heading="Musical history"
          headingId="languages-history"
          items={history.map((a) => ({
            href: `/history/${a.slug}`,
            label: a.question,
          }))}
        />

        <RelatedPages
          heading="Artists"
          headingId="languages-artists"
          items={artists.map((a) => ({
            href: `/artists/${a.slug}`,
            label: a.era ? `${a.name} · ${a.era}` : a.name,
          }))}
        />

        <RelatedPages
          heading="Songs"
          headingId="languages-songs"
          items={songs.map((s) => ({
            href: `/songs/${s.slug}`,
            label: `${s.title} — ${songAttribution(s)}`,
          }))}
        />

        {arrangements > 0 && (
          <RelatedPages
            heading="In the Piano Roll library"
            headingId="languages-midi"
            items={[
              {
                href: "/piano-roll",
                label: `${arrangements} playable arrangement${
                  arrangements === 1 ? "" : "s"
                } — open the library`,
              },
            ]}
          />
        )}

        {words.length > 0 && (
          <section className="mt-10" aria-labelledby="languages-words">
            <h2
              id="languages-words"
              className="text-sm font-medium text-muted-foreground"
            >
              Words in {language.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {words.map((word) => {
                const href = wordHref(word);
                const inner = (
                  <>
                    <span className="font-medium text-foreground">
                      {word.latin}
                    </span>
                    <NativeScript
                      spelling={word.native.spelling}
                      lang={word.native.lang}
                      className="text-muted-foreground"
                    />
                  </>
                );
                return href ? (
                  <Link
                    key={word.id}
                    href={href}
                    className="group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors hover:border-foreground/25 hover:bg-accent/40"
                  >
                    {inner}
                  </Link>
                ) : (
                  <span
                    key={word.id}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                  >
                    {inner}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Where this language's music lives — via the genres/history it
            derives. Renders nothing if none map. */}
        <PageMapSection
          entity={{
            genres: genres.map((g) => g.slug),
            history: history.map((a) => a.slug),
          }}
          heading="Where the music lives"
          fullMapHref={genres[0] ? `/map?genre=${genres[0].slug}` : "/map"}
        />
      </div>
    </main>
  );
}
