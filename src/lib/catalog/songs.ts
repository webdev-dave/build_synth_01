/**
 * Songs catalog — the recordings/compositions the app writes about.
 *
 * The song side of the editorial catalog (see `artists.ts`). A song credits
 * its artists by slug and cross-links to genres/history by slug; the artist
 * page derives its songs with `songsByArtist()`. Articles reference a song by
 * slug — `<SongLink id="st-louis-blues" />` — so the title, attribution,
 * YouTube id, and Piano Roll link all live here, once.
 *
 * `pianoRollId` is the id of a *playable arrangement* in `src/lib/songs` (the
 * MIDI catalog). Set it only when the song is actually in that library; that's
 * what lights up "Open in Piano Roll" instead of greying it out.
 */
import { getArtist } from "./artists";
import { sortByLabel } from "@/lib/search/normalize";

export interface CatalogSong {
  /** URL slug + `<SongLink id>` key + in-page anchor. Kebab-case. */
  slug: string;
  /** Song/composition title ("St. Louis Blues"). */
  title: string;
  /** Artist slugs in credit order (performers and/or composer). */
  artists: string[];
  /**
   * Display attribution override for the inline player (e.g.
   * "Bessie Smith & Louis Armstrong, 1925"). Falls back to
   * `songAttribution()` derived from `artists` + `year`.
   */
  artistLabel?: string;
  /** Year of the referenced recording/publication ("1925"). */
  year?: string;
  /** YouTube video id — verified upload, never from memory. */
  youtubeId: string;
  /** Playable arrangement id in `src/lib/songs`, when we have one. */
  pianoRollId?: string;
  /** One-line note about the song/recording, for the popover and card. */
  micro?: string;
  /** Longer plain-text note for the song spoke page, when the micro isn't enough. */
  about?: string;
  /** Genre registry slugs. */
  genres?: string[];
  /** History article slugs the song appears in. */
  history?: string[];
  /** Concept registry slugs this recording helps explain. */
  concepts?: string[];
  /** "live" pages are indexed + in the sitemap; "soon" are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases for the spoke page metadata. */
  keywords?: string[];
}

export const SONGS_CATALOG: CatalogSong[] = [
  {
    slug: "yellow-dog-blues",
    title: "Yellow Dog Blues",
    artists: ["w-c-handy", "bessie-smith"],
    artistLabel: "Bessie Smith, 1925",
    year: "1925",
    youtubeId: "mcrx2-vvwC4",
    micro:
      "W. C. Handy’s composition about a Delta railroad junction (the “Yellow Dog”); Bessie Smith’s 1925 recording is a classic-blues landmark.",
    about:
      "Handy published it in 1915 as “Yellow Dog Rag,” then retitled it “Yellow Dog Blues” in 1919 when the word itself was selling. The title is a railroad nickname: the Yellow Dog was the Yazoo Delta line, and “where the Southern cross’ the Dog” is the junction at Moorhead, Mississippi — the same line Handy remembered hearing a guitarist sing at Tutwiler around 1903. The lyric is an answer-song: it tells what became of the “easy rider” from Shelton Brooks’s 1913 hit. Bessie Smith’s 1925 Columbia recording is the classic-blues landmark; the song is older than the blues industry that later claimed it.",
    genres: ["blues"],
    history: ["blues"],
    status: "live",
  },
  {
    slug: "st-louis-blues",
    title: "St. Louis Blues",
    artists: ["w-c-handy", "bessie-smith", "louis-armstrong"],
    artistLabel: "Bessie Smith & Louis Armstrong, 1925",
    year: "1914",
    youtubeId: "3rd9IaA_uJI",
    pianoRollId: "st-louis-blues",
    micro:
      "Handy’s 1914 song, among the most-recorded of its era; the 1925 Bessie Smith / Louis Armstrong version pairs a blues voice with a jazz cornet in call-and-response.",
    about:
      "Handy published it in September 1914. The verses are a 12-bar blues; the middle strain is a 16-bar habanera — what Handy called a tango — so the song is a ragtime-shaped piece with a blues heart, not a simple loop. It became one of the most-recorded songs of its era (musicians nicknamed it “the jazzman’s Hamlet”). The version this page plays is Bessie Smith’s January 1925 Columbia side, with Louis Armstrong answering her on cornet: a blues voice and a jazz horn in call-and-response.",
    genres: ["blues"],
    history: ["blues"],
    concepts: ["twelve-bar-blues", "call-and-response"],
    status: "live",
  },
  {
    slug: "crazy-blues",
    title: "Crazy Blues",
    artists: ["mamie-smith"],
    artistLabel: "Mamie Smith, 1920",
    year: "1920",
    youtubeId: "qaz4Ziw_CfQ",
    micro:
      "Mamie Smith’s 1920 recording — the first blues hit by a Black artist. Its sales to Black buyers showed labels a market they had ignored, and they answered with a segregated catalog they called “race records.”",
    about:
      "Perry Bradford wrote the song; Smith recorded it for OKeh in August 1920. Major labels had treated Black artists as novelties and marketed almost exclusively to white buyers. Crazy Blues sold in huge numbers, many of them to Black customers, and OKeh — then Columbia, Paramount, and others — opened separate numbered series aimed at African American listeners. “Race records” was the industry’s name for that shelf, used from the early 1920s into the 1940s. In the Black press of the time, “the race” often meant “our people”; on a record label it still marked a Jim Crow product line. That segregated market is also the commercial door the country and city blues of the next decades walked through. Billboard retired the chart name in 1949 in favor of “rhythm and blues.”",
    genres: ["blues"],
    history: ["blues"],
    concepts: ["race-records"],
    status: "live",
    keywords: ["Crazy Blues", "Mamie Smith", "race records", "OKeh 1920"],
  },
  {
    slug: "heyser-bulgar",
    title: "Heyser Bulgar",
    artists: ["naftule-brandwein"],
    artistLabel: "Naftule Brandwein, 1923",
    year: "1923",
    youtubeId: "f8N-vT6hX9c",
    pianoRollId: "heyser-bulgar",
    micro:
      "“The hot bulgar” — Brandwein's May 1923 recording made this one of the best-known American klezmer tunes, and his ornament-drenched version is still the reference point.",
    about:
      "Heyser means “hot.” Brandwein cut it for Victor in New York on May 10, 1923 — issued as “Heiser Bulgar,” with the label’s own gloss “spirited bulgar.” A bulgar is a Bessarabian wedding dance that American klezmer made its own; Brandwein’s take is fast, heavily ornamented, and still the version later clarinetists learn from. It sits on the same 78 as his “Turkishe Yalle Vey Uve,” another of the sides that defined the hot American klezmer clarinet style.",
    genres: ["klezmer"],
    history: ["klezmer"],
    status: "live",
  },
  {
    slug: "der-shtiler-bulgar",
    title: "Der shtiler bulgar",
    artists: ["abe-schwartz"],
    artistLabel: "Benny Goodman Orchestra (as “And the Angels Sing”), 1939",
    year: "1918",
    youtubeId: "0hKwEf-rSZs",
    pianoRollId: "der-shtiller-bulgar",
    micro:
      "“The quiet bulgar,” first recorded by Abe Schwartz's orchestra in 1918. Twenty years on, trumpeter Ziggy Elman's adaptation became Benny Goodman's #1 hit “And the Angels Sing” — a klezmer dance tune at the top of the American charts.",
    about:
      "Schwartz’s orchestra recorded “Der shtiler bulgar” (“the quiet bulgar”) in 1918, early in the Columbia Jewish-music sessions he ran. Twenty years later, trumpeter Ziggy Elman — a klezmer player inside Benny Goodman’s band — swung the tune; with Johnny Mercer’s English lyrics it became Goodman’s 1939 #1 hit “And the Angels Sing.” For a moment a Bessarabian wedding dance sat on top of the American pop charts. The piano-roll arrangement on this site is the klezmer original, not the swing rewrite.",
    genres: ["klezmer"],
    history: ["klezmer"],
    status: "live",
  },
  {
    slug: "bei-mir-bistu-shein",
    title: "Bei Mir Bistu Shein",
    artists: ["sholom-secunda"],
    artistLabel: "The Andrews Sisters, 1937",
    year: "1932",
    youtubeId: "EGveTSQbH30",
    pianoRollId: "bei-mir-bistu-shein",
    micro:
      "Written by Sholom Secunda for a 1932 Yiddish musical that closed in a season; five years later the Andrews Sisters' English version became a worldwide hit — the Yiddish stage's greatest crossover.",
    about:
      "Secunda and lyricist Jacob Jacobs wrote it for the 1932 Yiddish musical I Would If I Could (M’ken lebn nor m’lozt nit), which closed after one season in Brooklyn. In 1937 they sold the publishing rights for $30. That same year Sammy Cahn and Lou Levy heard two Black performers sing it in Yiddish at the Apollo; Cahn wrote English lyrics, and the Andrews Sisters cut it for Decca as a B-side. It became their first huge hit — and the Yiddish stage’s greatest crossover — while Secunda watched from Second Avenue.",
    genres: ["klezmer"],
    history: ["klezmer"],
    status: "live",
  },
  {
    slug: "strange-fruit",
    title: "Strange Fruit",
    artists: ["billie-holiday"],
    artistLabel: "Billie Holiday, 1939",
    year: "1939",
    youtubeId: "YbcZstt8ACY",
    micro:
      "Billie Holiday’s 1939 protest song about lynching (written by Abel Meeropol) — the blues tradition’s language of witness made explicit.",
    about:
      "Abel Meeropol, a Bronx schoolteacher writing as Lewis Allan, first published the lyric as a poem in 1937, then set it to music. Holiday began singing it in 1939 at Café Society, New York’s first integrated nightclub; she closed the set with it, lights down, no encore. Columbia would not record it — southern retailers and the CBS radio network were the stated fear — so she cut it on April 20, 1939, for Milt Gabler’s small Commodore label, with the Café Society band. It became the best-selling record of her career, and the blues tradition’s language of witness made explicit.",
    genres: ["blues"],
    history: ["blues"],
    status: "live",
  },
];

export function getCatalogSong(slug: string): CatalogSong | undefined {
  return SONGS_CATALOG.find((s) => s.slug === slug);
}

/** All catalog songs crediting a given artist, A–Z by title. */
export function songsByArtist(artistSlug: string): CatalogSong[] {
  return sortByLabel(
    SONGS_CATALOG.filter((s) => s.artists.includes(artistSlug)),
    (s) => s.title,
  );
}

/**
 * Display attribution for a song: the explicit `artistLabel` when set, else
 * the credited artists' names joined, with the year appended.
 */
export function songAttribution(song: CatalogSong): string {
  if (song.artistLabel) return song.artistLabel;
  const names = song.artists
    .map((slug) => getArtist(slug)?.name)
    .filter((n): n is string => Boolean(n));
  const joined =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`
      : names[0] ?? "";
  return song.year ? [joined, song.year].filter(Boolean).join(", ") : joined;
}

/** Songs safe to index (real content), for the sitemap + static params. */
export const LIVE_SONGS = SONGS_CATALOG.filter((s) => s.status === "live");
