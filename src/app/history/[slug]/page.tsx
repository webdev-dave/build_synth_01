import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PenLine } from "lucide-react";

import { HISTORY_ARTICLES, getArticle } from "@/lib/history/registry";
import { getHistoryContent } from "@/content/history";
import { getGenre } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import { RelatedPages } from "@/components/content/RelatedPages";
import { FeedbackInvite } from "@/components/content/FeedbackInvite";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { WordBanner } from "@/components/words/WordBanner";
import { getWord } from "@/lib/words/registry";

interface HistoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return HISTORY_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Musical history" };
  return {
    title: article.question,
    description: article.answer,
    alternates: { canonical: `/history/${article.slug}` },
    keywords: article.keywords,
    // "soon" pages are thin placeholders — keep them out of the index until
    // the sourced article body lands.
    robots:
      article.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function HistoryArticlePage({
  params,
}: HistoryPageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const soon = article.status === "soon";
  const Article = getHistoryContent(article.slug);
  const genres = article.genres
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const scales = article.scales
    .map((s) => getScale(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const word = getWord(article.slug);
  const linkTerms = makeTermLinker();

  // FAQ schema — the question this article answers, in a form answer engines
  // lift and cite. Honest: the on-page lead is the same text.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: article.question,
        acceptedAnswer: { "@type": "Answer", text: article.answer },
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
          href="/history"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All history
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            {article.question}
          </h1>
          {word && <WordBanner word={word} />}
          {/* Lead answer: the quotable summary, in real HTML so crawlers and
              answer engines see it without running the app. */}
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {linkTerms(article.answer)}
          </p>
        </header>

        {/* Full sourced article body when written; prose stays server-rendered
            so quotes and footnotes are crawlable. */}
        {Article && <Article />}

        <RelatedPages
          heading="Take it apart"
          headingId="related-heading"
          items={[
            ...genres.map((genre) => ({
              href: `/genres/${genre.slug}`,
              label: genre.question,
            })),
            ...scales.map((scale) => ({
              href: `/scales/${scale.slug}`,
              label: scale.question,
            })),
          ]}
        />

        {Article && (
          <FeedbackInvite
            targetType="history"
            targetId={article.slug}
            subject="this article"
          />
        )}

        {!Article && soon && (
          <div className="mt-10 rounded-lg border border-dashed p-6 text-center">
            <PenLine
              className="mx-auto h-5 w-5 text-muted-foreground"
              strokeWidth={1.75}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              The full article is being written — sourced from original writing
              and recordings, quoted briefly, and linked back so you can read
              and hear them yourself. For now, take the sound apart on the pages
              above.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
