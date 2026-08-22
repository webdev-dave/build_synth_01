/**
 * Lesson registry — the single list of theory lessons the app knows about.
 *
 * Today every lesson is a "coming soon" placeholder page; the mini-lessons in
 * the synth's learning panel link here. When a lesson gets real content
 * (see docs/plans/lessons-module.md), it graduates without changing any of
 * the links that point at it.
 */

export interface Lesson {
  slug: string;
  title: string;
  /** One-liner shown on the index card and the placeholder page. */
  summary: string;
}

export const LESSONS: Lesson[] = [
  {
    slug: "scales",
    title: "Scales",
    summary:
      "What a scale is, how whole and half steps shape it, and why C major lives on the white keys.",
  },
  {
    slug: "scale-degrees",
    title: "Scale degrees",
    summary:
      "Numbering notes 1–7 from the root — the map that makes melodies and chords portable to any key.",
  },
  {
    slug: "chords",
    title: "Chords",
    summary:
      "Stacking notes into triads, and what makes a chord sound major, minor, or unresolved.",
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
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
