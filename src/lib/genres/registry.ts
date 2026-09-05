/**
 * Genre registry — the single list of genres the Genre Lab knows about.
 *
 * A genre is a *stack of layers* (rhythm, meter, harmony, scale, form,
 * texture); each genre leads with the layer that actually defines it. This
 * registry is the source of truth for the `/genres` hub, the `/genres/[slug]`
 * pages, and the sitemap. Interactive widgets (groove player, 12-bar map)
 * come later — see docs/plans/genre-lab-module.md.
 *
 * Cross-links are data, not hardcoded prose: a genre points at the scale
 * slugs it uses (`scales`), and the scale registry points back (`usedIn`).
 */

export type GenreLayer =
  | "rhythm"
  | "meter"
  | "harmony"
  | "scale"
  | "form"
  | "texture";

/** Shared one-line definition of each layer, reused by hub legend + spokes. */
export const LAYER_INFO: Record<GenreLayer, { label: string; blurb: string }> = {
  rhythm: {
    label: "Rhythm",
    blurb: "Where the weight sits — which beats are loud, which are silent on purpose.",
  },
  meter: {
    label: "Meter",
    blurb: "How the bar is counted: 4/4, 3/4, 12/8, and the feel each one carries.",
  },
  harmony: {
    label: "Harmony",
    blurb: "The chords and how they move — the progression under the melody.",
  },
  scale: {
    label: "Scale",
    blurb: "The collection of notes a melody and solo draw from.",
  },
  form: {
    label: "Form",
    blurb: "The repeating shape of a section — how many bars before it comes around again.",
  },
  texture: {
    label: "Texture",
    blurb: "How the parts are layered: what plays the groove, what fills the space.",
  },
};

export interface Genre {
  /** URL slug under /genres. Kebab-case, no article ("blues", not "the-blues"). */
  slug: string;
  /** Display name for cards and nav ("Blues"). */
  name: string;
  /** Search-shaped question used as the page <h1> and title ("What is the blues?"). */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /**
   * The quotable 1–2 sentence answer, rendered as the page lead. This is what
   * an answer engine lifts and what the meta description mirrors — so it must
   * be true on its own, not a teaser.
   */
  answer: string;
  /** Short crawlable body paragraph (origin / why it matters). Honest, not a bio. */
  about: string;
  /** Layers that define this genre, most-defining first. */
  signatureLayers: GenreLayer[];
  /** Scale registry slugs this genre draws on (first is the signature scale). */
  scales: string[];
  /** Foil genre slug for the "same clock, different feel" comparison, if any. */
  compareWith?: string;
  /** "live" pages are indexed + in the sitemap; "soon" pages are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases woven into metadata. */
  keywords: string[];
}

export const GENRES: Genre[] = [
  {
    slug: "blues",
    name: "Blues",
    question: "What is the blues?",
    summary:
      "A 12-bar form, a shuffle feel, and the blues scale — the stack that became the root of jazz, R&B, and rock.",
    answer:
      "The blues is a musical form that took shape in African-American communities of the southern United States, drawing on older West African traditions of call-and-response and bent pitch. You can recognise it by three things happening at once: a repeating 12-bar chord pattern built on I, IV and V; a shuffle or swung feel; and the blues scale, whose flattened 'blue' notes give it that aching sound.",
    about:
      "Those West African practices traveled with enslaved people and became work songs, field hollers, and spirituals. Out of that music, around the turn of the 20th century in the southern United States, the blues took its familiar shape — and became the root system of jazz, rhythm and blues, and rock and roll. What makes a piece sound like the blues is rarely one thing — it's a stack of layers working together, which is exactly what this page pulls apart.",
    signatureLayers: ["form", "scale", "rhythm", "harmony"],
    scales: ["blues-scale"],
    compareWith: "rock",
    status: "live",
    keywords: [
      "what is the blues",
      "12 bar blues",
      "blues form",
      "blues shuffle",
      "I IV V blues",
      "blues music theory",
    ],
  },
  {
    slug: "rock",
    name: "Rock",
    question: "What makes rock sound like rock?",
    summary:
      "The backbeat — snare on 2 and 4 — plus power chords and a driving straight-eighth feel.",
    answer:
      "Rock leads with a backbeat: the snare cracks on beats 2 and 4 over a steady kick, usually in straight 4/4, with power chords and pentatonic riffs on top.",
    about:
      "Rock grew directly out of the blues, keeping its scale and often its I–IV–V harmony but trading the shuffle for a hard, straight backbeat. It's the natural foil to the blues — same notes, different pulse.",
    signatureLayers: ["rhythm", "harmony", "scale"],
    scales: ["blues-scale"],
    compareWith: "blues",
    status: "soon",
    keywords: ["what makes rock rock", "backbeat", "power chords", "rock rhythm"],
  },
  {
    slug: "reggae",
    name: "Reggae",
    question: "What makes reggae sound like reggae?",
    summary:
      "The one-drop — emphasis on beat 3 — and an offbeat guitar/organ skank on 2 and 4.",
    answer:
      "Reggae leads with rhythm: the 'one-drop' leaves beat 1 empty and lands the weight on beat 3, while a guitar or organ chops the offbeats — the skank — on 2 and 4.",
    about:
      "Reggae is the clearest proof that a genre can be a groove before it is anything else. Its identity lives almost entirely in where the weight falls, which makes it the perfect contrast to a straight rock backbeat.",
    signatureLayers: ["rhythm", "texture", "harmony"],
    scales: [],
    compareWith: "rock",
    status: "soon",
    keywords: ["what makes reggae reggae", "one drop", "reggae skank", "offbeat"],
  },
];

export function getGenre(slug: string): Genre | undefined {
  return GENRES.find((g) => g.slug === slug);
}

/** Genres safe to index (real content), for the sitemap. */
export const LIVE_GENRES = GENRES.filter((g) => g.status === "live");
