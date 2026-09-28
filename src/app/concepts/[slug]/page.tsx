import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  CONCEPTS,
  getConcept,
  conceptHome,
  conceptQuestion,
} from "@/lib/concepts/registry";
import { getGenre } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import { getArticle } from "@/lib/history/registry";
import { getCatalogSong, songAttribution } from "@/lib/catalog/songs";
import { getConceptContent } from "@/content/concepts";
import { HubLink } from "@/components/content/HubLink";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PageMapSection } from "@/components/map/PageMapSection";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { WordBanner } from "@/components/words/WordBanner";
import { MovedLesson } from "@/components/lessons/MovedLesson";
import { getWord } from "@/lib/words/registry";

interface ConceptPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  // Every concept gets a page here. Glossary-owned ones render the
  // definition; delegated ones (e.g. "12-bar blues" → its progression
  // lesson, which used to be a glossary page and is in old sitemaps)
  // render a moved notice instead of 404ing — a static export has no
  // server redirects. Former house spelling still generates so
  // /concepts/krekhts can redirect.
  return [
    ...CONCEPTS.map((concept) => ({ slug: concept.slug })),
    { slug: "krekhts" },
  ];
}

export async function generateMetadata({
  params,
}: ConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) return { title: "Concept" };
  if (concept.href !== conceptHome(concept.slug)) {
    return {
      title: `${conceptQuestion(concept)} — moved`,
      description: concept.micro,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: conceptQuestion(concept),
    description: concept.micro,
    alternates: { canonical: conceptHome(concept.slug) },
    keywords: concept.keywords,
    robots:
      concept.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();
  // Delegated concepts (href points elsewhere) don't render a stub here —
  // the reader is sent on to the page that teaches the term.
  if (concept.href !== conceptHome(concept.slug)) {
    return <MovedLesson title={concept.term} to={concept.href} />;
  }
  // Alias / former-spelling URLs (e.g. /concepts/krekhts) → canonical slug.
  if (slug !== concept.slug) redirect(concept.href);

  const scales = (concept.scales ?? [])
    .map((s) => getScale(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const genres = (concept.genres ?? [])
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const articles = (concept.history ?? [])
    .map((h) => getArticle(h))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const songs = (concept.songs ?? [])
    .map((s) => getCatalogSong(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const Demo = getConceptContent(concept.slug);
  const question = conceptQuestion(concept);
  const word = getWord(concept.slug);
  // Don't re-wrap this page's own term; other loanwords in the definition
  // (e.g. "davening" on the krechtz page) still light up.
  const linkTerms = makeTermLinker({ skip: [concept.slug] });

  const hasLinks =
    scales.length > 0 ||
    genres.length > 0 ||
    articles.length > 0 ||
    songs.length > 0;

  // FAQ schema — the definitional question, answered with the same micro-blurb
  // shown on the page. Honest: the on-page lead is that exact text.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: concept.micro },
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
        <HubLink href="/concepts">All concepts</HubLink>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">{question}</h1>
          {word && <WordBanner word={word} />}
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {linkTerms(concept.micro)}
          </p>
        </header>

        {concept.definition && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {linkTerms(concept.definition)}
          </p>
        )}

        {Demo && (
          <section className="mt-8" aria-labelledby="play-it-heading">
            <h2
              id="play-it-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Play it
            </h2>
            <Demo />
          </section>
        )}

        {hasLinks && (
          <RelatedPages
            heading="See it in action"
            headingId="see-it-heading"
            items={[
              ...scales.map((scale) => ({
                href: `/scales/${scale.slug}`,
                label: scale.question,
              })),
              ...genres.map((genre) => ({
                href: `/genres/${genre.slug}`,
                label: genre.question,
              })),
              ...articles.map((article) => ({
                href: `/history/${article.slug}`,
                label: article.question,
              })),
              ...songs.map((song) => ({
                href: `/songs/${song.slug}`,
                label: `“${song.title}” — ${songAttribution(song)}`,
              })),
            ]}
          />
        )}

        {/* Where you'll hear this concept — derived from the genres/history it
            crosses. Renders nothing if none map. */}
        <PageMapSection
          entity={{ genres: concept.genres, history: concept.history }}
          heading="Where you'll hear it"
          fullMapHref={
            concept.genres?.[0] ? `/map?genre=${concept.genres[0]}` : "/map"
          }
        />
      </div>
    </main>
  );
}
