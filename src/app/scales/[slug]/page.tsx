import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Hammer } from "lucide-react";

import { SCALES, aliasNames, getScale } from "@/lib/scales/registry";
import { ScaleAliases } from "@/components/scales/ScaleAliases";
import { getGenre } from "@/lib/genres/registry";
import { getArticlesByScale } from "@/lib/history/registry";
import { getCousinsByScale } from "@/lib/cousins/registry";
import { getPosition, posLabel } from "@/lib/harmonica";
import { getScaleContent } from "@/content/scales";
import { Badge } from "@/components/ui/badge";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { RelatedPages } from "@/components/content/RelatedPages";
import { WordBanner } from "@/components/words/WordBanner";
import { getWord } from "@/lib/words/registry";
import { HubLink } from "@/components/content/HubLink";

interface ScalePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SCALES.map((scale) => ({ slug: scale.slug }));
}

export async function generateMetadata({
  params,
}: ScalePageProps): Promise<Metadata> {
  const { slug } = await params;
  const scale = getScale(slug);
  if (!scale) return { title: "Scale" };
  const alts = aliasNames(scale);
  return {
    title: scale.question,
    // The alternate names ride in the description too: that is the text a
    // search engine or an LLM quotes, so "also called Bhairavi" must be in it.
    description: alts.length
      ? `${scale.answer} Also called ${alts.join(", ")}.`
      : scale.answer,
    alternates: { canonical: `/scales/${scale.slug}` },
    keywords: [...scale.keywords, ...alts],
    robots: scale.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function ScalePage({ params }: ScalePageProps) {
  const { slug } = await params;
  const scale = getScale(slug);
  if (!scale) notFound();

  const soon = scale.status === "soon";
  const Lesson = getScaleContent(scale.slug);
  const genres = scale.usedIn
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const articles = getArticlesByScale(scale.slug);
  const cousins = getCousinsByScale(scale.slug);
  // A mode the harmonica lab already teaches as a position gets a door into
  // the v2 lab with that position pre-selected.
  const positions = (scale.positions ?? [])
    .map((pos) => getPosition(pos))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // One linker for the page: a concept lights up at its first mention (lead,
  // then history) and isn't repeated. "scale" is skipped — on a scale page
  // it would wrap the page's own name ("the blues [scale]"), and the lesson
  // body defines it deliberately where a beginner needs it.
  const linkTerms = makeTermLinker({ skip: ["scale"] });
  const word = getWord(scale.word ?? scale.slug);

  const alts = aliasNames(scale);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    // The scale as a named thing with its other names, so structured-data
    // consumers can match "Bhairavi thaat" to this page.
    about: {
      "@type": "Thing",
      name: scale.name,
      ...(alts.length ? { alternateName: alts } : {}),
    },
    mainEntity: [
      {
        "@type": "Question",
        name: scale.question,
        acceptedAnswer: { "@type": "Answer", text: scale.answer },
      },
      ...(alts.length
        ? [
            {
              "@type": "Question",
              name: `What else is the ${scale.name.toLowerCase()} called?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `${scale.name} is also known as ${alts.join(", ")}.`,
              },
            },
          ]
        : []),
    ],
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <HubLink href="/scales">All scales</HubLink>

        <header className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight">
              {scale.question}
            </h1>
            {scale.kind === "mode" && <Badge variant="outline">Mode</Badge>}
            {soon && <Badge variant="secondary">Coming soon</Badge>}
          </div>
          {word && <WordBanner word={word} />}
          {/* Other names sit under the title: a reader who arrived by one of
              them should see it before reading a word of the answer. */}
          <ScaleAliases aliases={scale.aliases} variant="header" className="mt-3" />
          <p className="mt-5 text-base leading-relaxed text-foreground">
            {linkTerms(scale.answer)}
          </p>
          {scale.history && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {linkTerms(scale.history)}
            </p>
          )}
        </header>

        {/* The lesson: server-rendered prose with the widgets that play each
            idea interleaved. The formula box below is the quick reference
            once the reader knows what the symbols mean. */}
        {Lesson && <Lesson />}

        <section className="mt-10" aria-labelledby="build-heading">
          <h2
            id="build-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            Quick reference
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-muted/20 p-3">
              <dt className="text-xs text-muted-foreground">Formula</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">
                {scale.formula}
              </dd>
            </div>
            <div className="rounded-md border bg-muted/20 p-3">
              <dt className="text-xs text-muted-foreground">
                In {scale.exampleKey}
              </dt>
              <dd className="mt-1 font-mono text-sm text-foreground">
                {scale.exampleNotes}
              </dd>
            </div>
          </dl>
        </section>

        {/* Deeper scale-by-scale exploration lives on the module hub. */}
        <Link
          href="/scales"
          className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Explore all scales
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <RelatedPages
          heading="Related"
          headingId="related-heading"
          items={[
            ...articles.map((article) => ({
              href: `/history/${article.slug}`,
              label: article.question,
            })),
            ...genres.map((genre) => ({
              href: `/genres/${genre.slug}`,
              label: genre.question,
            })),
            ...cousins.map((cousin) => ({
              href: `/cousins/${cousin.slug}`,
              label: cousin.question,
            })),
            ...positions.map((p) => ({
              href: `/harmonica-lab/v2?position=${p.pos}`,
              // "2nd position (Cross Harp)" — but not "5th position (5th Position)".
              label: /position/i.test(p.name)
                ? `Harmonica: ${posLabel(p.pos)} position`
                : `Harmonica: ${posLabel(p.pos)} position (${p.name})`,
            })),
          ]}
        />

        {!Lesson && (
          <div className="mt-10 rounded-lg border border-dashed p-6 text-center">
            <Hammer
              className="mx-auto h-5 w-5 text-muted-foreground"
              strokeWidth={1.75}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              A playable keyboard that lights up these notes — and an A/B
              comparison with related scales — is being built, so you can hear
              the scale, not just read its formula.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
