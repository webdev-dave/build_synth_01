/**
 * Cousins registry — melodies that took on many lives.
 *
 * A cousin article is about one *tune* (a riff, hook, nigun, dance melody),
 * not one hit record. Instances are existing `CatalogSong`s; this registry
 * only stores the *relationship*. Cross-links are data: a song lists
 * `cousins: ["miserlou"]`, and `getCousinsBySong()` finds the reverse card.
 *
 * Body prose lives in `src/content/cousins/` so this module (sitemap,
 * metadata, search) never pulls in article component trees.
 */
import { getGenre } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import { getLanguage } from "@/lib/languages/registry";
import { getCatalogSong } from "@/lib/catalog/songs";
import { nativeSpellingsOf } from "@/lib/words/registry";
import type { Source } from "@/lib/history/registry";
import {
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";

export type { Source };

/** How this catalog song is related to the shared melody. */
export type CousinKind =
  | "folk-source"
  | "original"
  | "translation"
  | "rearrangement"
  | "contrafact"
  | "quotation"
  | "revival";

export const COUSIN_KIND_LABEL: Record<CousinKind, string> = {
  "folk-source": "Folk source",
  original: "Original",
  translation: "Translation",
  rearrangement: "Rearrangement",
  contrafact: "Contrafact",
  quotation: "Quotation",
  revival: "Revival",
};

export interface CousinMember {
  /** Catalog song slug. */
  song: string;
  kind: CousinKind;
  /** This instance, if it differs from the song year. */
  year?: string;
  /** Place-registry id. */
  place?: string;
  /** Language of *this* instance ("Greek", "Yiddish", "instrumental"). */
  language?: string;
  /** One line, not a bio. */
  note?: string;
}

export interface CousinArticle {
  /** URL slug under /cousins. */
  slug: string;
  /** Familiar tune name ("Misirlou"). */
  name: string;
  /**
   * Page `<h1>`, `<title>`, FAQ, search, and RelatedPages labels.
   * Always `History & versions of {name}` — derived in `publishCousin`,
   * never authored per article.
   */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /**
   * The quotable 1–2 sentence answer — page lead, meta description, FAQ
   * JSON-LD. True on its own.
   */
  answer: string;
  members: CousinMember[];
  /** Genre registry slugs — required; rendered as pills on the hub and spoke. */
  genres: string[];
  scales?: string[];
  places?: string[];
  languages?: string[];
  history?: string[];
  sources: Source[];
  status: "live" | "soon";
  keywords?: string[];
}

/**
 * Copy standard — one melody, many lives.
 *
 * Do not invent a “Where else does this tune live?” question or a
 * “This tune also lives as…” heading. Import these helpers; don’t
 * restyle the strings in a page.
 */
export const COUSIN_SONG_HEADING = "One melody, many lives";
export const COUSIN_SONG_LINK = "History & versions";

export function cousinQuestion(name: string): string {
  return `History & versions of ${name}`;
}

export function cousinSongLinkLabel(
  cousin: Pick<CousinArticle, "name">,
  cousinCount: number,
): string {
  return cousinCount > 1
    ? `${cousin.name} — history & versions`
    : COUSIN_SONG_LINK;
}

type CousinDraft = Omit<CousinArticle, "question">;

function publishCousin(draft: CousinDraft): CousinArticle {
  return { ...draft, question: cousinQuestion(draft.name) };
}

const COUSIN_DRAFTS: CousinDraft[] = [
  {
    slug: "miserlou",
    name: "Misirlou",
    summary:
      "An eastern Mediterranean folk tune that became a Greek 78, a Yiddish pop side, and a surf-guitar hit — same contour, new rooms.",
    answer:
      "Misirlou is an eastern Mediterranean folk melody — the name is Turkish Mısırlı, “Egyptian” — that Arabic, Greek, and Jewish musicians already knew by the 1920s. The earliest known recording is Greek, in New York in 1927; it later took Yiddish words, and Dick Dale’s 1962 surf arrangement is the life most English listeners think is the song.",
    members: [
      {
        song: "misirlou-demetriades",
        kind: "folk-source",
        year: "1927",
        place: "new-york",
        language: "Greek",
        note: "Earliest known recording — Columbia, New York.",
      },
      {
        song: "misirlou-patrinos",
        kind: "rearrangement",
        year: "1930",
        place: "athens",
        language: "Greek",
        note: "Slower rebetiko / tsifteteli, circulated as Mousourlou.",
      },
      {
        song: "misirlou-rexite",
        kind: "translation",
        year: "1948",
        place: "new-york",
        language: "Yiddish",
        note: "Miriam Kressyn’s Yiddish words; Banner, with Abe Ellstein.",
      },
      {
        song: "misirlou-dale",
        kind: "rearrangement",
        year: "1962",
        place: "california",
        language: "instrumental",
        note: "Surf guitar — the life Pulp Fiction later quoted.",
      },
    ],
    genres: ["klezmer", "yiddish-theater", "rock"],
    scales: ["freygish"],
    places: ["istanbul", "athens", "new-york", "california"],
    languages: ["yiddish"],
    history: ["klezmer"],
    sources: [
      {
        id: "wikipedia-misirlou",
        title: "Misirlou",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Misirlou",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "dahr-demetriades",
        title:
          "Columbia matrix W205625. Misirlou (Μισιρλου) / Tetos Demetriades",
        publication: "Discography of American Historical Recordings",
        url: "https://adp.library.ucsb.edu/index.php/matrix/detail/2000375011/W205625-Misirlou_",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "recording-pioneers-demetriades",
        title: "Theodotos Demetriades (“Tetos”)",
        publication: "Recording Pioneers",
        url: "https://www.recordingpioneers.com/RP_DEMETRIADES1.html",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "sfdh-misirlou",
        title: "Misirlou",
        publication: "The Society of Folk Dance Historians",
        url: "https://sfdh.us/encyclopedia/misirlou.html",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "shira-misirlou",
        author: "Panayiota Bakis Mohieddin",
        title: "Misirlou: The Story Behind the Song",
        publication: "Shira.net",
        url: "http://www.shira.net/music/misirlou-story.htm",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "uw-rexite",
        title: "מוזערלאו / Miserlou — Seymour Rechtzeit",
        publication: "University of Wisconsin–Madison Digital Collections",
        year: "ca. 1948",
        url: "https://digital.library.wisc.edu/1711.dl/4L7FXNFQHRDTJ8U",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "teruah-misirlou",
        title:
          "Misirlou — A Turkish, Greek, Israeli, Easy Listening, Klezmer, Surf Rock, Punk Classic",
        publication: "Teruah — Jewish Music",
        year: "2009",
        url: "http://teruah-jewishmusic.blogspot.com/2009/05/misirlou-turkish-greek-israeli-easy.html",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "forward-rogovoy",
        author: "Seth Rogovoy",
        title: "Metamorphoses: The Sources and Journeys of a Tune",
        publication: "The Forward",
        url: "https://forward.com/culture/133769/metamorphoses-the-sources-and-journeys-of-a-tune/",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "npr-misirlou",
        title: "Misirlou, from Klezmer to Surf Guitar",
        publication: "NPR Weekend Edition Sunday",
        year: "2006",
        url: "https://www.npr.org/2006/01/08/5134530/misirlou-from-klezmer-to-surf-guitar",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "npr-dale",
        author: "Otis Hart and Anastasia Tsioulcas",
        title: "Dick Dale, Surf Guitar Legend, Dead At 81",
        publication: "NPR",
        year: "2019",
        url: "https://www.npr.org/2019/03/18/704329806/dick-dale-surf-guitar-legend-dead-at-81",
        access: "Retrieved 2026-09-06",
      },
    ],
    status: "live",
    keywords: [
      "Misirlou",
      "Miserlou",
      "Dick Dale Misirlou",
      "Tetos Demetriades",
      "Seymour Rexite Yiddish Misirlou",
      "Miriam Kressyn",
      "Pulp Fiction Misirlou",
      "Egyptian girl folk song",
    ],
  },
  {
    slug: "dona-dona",
    name: "Dona Dona",
    summary:
      "A 1940 Yiddish theater parable that put on English folk-revival clothes — same calf, new rooms — and is still sung in both languages.",
    answer:
      "Dona Dona began as Aaron Zeitlin and Sholom Secunda’s 1940–41 Yiddish theater song for Esterke: a bound calf, a free swallow, and a refrain that is a Polish vocable, not a woman’s name. Arthur Kevess and Teddi Schwartz’s English made it a folk-revival standard; Joan Baez’s 1960 “Donna, Donna” is the version most of the world heard, and singers still keep both languages in the air.",
    members: [
      {
        song: "dona-dona",
        kind: "original",
        year: "1940",
        place: "new-york",
        language: "Yiddish",
        note: "Zeitlin & Secunda’s Yiddish theater original; The Shvesters sing it live.",
      },
      {
        song: "donna-donna",
        kind: "translation",
        year: "1960",
        place: "new-york",
        language: "English",
        note: "Kevess & Schwartz’s English; Joan Baez’s 1960 folk-revival standard.",
      },
    ],
    genres: ["yiddish-theater", "yiddish-folk", "folk-revival"],
    // Poland: Zeitlin wrote Esterke in the Polish-speaking world (the legend of
    // Esterke & Casimir; the Polish refrain). New York: staged 1940–41, the
    // Kevess/Schwartz English, Baez. Israel: Hendel's 1962 Hebrew on Kol
    // Israel, and The Shvesters' Yiddish. All three are cited in the body.
    places: ["poland", "new-york", "israel"],
    languages: ["yiddish"],
    history: ["klezmer"],
    sources: [
      {
        id: "mlotek-dona",
        title: "Dona Dona",
        publication:
          "The Yosl and Chana Mlotek Yiddish Song Collection at the Workers Circle",
        url: "https://yiddishsongs.org/dona-dona/",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-dona-dona",
        title: "Dona, Dona",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Dona,_Dona",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-zeitlin",
        title: "Aaron Zeitlin",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Aaron_Zeitlin",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "trochimczyk-oberek",
        title: "Oberek (Obertas)",
        author: "Maja Trochimczyk",
        publication:
          "Polish Music Center, University of Southern California",
        url: "https://polishmusic.usc.edu/research/dances/oberek/",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-bikel",
        title: "Theodore Bikel",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Theodore_Bikel",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-baez",
        title: "Joan Baez",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Joan_Baez",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-donovan",
        title: "Donovan",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Donovan",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "shvesters-about",
        title: "About",
        publication: "The Shvesters",
        url: "https://theshvesters.com/about",
        access: "Retrieved 2026-09-06",
      },
    ],
    status: "live",
    keywords: [
      "Dona Dona",
      "Donna Donna",
      "Dos kelbl",
      "Aaron Zeitlin",
      "Sholom Secunda",
      "Joan Baez Donna Donna",
      "Yiddish folk song translation",
    ],
  },
  {
    slug: "over-the-rainbow",
    name: "Over the Rainbow",
    summary:
      "A 1939 MGM ballad — Judy Garland as Dorothy — that later put on Yiddish words. Same rainbow, new room.",
    answer:
      "Over the Rainbow is Harold Arlen and Yip Harburg’s ballad for The Wizard of Oz, sung by Judy Garland in 1939. Harburg grew up in Yiddish on the Lower East Side; the lyric he wrote is English. Al Grand later made a singable Yiddish (2003); this site plays Grand’s own recording and Wolf Krakowski’s 2016 version next to Garland.",
    members: [
      {
        song: "over-the-rainbow",
        kind: "original",
        year: "1939",
        place: "california",
        language: "English",
        note: "The Wizard of Oz — Judy Garland as Dorothy.",
      },
      {
        song: "iber-dem-regnboygn",
        kind: "translation",
        year: "2003",
        language: "Yiddish",
        note: "Al Grand’s Yiddish — his own YouTube upload and Wolf Krakowski’s 2016 recording.",
      },
    ],
    genres: ["yiddish-folk"],
    places: ["new-york", "california"],
    languages: ["yiddish"],
    sources: [
      {
        id: "wikipedia-over-the-rainbow",
        title: "Over the Rainbow",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Over_the_Rainbow",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "loc-nrr-rainbow",
        title: "“Over the Rainbow.” Judy Garland. (1939)",
        publication:
          "Library of Congress, National Recording Registry — 2016 inductees",
        url: "https://www.loc.gov/programs/national-recording-preservation-board/recording-registry/registry-by-induction-years/2016/",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "loc-rimler",
        author: "Walter Rimler",
        title: "“Over the Rainbow”—Judy Garland (1939)",
        publication: "National Recording Preservation Board essay",
        url: "https://www.loc.gov/static/programs/national-recording-preservation-board/documents/OverTheRainbow.pdf",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-harburg",
        title: "Yip Harburg",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Yip_Harburg",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-arlen",
        title: "Harold Arlen",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Harold_Arlen",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "songhall-arlen",
        title: "Harold Arlen",
        publication: "Songwriters Hall of Fame",
        url: "https://www.songhall.org/profiles/harold-arlen",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "forward-grand-2003",
        title: "Der Yiddish-Vinkl, June 13, 2003",
        publication: "The Forward",
        url: "https://forward.com/news/7485/der-yiddish-vinkl-june-13-2003/",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "nyt-grand-2006",
        author: "Liesl Schillinger",
        title: "Dress British, Sing Yiddish",
        publication: "The New York Times",
        year: "2006",
        url: "https://www.nytimes.com/2006/10/22/theater/22schi.html",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "wikipedia-krakowski",
        title: "Wolf Krakowski",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Wolf_Krakowski",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "kamea-krakowski",
        title: "Kame’a Media",
        publication: "kamea.com",
        url: "https://www.kamea.com/home.html",
        access: "Retrieved 2026-09-06",
      },
      {
        id: "yt-grand-rainbow",
        author: "Al Grand",
        title: "Over the Rainbow — Yiddish Version",
        publication: "YouTube (Al Grand, @algrand2)",
        year: "2009",
        url: "https://www.youtube.com/watch?v=9nCXeq9LRws",
        access: "Retrieved 2026-09-06",
      },
    ],
    status: "live",
    keywords: [
      "Over the Rainbow",
      "Somewhere Over the Rainbow",
      "Iber dem regnboygn",
      "Yiddish Over the Rainbow",
      "Judy Garland",
      "Yip Harburg",
      "Al Grand",
      "Wolf Krakowski",
    ],
  },
];

export const COUSIN_ARTICLES: CousinArticle[] = COUSIN_DRAFTS.map(publishCousin);

export function getCousin(slug: string): CousinArticle | undefined {
  return COUSIN_ARTICLES.find((a) => a.slug === slug);
}

/**
 * Cousin articles this catalog song belongs to.
 * Union of both directions so a missing `cousins: []` or a missing member
 * still lights the song-page card — then fix the data so they match.
 */
export function getCousinsBySong(songSlug: string): CousinArticle[] {
  const song = getCatalogSong(songSlug);
  const seen = new Set<string>();
  const out: CousinArticle[] = [];
  for (const article of COUSIN_ARTICLES) {
    const viaMember = article.members.some((m) => m.song === songSlug);
    const viaField = song?.cousins?.includes(article.slug) ?? false;
    if (!viaMember && !viaField) continue;
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);
    out.push(article);
  }
  return out;
}

export function getCousinsByHistory(historySlug: string): CousinArticle[] {
  return COUSIN_ARTICLES.filter((a) => a.history?.includes(historySlug));
}

export function getCousinsByGenre(genreSlug: string): CousinArticle[] {
  return COUSIN_ARTICLES.filter((a) => a.genres.includes(genreSlug));
}

export function getCousinsByScale(scaleSlug: string): CousinArticle[] {
  return COUSIN_ARTICLES.filter((a) => a.scales?.includes(scaleSlug));
}

export function getCousinsByLanguage(languageSlug: string): CousinArticle[] {
  return COUSIN_ARTICLES.filter((a) => a.languages?.includes(languageSlug));
}

/** Member catalog slugs in appearance order, de-duped. */
export function cousinSongIds(article: CousinArticle): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const member of article.members) {
    if (seen.has(member.song)) continue;
    if (!getCatalogSong(member.song)) continue;
    seen.add(member.song);
    out.push(member.song);
  }
  return out;
}

export const LIVE_COUSINS = COUSIN_ARTICLES.filter((a) => a.status === "live");

export interface CousinFilters {
  genre?: string;
  language?: string;
  status?: "live" | "soon";
}

function articleHaystack(article: CousinArticle): string {
  const memberBits = article.members.flatMap((m) => {
    const song = getCatalogSong(m.song);
    return [
      m.song,
      m.kind,
      m.year,
      m.place,
      m.language,
      m.note,
      song?.title,
      song?.artistLabel,
    ];
  });
  return joinHaystack([
    article.name,
    article.slug,
    article.question,
    article.summary,
    article.answer,
    ...(article.keywords ?? []),
    ...memberBits,
    ...relatedNames(article.genres, getGenre),
    ...relatedNames(article.scales ?? [], getScale),
    ...relatedNames(article.languages ?? [], getLanguage),
    ...nativeSpellingsOf(article.slug),
  ]);
}

const ARTICLE_HAY = new Map(
  COUSIN_ARTICLES.map((a) => [a.slug, articleHaystack(a)]),
);

export function searchCousins(
  query: string,
  filters: CousinFilters = {},
): CousinArticle[] {
  let items: readonly CousinArticle[] = COUSIN_ARTICLES;
  if (filters.genre) {
    items = items.filter((article) => article.genres.includes(filters.genre!));
  }
  if (filters.language) {
    items = items.filter((article) =>
      article.languages?.includes(filters.language!),
    );
  }
  if (filters.status) {
    items = items.filter((article) => article.status === filters.status);
  }
  return sortByLabel(
    filterByHaystack(
      items,
      query,
      (article) => ARTICLE_HAY.get(article.slug) ?? "",
    ),
    (article) => article.name,
  );
}
