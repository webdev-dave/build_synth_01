/**
 * Lesson registry — the single list of theory lessons the app knows about.
 *
 * Today every lesson is a "coming soon" placeholder page; the mini-lessons in
 * the synth's learning panel link here. When a lesson gets real content
 * (see docs/plans/lessons-module.md), it graduates without changing any of
 * the links that point at it.
 */

import {
  filterByHaystack,
  joinHaystack,
  sortByLabel,
} from "@/lib/search/normalize";

export interface Lesson {
  slug: string;
  title: string;
  /** One-liner shown on the index card and the placeholder page. */
  summary: string;
  /** Where to play the idea until the lesson is written. */
  tryHref?: string;
  tryLabel?: string;
  /**
   * The lesson was written somewhere else. `/lessons/<slug>` redirects there,
   * the hub card and search link straight to it, and old links from the
   * synth's learning panel keep working.
   */
  movedTo?: string;
}

export const LESSONS: Lesson[] = [
  // The two scale lessons graduated into the Scales module — every scale
  // page opens with "what a scale is" and "counting from home".
  {
    slug: "scales",
    title: "Scales",
    summary:
      "What a scale is, how whole and half steps shape it, and why C major lives on the white keys.",
    movedTo: "/scales/major-scale",
  },
  {
    slug: "scale-degrees",
    title: "Scale degrees",
    summary:
      "Numbering notes 1–7 from the root — the map that makes melodies and chords portable to any key.",
    movedTo: "/scales/major-scale#degrees",
  },
  {
    slug: "chords",
    title: "Chords",
    summary:
      "Stacking notes into triads, and what makes a chord sound major, minor, or unresolved.",
    // Moves to /progressions/dominant-seventh once that chord spoke is live;
    // until then the 12-bar lesson's first section teaches the triad → 7th.
    tryHref: "/progressions/twelve-bar-blues#a-chord",
    tryLabel: "Hear a triad become a seventh",
  },
  {
    slug: "twelve-bar-blues",
    title: "The 12-bar blues",
    summary:
      "Three chords, twelve bars, every one a seventh — the chart played bar by bar, with the blues scale laid over it.",
    movedTo: "/progressions/twelve-bar-blues",
  },
  {
    slug: "waveforms",
    title: "Waveforms",
    summary:
      "Sine, square, sawtooth, triangle — why the same note can sound smooth, hollow, or buzzy.",
  },
  {
    slug: "octaves",
    title: "Octaves",
    summary:
      "The doubling rule: why two notes an octave apart share a name and feel like the same note.",
  },
  {
    slug: "frequency",
    title: "Frequency & pitch",
    summary:
      "Pitch as vibrations per second — what the Hz readout actually measures, and why A4 = 440 Hz.",
  },
  {
    slug: "time-signatures",
    title: "Time signatures & timing",
    summary:
      "How bars are counted — 4/4, 3/4, 6/8 — and why moving the bar lines changes the feel without moving the notes.",
    tryHref: "/piano-roll",
    tryLabel: "Open the piano roll",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

function lessonHaystack(lesson: Lesson): string {
  return joinHaystack([
    lesson.title,
    lesson.slug,
    lesson.summary,
    lesson.tryLabel,
  ]);
}

const LESSON_HAY = new Map(LESSONS.map((l) => [l.slug, lessonHaystack(l)]));

export function searchLessons(query: string): Lesson[] {
  return sortByLabel(
    filterByHaystack(
      LESSONS,
      query,
      (lesson) => LESSON_HAY.get(lesson.slug) ?? "",
    ),
    (lesson) => lesson.title,
  );
}
