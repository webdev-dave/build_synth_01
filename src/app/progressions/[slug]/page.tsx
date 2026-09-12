import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PROGRESSIONS, getProgression } from "@/lib/progressions/registry";
import { getGenre } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import { getProgressionContent } from "@/content/progressions";
import { Badge } from "@/components/ui/badge";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { LessonSpoke } from "@/components/lessons/LessonSpoke";
import { LessonAliases } from "@/components/lessons/LessonAliases";
import { faqJsonLd, lessonDescription } from "@/lib/lessons/types";

interface ProgressionPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRESSIONS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProgressionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const progression = getProgression(slug);
  if (!progression) return { title: "Progression" };
  return {
    title: progression.question,
    description: lessonDescription(progression, progression.aliases),
    alternates: { canonical: `/progressions/${progression.slug}` },
    keywords: [...progression.keywords, ...progression.aliases],
    robots:
      progression.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function ProgressionPage({ params }: ProgressionPageProps) {
  const { slug } = await params;
  const progression = getProgression(slug);
  if (!progression) notFound();

  const soon = progression.status === "soon";
  const isChord = progression.kind === "chord";
  const Lesson = getProgressionContent(progression.slug);
  const genres = progression.usedIn
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const scales = progression.scales
    .map((s) => getScale(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const foil = progression.compareWith
    ? getProgression(progression.compareWith)
    : undefined;

  // The page's own name is skipped so "the [12-bar blues]" isn't wrapped on
  // the 12-bar page; the lesson body defines terms where a beginner needs them.
  const skip = progression.slug === "twelve-bar-blues" ? ["twelve-bar-blues"] : [];
  const linkTerms = makeTermLinker({ skip });

  return (
    <LessonSpoke
      hubHref="/progressions"
      hubLabel="All chords & progressions"
      question={progression.question}
      badges={
        <>
          {isChord && <Badge variant="outline">Chord</Badge>}
          {soon && <Badge variant="secondary">Coming soon</Badge>}
        </>
      }
      aliases={
        <LessonAliases aliases={progression.aliases} variant="header" className="mt-3" />
      }
      lead={linkTerms(progression.answer)}
      history={progression.history ? linkTerms(progression.history) : undefined}
      jsonLd={faqJsonLd(progression, progression.aliases)}
      quickReference={[
        { label: isChord ? "Formula" : "Chart", value: progression.formula },
        { label: <>In {progression.exampleKey}</>, value: progression.exampleChords },
        ...(isChord ? [] : [{ label: "Meter", value: progression.meter }]),
      ]}
      exploreHref="/progressions"
      exploreLabel="Explore all chords & progressions"
      related={[
        ...genres.map((genre) => ({
          href: `/genres/${genre.slug}`,
          label: genre.question,
        })),
        ...scales.map((scale) => ({
          href: `/scales/${scale.slug}`,
          label: `Play it over: ${scale.question}`,
        })),
        ...(foil
          ? [{ href: `/progressions/${foil.slug}`, label: `Compare: ${foil.question}` }]
          : []),
      ]}
      placeholderCopy={
        isChord
          ? "A keyboard lit with this chord's tones — in any key, with its role in the blues explained — is being built, so you can hear the chord, not just read its formula."
          : "A playable chart that sounds each bar as it lights — with the chords on a keyboard and the scale over them — is being built, so you can hear the progression, not just read its numerals."
      }
    >
      {Lesson && <Lesson />}
    </LessonSpoke>
  );
}
