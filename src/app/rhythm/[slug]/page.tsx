import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GROOVES, getGroove } from "@/lib/grooves/registry";
import { getGenre } from "@/lib/genres/registry";
import { getGrooveContent } from "@/content/grooves";
import { Badge } from "@/components/ui/badge";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { LessonSpoke } from "@/components/lessons/LessonSpoke";
import { LessonAliases } from "@/components/lessons/LessonAliases";
import { faqJsonLd, lessonDescription } from "@/lib/lessons/types";

interface GroovePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GROOVES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GroovePageProps): Promise<Metadata> {
  const { slug } = await params;
  const groove = getGroove(slug);
  if (!groove) return { title: "Rhythm" };
  return {
    title: groove.question,
    description: lessonDescription(groove, groove.aliases),
    alternates: { canonical: `/rhythm/${groove.slug}` },
    keywords: [...groove.keywords, ...groove.aliases],
    robots: groove.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function GroovePage({ params }: GroovePageProps) {
  const { slug } = await params;
  const groove = getGroove(slug);
  if (!groove) notFound();

  const soon = groove.status === "soon";
  const isMeter = groove.kind === "meter";
  const Lesson = getGrooveContent(groove.slug);
  const genres = groove.usedIn
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const meter = groove.meter ? getGroove(groove.meter) : undefined;
  const grooves = isMeter ? GROOVES.filter((g) => g.meter === groove.slug) : [];
  const foil = groove.compareWith ? getGroove(groove.compareWith) : undefined;

  // The page's own concept is skipped so "the [shuffle]" isn't wrapped on the
  // shuffle page; the lesson body defines terms where a beginner needs them.
  const skip = ["shuffle", "backbeat", "time-signature"].filter(
    (id) => id === groove.slug || (isMeter && id === "time-signature"),
  );
  const linkTerms = makeTermLinker({ skip });

  return (
    <LessonSpoke
      hubHref="/rhythm"
      hubLabel="All rhythm & meter"
      question={groove.question}
      badges={
        <>
          {isMeter && <Badge variant="outline">Meter</Badge>}
          {soon && <Badge variant="secondary">Coming soon</Badge>}
        </>
      }
      aliases={<LessonAliases aliases={groove.aliases} variant="header" className="mt-3" />}
      lead={linkTerms(groove.answer)}
      history={groove.history ? linkTerms(groove.history) : undefined}
      jsonLd={faqJsonLd(groove, groove.aliases)}
      quickReference={[
        { label: isMeter ? "Count" : "Pattern", value: groove.formula },
        { label: "Cue", value: groove.pattern.cue },
        ...(meter ? [{ label: "Meter", value: meter.name }] : []),
        { label: "Opens at", value: `${groove.pattern.bpm} BPM` },
      ]}
      exploreHref="/rhythm"
      exploreLabel="Explore all rhythm & meter"
      related={[
        ...genres.map((genre) => ({ href: `/genres/${genre.slug}`, label: genre.question })),
        ...(meter ? [{ href: `/rhythm/${meter.slug}`, label: `Count it: ${meter.question}` }] : []),
        ...grooves.map((g) => ({ href: `/rhythm/${g.slug}`, label: `Heard here: ${g.question}` })),
        ...(foil ? [{ href: `/rhythm/${foil.slug}`, label: `Compare: ${foil.question}` }] : []),
      ]}
      placeholderCopy={
        isMeter
          ? "A count-along with a click on every beat, and movable bar lines that re-fence the same notes, is being built — so you can hear the meter, not just read its numbers."
          : "A step grid that sounds every hit — with a swing slider, mutable voices, and a side-by-side comparer — is being built, so you can hear the groove, not just read its pattern."
      }
    >
      {Lesson && <Lesson />}
    </LessonSpoke>
  );
}
