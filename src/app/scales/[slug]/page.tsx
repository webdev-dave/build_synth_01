import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Hammer } from "lucide-react";

import { SCALES, getScale } from "@/lib/scales/registry";
import { getGenre } from "@/lib/genres/registry";
import { getScaleContent } from "@/content/scales";
import { Badge } from "@/components/ui/badge";

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
  return {
    title: scale.question,
    description: scale.answer,
    alternates: { canonical: `/scales/${scale.slug}` },
    keywords: scale.keywords,
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: scale.question,
        acceptedAnswer: { "@type": "Answer", text: scale.answer },
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
          href="/scales"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All scales
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight">
              {scale.question}
            </h1>
            {scale.kind === "mode" && <Badge variant="outline">Mode</Badge>}
            {soon && <Badge variant="secondary">Coming soon</Badge>}
          </div>
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {scale.answer}
          </p>
          {scale.history && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {scale.history}
            </p>
          )}
        </header>

        {/* Interactive keyboard first — play the scale, then read the
            reference. The prose above stays server-rendered for crawlers. */}
        {Lesson && <Lesson />}

        <section className="mt-10" aria-labelledby="build-heading">
          <h2
            id="build-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            How it&apos;s built
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

        {genres.length > 0 && (
          <section className="mt-10" aria-labelledby="heard-heading">
            <h2
              id="heard-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Where you&apos;ll hear it
            </h2>
            <div className="mt-3 space-y-2">
              {genres.map((genre) => (
                <Link
                  key={genre.slug}
                  href={`/genres/${genre.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:border-foreground/25 hover:bg-accent/40"
                >
                  <span className="text-sm font-medium text-foreground">
                    {genre.name}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

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
