import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Piano } from "lucide-react";

import {
  SONGS_CATALOG,
  getCatalogSong,
  songAttribution,
  songPageRecordings,
  songTitleParts,
} from "@/lib/catalog/songs";
import { NativeScript } from "@/components/words/NativeScript";
import { getArtist } from "@/lib/catalog/artists";
import { getGenre } from "@/lib/genres/registry";
import { getArticle } from "@/lib/history/registry";
import {
  COUSIN_SONG_HEADING,
  cousinSongLinkLabel,
  getCousinsBySong,
} from "@/lib/cousins/registry";
import { getConcept, conceptQuestion } from "@/lib/concepts/registry";
import { sortByLabel } from "@/lib/search/normalize";
import { YouTubeEmbed } from "@/components/media/YouTubeEmbed";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { SongLyrics } from "@/components/catalog/SongLyrics";
import { GenrePills } from "@/components/content/GenrePills";
import { PageMapSection } from "@/components/map/PageMapSection";
import { HubLink } from "@/components/content/HubLink";

interface SongPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SONGS_CATALOG.map((song) => ({ slug: song.slug }));
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getCatalogSong(slug);
  if (!song) return { title: "Song" };
  return {
    title: `${song.title} — ${songAttribution(song)}`,
    description: song.micro,
    alternates: { canonical: `/songs/${song.slug}` },
    keywords: song.keywords,
    robots:
      song.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params;
  const song = getCatalogSong(slug);
  if (!song) notFound();

  const artists = song.artists
    .map((s) => getArtist(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const genres = sortByLabel(
    (song.genres ?? [])
      .map((g) => getGenre(g))
      .filter((g): g is NonNullable<typeof g> => Boolean(g)),
    (g) => g.name,
  );
  const articles = sortByLabel(
    (song.history ?? [])
      .map((h) => getArticle(h))
      .filter((a): a is NonNullable<typeof a> => Boolean(a)),
    (a) => a.name,
  );
  const concepts = sortByLabel(
    (song.concepts ?? [])
      .map((c) => getConcept(c))
      .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    (c) => c.term,
  );
  const cousins = getCousinsBySong(song.slug);
  const linkTerms = makeTermLinker();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is “${song.title}”?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: song.micro ?? `${song.title} — ${songAttribution(song)}.`,
        },
      },
    ],
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <HubLink href="/songs">All songs</HubLink>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            {song.title}
          </h1>
          {/* Non-English songs name the tune in both languages. */}
          {(() => {
            const t = songTitleParts(song);
            if (!t.native && !t.english) return null;
            return (
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                {t.native && (
                  <NativeScript
                    spelling={t.native}
                    lang={t.lang ?? "und"}
                    className="text-base text-foreground"
                  />
                )}
                {t.english && (
                  <span>
                    “{t.english}”
                    <span className="ms-1 text-xs">in English</span>
                  </span>
                )}
              </p>
            );
          })()}
          {/* Attribution with each artist linked into the catalog. */}
          <p className="mt-1 text-sm text-muted-foreground">
            {artists.length > 0 ? (
              artists.map((artist, i) => (
                <span key={artist.slug}>
                  {i > 0 && (i === artists.length - 1 ? " & " : ", ")}
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    {artist.name}
                  </Link>
                </span>
              ))
            ) : (
              <span>{songAttribution(song)}</span>
            )}
            {song.year && <span> · {song.year}</span>}
          </p>
          <GenrePills slugs={song.genres} className="mt-3" />
          {cousins.length > 0 && (
            <section className="mt-4" aria-labelledby="cousins-heading">
              <h2
                id="cousins-heading"
                className="text-sm font-medium text-muted-foreground"
              >
                {COUSIN_SONG_HEADING}
              </h2>
              <div className="mt-2 space-y-2">
                {cousins.map((cousin) => (
                  <CatalogLink
                    key={cousin.slug}
                    href={`/cousins/${cousin.slug}`}
                    label={cousinSongLinkLabel(cousin, cousins.length)}
                  />
                ))}
              </div>
            </section>
          )}
          {song.micro && (
            <p className="mt-4 text-base leading-relaxed text-foreground">
              {linkTerms(song.micro)}
            </p>
          )}
          {song.about &&
            song.about.split(/\n\n+/).map((para, i) => (
              <p
                key={i}
                className="mt-4 text-sm leading-relaxed text-muted-foreground"
              >
                {linkTerms(para)}
              </p>
            ))}
        </header>

        <div className="mt-6 space-y-8">
          {song.listen && songPageRecordings(song).length === 0 && (
            <div>
              <a
                href={song.listen.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-foreground underline-offset-2 hover:underline"
              >
                {song.listen.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                No verified YouTube upload — this is the archive holding the
                recording.
              </p>
            </div>
          )}
          {songPageRecordings(song).map((recording) => (
            <div key={recording.youtubeId}>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                {recording.label}
              </h2>
              <YouTubeEmbed
                videoId={recording.youtubeId}
                title={`${song.title} — ${recording.label}`}
              />
              <div className="mt-2">
                <a
                  href={`https://www.youtube.com/watch?v=${recording.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                >
                  Watch on YouTube
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </div>
            </div>
          ))}
          {song.pianoRollId && (
            <Link
              href={`/piano-roll/${song.pianoRollId}`}
              className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Piano className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Open in Piano Roll
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          )}
        </div>

        {song.lyrics && song.lyrics.length > 0 && (
          <SongLyrics versions={song.lyrics} />
        )}

        {(genres.length > 0 || articles.length > 0 || concepts.length > 0) && (
          <section className="mt-10" aria-labelledby="context-heading">
            <h2
              id="context-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Where it belongs
            </h2>
            <div className="mt-3 space-y-2">
              {genres.map((genre) => (
                <CatalogLink
                  key={`g-${genre.slug}`}
                  href={`/genres/${genre.slug}`}
                  label={genre.question}
                />
              ))}
              {articles.map((article) => (
                <CatalogLink
                  key={`h-${article.slug}`}
                  href={`/history/${article.slug}`}
                  label={article.question}
                />
              ))}
              {concepts.map((concept) => (
                <CatalogLink
                  key={`c-${concept.slug}`}
                  href={concept.href}
                  label={conceptQuestion(concept)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Where it comes from — derived from the song's genres/history.
            Renders nothing if none map. */}
        <PageMapSection
          entity={{ genres: song.genres, history: song.history }}
          heading="Where it comes from"
          fullMapHref={
            song.genres?.[0] ? `/map?genre=${song.genres[0]}` : "/map"
          }
        />
      </div>
    </main>
  );
}

function CatalogLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:border-foreground/25 hover:bg-accent/40"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
