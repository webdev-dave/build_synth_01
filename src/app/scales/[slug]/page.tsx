import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SCALES, aliasNames, getScale } from "@/lib/scales/registry";
import { ScaleAliases } from "@/components/scales/ScaleAliases";
import { getGenre } from "@/lib/genres/registry";
import { getArticlesByScale } from "@/lib/history/registry";
import { getCousinsByScale } from "@/lib/cousins/registry";
import { getPosition, posLabel } from "@/lib/harmonica";
import { getScaleContent } from "@/content/scales";
import { Badge } from "@/components/ui/badge";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { LessonSpoke } from "@/components/lessons/LessonSpoke";
import { faqJsonLd, lessonDescription } from "@/lib/lessons/types";
import { getWord } from "@/lib/words/registry";

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
    description: lessonDescription(scale, alts),
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

  return (
    <LessonSpoke
      hubHref="/scales"
      hubLabel="All scales"
      question={scale.question}
      badges={
        <>
          {scale.kind === "mode" && <Badge variant="outline">Mode</Badge>}
          {soon && <Badge variant="secondary">Coming soon</Badge>}
        </>
      }
      word={word}
      // Other names sit under the title: a reader who arrived by one of
      // them should see it before reading a word of the answer.
      aliases={
        <ScaleAliases aliases={scale.aliases} variant="header" className="mt-3" />
      }
      lead={linkTerms(scale.answer)}
      history={scale.history ? linkTerms(scale.history) : undefined}
      jsonLd={faqJsonLd(scale, aliasNames(scale))}
      quickReference={[
        { label: "Formula", value: scale.formula },
        { label: <>In {scale.exampleKey}</>, value: scale.exampleNotes },
      ]}
      exploreHref="/scales"
      exploreLabel="Explore all scales"
      related={[
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
      placeholderCopy="A playable keyboard that lights up these notes — and an A/B comparison with related scales — is being built, so you can hear the scale, not just read its formula."
    >
      {Lesson && <Lesson />}
    </LessonSpoke>
  );
}
