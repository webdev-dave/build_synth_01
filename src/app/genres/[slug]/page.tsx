import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Hammer } from "lucide-react";

import {
  GENRES,
  getGenre,
  LAYER_INFO,
} from "@/lib/genres/registry";
import { getArticleByGenre } from "@/lib/history/registry";
import { getScale } from "@/lib/scales/registry";
import { Badge } from "@/components/ui/badge";

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
  const foil = genre.compareWith ? getGenre(genre.compareWith) : undefined;
  const history = getArticleByGenre(genre.slug);

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
          {/* Lead answer: the quotable definition, in real HTML so crawlers
              and answer engines see it without running the app. */}
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {genre.answer}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {genre.about}
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
          <ol className="mt-3 space-y-2">
            {genre.signatureLayers.map((layer, i) => (
              <li
                key={layer}
                className="flex gap-3 rounded-md border bg-muted/20 p-3"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wide text-foreground">
                    {LAYER_INFO[layer].label}
                  </span>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {LAYER_INFO[layer].blurb}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {scales.length > 0 && (
          <section className="mt-10" aria-labelledby="scale-heading">
            <h2
              id="scale-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              The scale behind it
            </h2>
            <div className="mt-3 space-y-2">
              {scales.map((scale) => (
                <Link
                  key={scale.slug}
                  href={`/scales/${scale.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:border-foreground/25 hover:bg-accent/40"
                >
                  <span>
                    <span className="text-sm font-medium text-foreground">
                      {scale.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                      {scale.formula}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 rounded-lg border border-dashed p-6 text-center">
          <Hammer
            className="mx-auto h-5 w-5 text-muted-foreground"
            strokeWidth={1.75}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            The interactive layers — a playable groove, a lit-up 12-bar map, and
            {foil ? ` a same-tempo comparison with ${foil.name.toLowerCase()},` : ""}{" "}
            are being built. This page will let you hear each one, not just read
            about it.
          </p>
        </div>
      </div>
    </main>
  );
}
