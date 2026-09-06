import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PenLine } from "lucide-react";

import { COUSIN_ARTICLES, getCousin } from "@/lib/cousins/registry";
import { getCousinContent } from "@/content/cousins";
import { getGenre } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import { getArticle } from "@/lib/history/registry";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PageMapSection } from "@/components/map/PageMapSection";
import { FeedbackInvite } from "@/components/content/FeedbackInvite";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { WordBanner } from "@/components/words/WordBanner";
import { getWord } from "@/lib/words/registry";
import { HubLink } from "@/components/content/HubLink";
import { GenrePills } from "@/components/content/GenrePills";

interface CousinPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return COUSIN_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: CousinPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getCousin(slug);
  if (!article) return { title: "Cousins" };
  return {
    title: article.question,
    description: article.answer,
    alternates: { canonical: `/cousins/${article.slug}` },
    keywords: article.keywords,
    robots:
      article.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function CousinArticlePage({ params }: CousinPageProps) {
  const { slug } = await params;
  const article = getCousin(slug);
  if (!article) notFound();

  const soon = article.status === "soon";
  const Article = getCousinContent(article.slug);
  const genres = (article.genres ?? [])
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const scales = (article.scales ?? [])
    .map((s) => getScale(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const history = (article.history ?? [])
    .map((h) => getArticle(h))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const word = getWord(article.slug);
  const linkTerms = makeTermLinker();

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
        <HubLink href="/cousins">All cousins</HubLink>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            {article.question}
          </h1>
          {word && <WordBanner word={word} />}
          <GenrePills slugs={article.genres} className="mt-3" />
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {linkTerms(article.answer)}
          </p>
        </header>

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
            ...history.map((item) => ({
              href: `/history/${item.slug}`,
              label: item.question,
            })),
          ]}
        />

        <PageMapSection
          entity={{ places: article.places }}
          heading="Where it traveled"
          fullMapHref="/map"
        />

        {Article && (
          <FeedbackInvite
            targetType="cousin"
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
              The full article is being written — sourced from recordings and
              contemporary accounts, quoted briefly, and linked so you can hear
              the instances yourself.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
