import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FORMS, formBars, getForm } from "@/lib/forms/registry";
import { formLyric, formLyricSample } from "@/lib/forms/lyric";
import { getGenre } from "@/lib/genres/registry";
import { getProgression } from "@/lib/progressions/registry";
import { getFormContent } from "@/content/forms";
import { Badge } from "@/components/ui/badge";
import { makeTermLinker } from "@/components/concepts/autoTerm";
import { LessonSpoke } from "@/components/lessons/LessonSpoke";
import { LessonAliases } from "@/components/lessons/LessonAliases";
import { faqJsonLd, lessonDescription } from "@/lib/lessons/types";

interface FormPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return FORMS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: FormPageProps): Promise<Metadata> {
  const { slug } = await params;
  const form = getForm(slug);
  if (!form) return { title: "Song forms" };
  return {
    title: form.question,
    description: lessonDescription(form, form.aliases),
    alternates: { canonical: `/forms/${form.slug}` },
    keywords: [...form.keywords, ...form.aliases],
    robots: form.status === "soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;
  const form = getForm(slug);
  if (!form) notFound();

  const soon = form.status === "soon";
  const Lesson = getFormContent(form.slug);
  const genres = form.usedIn
    .map((g) => getGenre(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const progressions = form.progressions
    .map((p) => getProgression(p))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const foil = form.compareWith ? getForm(form.compareWith) : undefined;
  const lyric = formLyric(form);
  const sample = formLyricSample(form) ?? form.exampleNotes;

  // The page's own concept is skipped so "the [12-bar blues]" isn't wrapped
  // on the 12-bar form page; the lesson body defines terms where needed.
  const skip = form.slug === "twelve-bar-blues" ? ["twelve-bar-blues"] : [];
  const linkTerms = makeTermLinker({ skip });

  return (
    <LessonSpoke
      hubHref="/forms"
      hubLabel="All song forms"
      question={form.question}
      badges={
        <>
          <Badge variant="outline">{formBars(form)} bars</Badge>
          {soon && <Badge variant="secondary">Coming soon</Badge>}
        </>
      }
      aliases={<LessonAliases aliases={form.aliases} variant="header" className="mt-3" />}
      lead={linkTerms(form.answer)}
      history={form.history ? linkTerms(form.history) : undefined}
      jsonLd={faqJsonLd(form, form.aliases)}
      quickReference={[
        { label: "Shape", value: form.formula },
        { label: "Length", value: `${formBars(form)} bars` },
        ...(sample ? [{ label: <>In {form.exampleKey}</>, value: sample }] : []),
        ...(progressions.length
          ? [{ label: "Chords", value: progressions.map((p) => p.name).join(", ") }]
          : []),
      ]}
      exploreHref="/forms"
      exploreLabel="Explore all song forms"
      related={[
        ...genres.map((genre) => ({ href: `/genres/${genre.slug}`, label: genre.question })),
        ...progressions.map((p) => ({
          href: `/progressions/${p.slug}`,
          label: `The chords: ${p.question}`,
        })),
        ...(lyric
          ? [{ href: `/songs/${lyric.song.slug}`, label: `The words: ${lyric.song.title}` }]
          : []),
        ...(foil ? [{ href: `/forms/${foil.slug}`, label: `Compare: ${foil.question}` }] : []),
      ]}
      placeholderCopy="A map of this form — its sections as blocks whose width is bars, with the music sounding underneath and the current bar lit — is being built, so you can hear the shape, not just read its letters."
    >
      {Lesson && <Lesson />}
    </LessonSpoke>
  );
}
