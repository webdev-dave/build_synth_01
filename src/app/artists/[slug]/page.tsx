import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import { ARTISTS, getArtist } from "@/lib/catalog/artists";
import { songsByArtist } from "@/lib/catalog/songs";
import { getGenre } from "@/lib/genres/registry";
import { getArticle } from "@/lib/history/registry";
import { SongLink } from "@/components/history/SongLink";
import { makeTermLinker } from "@/components/concepts/autoTerm";

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
  const genres = (artist.genres ?? [])
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const articles = (artist.history ?? [])
    .map((h) => getArticle(h))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
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
        <Link
          href="/artists"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All artists
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            {artist.name}
          </h1>
          {artist.era && (
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {artist.era}
            </p>
          )}
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {linkTerms(artist.micro)}
          </p>
        </header>

        {artist.bio && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {linkTerms(artist.bio)}
          </p>
        )}

        {songs.length > 0 && (
          <section className="mt-10" aria-labelledby="songs-heading">
            <h2
              id="songs-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Songs on the site
            </h2>
            <div className="mt-3 space-y-1">
              {songs.map((song) => (
                <p key={song.slug} className="text-sm leading-relaxed">
                  <SongLink id={song.slug} />
                </p>
              ))}
            </div>
          </section>
        )}

        {(genres.length > 0 || articles.length > 0) && (
          <section className="mt-10" aria-labelledby="context-heading">
            <h2
              id="context-heading"
              className="text-sm font-medium text-muted-foreground"
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

        {artist.links && artist.links.length > 0 && (
          <section className="mt-10" aria-labelledby="elsewhere-heading">
            <h2
              id="elsewhere-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Elsewhere
            </h2>
            <ul className="mt-3 space-y-1">
              {artist.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
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
