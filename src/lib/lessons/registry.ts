/**
 * Lessons registry — the curriculum index behind `/lessons`.
 *
 * Lessons is the parent; the modules are its children. Every lesson page
 * on the site lives in one of seven *buckets* (concepts, scales,
 * progressions, rhythm, forms, genres, history), each a hub-and-spoke tree
 * with its own registry. This file does not duplicate those registries; it
 * names the buckets, the order a newcomer should read them in, and one
 * "start here" door per bucket. Counts and the layer mapping are derived
 * in `curriculum.ts`.
 *
 * `LESSONS` below is the *legacy* slug table: the first version of
 * `/lessons/<slug>` was a flat list of placeholder pages, and the synth's
 * learning panel and old sitemaps still link there. Every row now has a
 * `movedTo`, so the old URL renders a moved notice and sends the reader
 * on. Do not add new rows here — write the lesson in its module.
 */

/** Bucket ids double as nav ids, so `getAppIcon(bucket.id)` works. */
export type LessonBucketId =
  | "concepts"
  | "scales"
  | "progressions"
  | "rhythm"
  | "forms"
  | "genres"
  | "history";

export interface LessonBucket {
  id: LessonBucketId;
  /** Curriculum name ("Scales & modes"). */
  name: string;
  /** The module hub. */
  href: string;
  /**
   * What the bucket teaches, in the genre-layer vocabulary — "the notes",
   * "the harmony". Mono on the index; the same words the genre page uses.
   */
  teaches: string;
  /** One sentence for the index card. */
  blurb: string;
  /**
   * The page a newcomer should open first. Its title comes from the module
   * registry at render time (`curriculum.ts`), never retyped here.
   */
  startHere: string;
}

/**
 * Reading order: the vocabulary, then pitch (notes → chords), then time
 * (groove and count), then the large shape, then the genres that stack
 * all of those, then where the sound came from.
 */
export const LESSON_BUCKETS: LessonBucket[] = [
  {
    id: "concepts",
    name: "Concepts & terms",
    href: "/concepts",
    teaches: "the vocabulary",
    blurb:
      "Short definitions of the words the other lessons use — steps, root, interval, octave, waveform — each with something to play.",
    startHere: "/concepts/steps",
  },
  {
    id: "scales",
    name: "Scales & modes",
    href: "/scales",
    teaches: "the notes",
    blurb:
      "Which notes a melody draws from, and why each set has its own colour — built on a keyboard you can play in every key.",
    startHere: "/scales/major-scale",
  },
  {
    id: "progressions",
    name: "Chords & progressions",
    href: "/progressions",
    teaches: "the harmony",
    blurb:
      "How a few scale notes stack into a chord, and how chords move through the bars — the chart, the key, and a player that comps it.",
    startHere: "/progressions/twelve-bar-blues",
  },
  {
    id: "rhythm",
    name: "Rhythm & meter",
    href: "/rhythm",
    teaches: "the groove and the count",
    blurb:
      "Where the weight sits and how the bar is counted — grooves on a step grid that sounds every hit, with a feel slider from straight to swung.",
    startHere: "/rhythm/shuffle",
  },
  {
    id: "forms",
    name: "Song forms",
    href: "/forms",
    teaches: "the shape",
    blurb:
      "How bars group into lines, lines into a chorus, and choruses into a song — drawn as a map whose width is time, with the music sounding under it.",
    startHere: "/forms/twelve-bar-blues",
  },
  {
    id: "genres",
    name: "Genres",
    href: "/genres",
    teaches: "where the layers stack",
    blurb:
      "A genre is a stack of those layers. Each genre page opens them one at a time and links back into the lesson that teaches each one.",
    startHere: "/genres/blues",
  },
  {
    id: "history",
    name: "History",
    href: "/history",
    teaches: "where the sound came from",
    blurb:
      "The other half of the story — sourced, quoted, and linked histories of the genres and scales, on a map you can click.",
    startHere: "/history/blues",
  },
];

export function getLessonBucket(id: string): LessonBucket | undefined {
  return LESSON_BUCKETS.find((b) => b.id === id);
}

/** The bucket a page belongs to, by its first path segment. */
export function bucketForPath(path: string): LessonBucket | undefined {
  const segment = path.split("/").filter(Boolean)[0] ?? "";
  return LESSON_BUCKETS.find(
    (b) => b.href.split("/").filter(Boolean)[0] === segment,
  );
}

/** A legacy `/lessons/<slug>` URL and where it went. */
export interface Lesson {
  slug: string;
  title: string;
  /** One-liner — kept for the moved page's metadata and old search results. */
  summary: string;
  /** Where the lesson was written. `/lessons/<slug>` redirects there. */
  movedTo: string;
}

export const LESSONS: Lesson[] = [
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
    // The 12-bar lesson's first section plays a triad becoming a seventh.
    // Point this at /progressions/dominant-seventh when that chord spoke
    // goes live.
    movedTo: "/progressions/twelve-bar-blues#a-chord",
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
    movedTo: "/concepts/waveform",
  },
  {
    slug: "octaves",
    title: "Octaves",
    summary:
      "The doubling rule: why two notes an octave apart share a name and feel like the same note.",
    movedTo: "/concepts/octave",
  },
  {
    slug: "frequency",
    title: "Frequency & pitch",
    summary:
      "Pitch as vibrations per second — what the Hz readout actually measures, and why A4 = 440 Hz.",
    movedTo: "/concepts/frequency",
  },
  {
    slug: "time-signatures",
    title: "Time signatures & timing",
    summary:
      "How bars are counted — 4/4, 3/4, 6/8 — and why moving the bar lines changes the feel without moving the notes.",
    movedTo: "/rhythm/four-four",
  },
  {
    slug: "shuffle",
    title: "The shuffle",
    summary:
      "Every beat split long–short — the blues walk, on a slider from straight to swung, with the hits that never move.",
    movedTo: "/rhythm/shuffle",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
