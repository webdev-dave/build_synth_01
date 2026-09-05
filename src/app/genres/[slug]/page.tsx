import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

import { GENRES, getGenre } from "@/lib/genres/registry";
import { getArticleByGenre } from "@/lib/history/registry";
import { getScale } from "@/lib/scales/registry";
import { Badge } from "@/components/ui/badge";
import { GenreLayers } from "@/components/genres/GenreLayers";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PageMapSection } from "@/components/map/PageMapSection";
import { WordBanner } from "@/components/words/WordBanner";
import { getWord } from "@/lib/words/registry";

interface GenrePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GENRES.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = getGenre(slug);
  if (!genre) return { title: "Genre" };
  return {
    title: genre.question,
    description: genre.answer,
    alternates: { canonical: `/genres/${genre.slug}` },
    keywords: genre.keywords,
    // "soon" pages are thin placeholders — keep them out of the index until
    // they carry real interactive content.
    robots: genre.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { slug } = await params;
  const genre = getGenre(slug);
  if (!genre) notFound();

  const soon = genre.status === "soon";
  const scales = genre.scales
    .map((s) => getScale(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const history = getArticleByGenre(genre.slug);

  // Light up theory terms in the prose. One linker for the whole page, so each
  // concept is linked at its first mention (lead, then body) and not repeated.
  const linkTerms = makeTermLinker();
  const word = getWord(genre.slug);

  // FAQ schema — the question this page answers, in a form answer engines
  // lift and cite. Honest: the on-page lead is the same text.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: genre.question,
        acceptedAnswer: { "@type": "Answer", text: genre.answer },
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
          href="/genres"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All genres
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight">
              {genre.question}
            </h1>
            {soon && <Badge variant="secondary">Coming soon</Badge>}
          </div>
          {word && <WordBanner word={word} />}
          {/* Lead answer: the quotable definition, in real HTML so crawlers
              and answer engines see it without running the app. */}
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {linkTerms(genre.answer)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {linkTerms(genre.about)}
          </p>
          {history && (
            <Link
              href={`/history/${history.slug}`}
              className="group mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="h-3.5 w-3.5" />
              More on the history of {genre.name.toLowerCase()}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </header>

        <section className="mt-10" aria-labelledby="layers-heading">
          <h2
            id="layers-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            What makes it {genre.name.toLowerCase()}
          </h2>
          <GenreLayers
            layers={genre.signatureLayers}
            defaultOpen={genre.slug === "blues" ? "scale" : undefined}
            scales={scales.map((scale) => ({
              slug: scale.slug,
              name: scale.name,
              question: scale.question,
              answer: scale.answer,
              formula: scale.formula,
              exampleKey: scale.exampleKey,
              exampleNotes: scale.exampleNotes,
            }))}
          />
        </section>

        <RelatedPages
          heading="Related"
          headingId="related-heading"
          items={[
            ...(history
              ? [
                  {
                    href: `/history/${history.slug}`,
                    label: history.question,
                  },
                ]
              : []),
            ...scales.map((scale) => ({
              href: `/scales/${scale.slug}`,
              label: scale.question,
            })),
          ]}
        />

        {/* Where this music lives — renders only if the genre has mapped
            places (blues, klezmer today). */}
        <PageMapSection
          entity={{ genres: [genre.slug] }}
          heading={`Where ${genre.name.toLowerCase()} lives`}
          fullMapHref={`/map?genre=${genre.slug}`}
        />
      </div>
    </main>
  );
}
