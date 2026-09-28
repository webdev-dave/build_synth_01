import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { ARTISTS, getArtist } from "@/lib/catalog/artists";
import { songsByArtist } from "@/lib/catalog/songs";
import { getGenre } from "@/lib/genres/registry";
import { getArticle } from "@/lib/history/registry";
import { sortByLabel } from "@/lib/search/normalize";
import { SongLink } from "@/components/history/SongLink";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { GenrePills } from "@/components/content/GenrePills";
import { PageMapSection } from "@/components/map/PageMapSection";
import { mapHrefForGenres } from "@/lib/places/registry";
import { HubLink } from "@/components/content/HubLink";
import { EntrySources } from "@/components/content/EntrySources";
import { PROSE_BODY, PROSE_GAP, PROSE_LEAD } from "@/components/content/prose";

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTISTS.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return { title: "Artist" };
  return {
    title: `${artist.name}${artist.era ? ` (${artist.era})` : ""}`,
    description: artist.micro,
    alternates: { canonical: `/artists/${artist.slug}` },
    keywords: artist.keywords,
    robots:
      artist.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const songs = songsByArtist(artist.slug);
  const genres = sortByLabel(
    (artist.genres ?? [])
      .map((g) => getGenre(g))
      .filter((g): g is NonNullable<typeof g> => Boolean(g)),
    (g) => g.name,
  );
  const articles = sortByLabel(
    (artist.history ?? [])
      .map((h) => getArticle(h))
      .filter((a): a is NonNullable<typeof a> => Boolean(a)),
    (a) => a.name,
  );
  const linkTerms = makeTermLinker();

  // FAQ schema — a definitional "who was X" answered with the on-page micro.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Who was ${artist.name}?`,
        acceptedAnswer: { "@type": "Answer", text: artist.micro },
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
        <HubLink href="/artists">All artists</HubLink>

        <header className="mt-6">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            {artist.name}
          </h1>
          {artist.era && (
            <p className="mt-1 font-mono text-base text-muted-foreground">
              {artist.era}
            </p>
          )}
          <GenrePills slugs={artist.genres} className="mt-3" />
          <p className={`mt-4 ${PROSE_LEAD}`}>
            {linkTerms(artist.micro)}
          </p>
        </header>

        {artist.bio &&
          artist.bio.split(/\n\n+/).map((para, i) => (
            <p
              key={i}
              className={`${PROSE_GAP} ${PROSE_BODY}`}
            >
              {linkTerms(para)}
            </p>
          ))}

        {songs.length > 0 && (
          <section className="mt-10" aria-labelledby="songs-heading">
            <h2
              id="songs-heading"
              className="text-base font-medium text-muted-foreground"
            >
              Songs on the site
            </h2>
            <div className="mt-3 space-y-2">
              {songs.map((song) => (
                <div
                  key={song.slug}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1"
                >
                  <p className="text-base leading-relaxed">
                    <SongLink id={song.slug} />
                  </p>
                  <GenrePills slugs={song.genres} compact />
                </div>
              ))}
            </div>
          </section>
        )}

        {(genres.length > 0 || articles.length > 0) && (
          <section className="mt-10" aria-labelledby="context-heading">
            <h2
              id="context-heading"
              className="text-base font-medium text-muted-foreground"
            >
              In context
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
            </div>
          </section>
        )}

        {/* Where they worked — pinned places when set, else derived from the
            genres/history they touch. Renders nothing if none map. */}
        <PageMapSection
          entity={{
            genres: artist.genres,
            history: artist.history,
            places: artist.places,
          }}
          heading={`Where ${artist.name} worked`}
          fullMapHref={mapHrefForGenres(artist.genres)}
        />

        <EntrySources items={artist.links ?? []} />
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
      <span className="text-base font-medium text-foreground">{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
