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
 * History articles list genre slugs; the page looks them up with
 * `getArticleByGenre`. Update both sides of a pair in the same change.
 */

import { nativeSpellingsOf } from "@/lib/words/registry";
import { filterByHaystack, joinHaystack, sortByLabel } from "@/lib/search/normalize";

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
    signatureLayers: ["scale", "form", "rhythm", "harmony"],
    scales: ["blues-scale", "minor-pentatonic"],
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
    scales: ["blues-scale", "minor-pentatonic"],
    compareWith: "blues",
    status: "soon",
    keywords: ["what makes rock rock", "backbeat", "power chords", "rock rhythm"],
  },
  {
    slug: "klezmer",
    name: "Klezmer",
    question: "What is klezmer?",
    summary:
      "Freygish modes, sobbing ornaments, and dance forms from the freylekhs to the bulgar — the celebration music of Ashkenazi Eastern Europe.",
    answer:
      "Klezmer is the instrumental celebration music of the Ashkenazi Jews of Eastern Europe — historically the trade of professional wedding musicians called klezmorim. You can recognise it by its voice-like ornaments (the sobbing krechtz), its modes — most famously freygish, with its augmented-second leap — and its dance forms: the freylekhs, the bulgar, the hora, the sher.",
    about:
      "Klezmer grew up around the Jewish wedding in the towns of Eastern Europe, absorbing the modes of synagogue prayer and the dance music of its Romanian, Ukrainian, and Ottoman neighbours. Carried to America in the great migration of 1881–1924, it was captured on 78rpm records in New York, nearly silenced by assimilation and the Holocaust, and revived from the 1970s into a global genre. What makes a tune sound like klezmer is a stack of layers — mode, ornament, groove, and form — which is exactly what this page will pull apart.",
    signatureLayers: ["scale", "rhythm", "form", "texture"],
    scales: ["freygish", "ukrainian-dorian", "harmonic-minor"],
    status: "soon",
    keywords: [
      "what is klezmer",
      "klezmer music",
      "freygish scale klezmer",
      "jewish wedding music",
      "bulgar freylekhs dance",
    ],
  },
  {
    slug: "yiddish-theater",
    name: "Yiddish theater",
    question: "What is Yiddish theater music?",
    summary:
      "Composed songs for the Yiddish stage — Second Avenue operetta and the literary Art Theatre — named authors, verse-and-refrain, and the crossover hits that jumped into American pop.",
    answer:
      "Yiddish theater music is the composed song of the Yiddish-speaking stage: show tunes written for named plays by named writers, not dance tunes for a wedding. You can recognise it by a singable verse-and-refrain, a pit-orchestra or piano accompaniment, and a lyric that belongs to a character or a scene — from Second Avenue operettas like “Bei Mir Bistu Shein” to Art Theatre songs like “Dona Dona.”",
    about:
      "The Yiddish stage grew up in Eastern Europe and exploded in New York after the great migration, along Second Avenue — “the Jewish Broadway.” Composers such as Sholom Secunda wrote for musicals that closed in a season and, sometimes, became American hits in English translation. Maurice Schwartz’s Yiddish Art Theatre aimed higher, at literary drama; Aaron Zeitlin’s Esterke (1940–41) is that wing, and Dona Dona is its most-travelled song. Klezmer bands often sat in the pit, which is why the two worlds get collapsed — but a theater song is a written lyric for a play, not a freylekhs.",
    signatureLayers: ["form", "harmony", "texture"],
    scales: [],
    compareWith: "yiddish-folk",
    status: "live",
    keywords: [
      "what is yiddish theater music",
      "yiddish theatre songs",
      "Second Avenue Yiddish stage",
      "Bei Mir Bistu Shein",
      "Dona Dona Yiddish theater",
    ],
  },
  {
    slug: "yiddish-folk",
    name: "Yiddish folk",
    question: "What is a Yiddish folk song?",
    summary:
      "Strophic songs in Yiddish that lived by being sung — lullabies, love songs, work and protest songs — rather than by being written for a stage or a wedding dance.",
    answer:
      "A Yiddish folk song is a song that lived in people’s mouths: usually strophic, often anonymous or treated as traditional, sung in Yiddish for love, work, lullaby, or protest rather than for a play or a wedding set. Collectors later wrote them down; the folk revival sometimes filed theater songs here too, which is how Dona Dona got a second, folk-shaped life.",
    about:
      "Ashkenazi communities sang far more than they danced. Beside the klezmer’s instrumental set sat a huge sung repertoire — lullabies, ballads, workers’ songs — that Yiddishists and songbooks collected in the twentieth century. Some pieces began on the stage and were then sung as if they had always been folk (Theodore Bikel’s “Jewish folk songs” album is that shelf). This page keeps the distinction: folk is how a song lives, theater is how it was written. Dona Dona belongs on both sides of that line.",
    signatureLayers: ["form", "texture", "scale"],
    scales: [],
    compareWith: "yiddish-theater",
    status: "live",
    keywords: [
      "what is a yiddish folk song",
      "yiddish folk songs",
      "folkslid",
      "yiddish lullaby",
      "Dona Dona folk song",
    ],
  },
  {
    slug: "folk-revival",
    name: "Folk revival",
    question: "What was the folk revival?",
    summary:
      "The 1950s–60s Anglo-American movement that put traditional and borrowed songs on guitar and on record — coffeehouses, Newport, protest — and carried “Donna, Donna” around the world.",
    answer:
      "The folk revival was a mid-century Anglo-American movement that treated songs as things you could learn, share, and stand behind: voice and guitar, coffeehouses and festivals, traditional ballads next to new protest songs. Joan Baez’s 1960 “Donna, Donna” is the revival’s most famous meeting with a Yiddish theater lyric — an English cover that made a 1940 stage song a freedom anthem.",
    about:
      "After the war, singers in the United States and Britain reached for older songs — British ballads, spirituals, union tunes, and pieces borrowed from other languages — and put them on records that sold. Newport (1959) and the Vanguard and Elektra catalogs were the circuit. The revival was not a folk culture; it was a way of performing one. That is why Baez and Donovan sit here, not under klezmer: they sang an English Dona Dona, not a wedding dance.",
    signatureLayers: ["texture", "form", "harmony"],
    scales: [],
    compareWith: "yiddish-folk",
    status: "live",
    keywords: [
      "what was the folk revival",
      "1960s folk revival",
      "Joan Baez Donna Donna",
      "Newport Folk Festival",
      "coffeehouse folk",
    ],
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

export interface GenreFilters {
  layer?: GenreLayer;
  status?: "live" | "soon";
}

function genreHaystack(genre: Genre): string {
  return joinHaystack([
    genre.name,
    genre.slug,
    genre.question,
    genre.summary,
    genre.answer,
    genre.about,
    ...genre.keywords,
    ...genre.scales,
    ...genre.signatureLayers,
    ...genre.signatureLayers.map((layer) => LAYER_INFO[layer].label),
    ...nativeSpellingsOf(genre.slug),
  ]);
}

const GENRE_HAY = new Map(GENRES.map((g) => [g.slug, genreHaystack(g)]));

export function searchGenres(
  query: string,
  filters: GenreFilters = {},
): Genre[] {
  let items: readonly Genre[] = GENRES;
  if (filters.layer) {
    items = items.filter((genre) =>
      genre.signatureLayers.includes(filters.layer!),
    );
  }
  if (filters.status) {
    items = items.filter((genre) => genre.status === filters.status);
  }
  return sortByLabel(
    filterByHaystack(items, query, (genre) => GENRE_HAY.get(genre.slug) ?? ""),
    (genre) => genre.name,
  );
}
