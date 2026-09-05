/**
 * Musical History registry — the single list of long-form history articles.
 *
 * The Musical History module is the third teaching sibling of Genres and
 * Scales: where those pages dissect *how* a sound works, these tell the story
 * of *where it came from* — sourced, quoted, and linked back to originals.
 * This registry is the source of truth for the `/history` hub, the
 * `/history/[slug]` pages, and the sitemap. Full article prose lives in
 * `src/content/history/<slug>.tsx` (TSX, not MDX — see
 * docs/plans/musical-history-module.md).
 *
 * Cross-links are data, not hardcoded prose: an article lists the genre and
 * scale slugs it covers (`genres`, `scales`). Genre and scale pages look the
 * article up the other way (`getArticleByGenre`, `getArticlesByScale`) so
 * every spoke can link back. Keep those arrays honest — a missing slug
 * means a missing link.
 */

/** A cited source — quoted briefly and linked, never reproduced wholesale. */
export interface Source {
  /** Stable anchor id, referenced by inline footnote links ("lomax-1993"). */
  id: string;
  title: string;
  author?: string;
  /** Journal, book, archive, or site the source appears in. */
  publication?: string;
  year?: string;
  /** Link to the original. Prefer stable, public archives. */
  url?: string;
  /** e.g. "Retrieved 2026-09-05" for web sources. */
  access?: string;
  /** True when the work is public domain or openly licensed (safe to quote at length). */
  publicDomain?: boolean;
}

export interface HistoryArticle {
  /** URL slug under /history. Kebab-case, no article ("blues"). */
  slug: string;
  /** Display name for cards and headers ("The blues"). */
  name: string;
  /** Search-shaped question used as the page <h1> and title. */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /**
   * The quotable 1–2 sentence answer, rendered as the page lead, mirrored into
   * the meta description, and lifted into FAQ JSON-LD. True on its own.
   */
  answer: string;
  /** Genre registry slugs this article covers (reverse cross-link targets). */
  genres: string[];
  /** Scale registry slugs this article touches. */
  scales: string[];
  /** Bibliography for the article body's inline citations + "Sources" list. */
  sources: Source[];
  /** "live" pages are indexed + in the sitemap; "soon" pages are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases woven into metadata. */
  keywords: string[];
}

export const HISTORY_ARTICLES: HistoryArticle[] = [
  {
    slug: "blues",
    name: "The blues",
    question: "Where did the blues come from?",
    summary:
      "From West African roots through work songs, field hollers, and spirituals to the root system of jazz, R&B, and rock — the story of the blues, sourced and linked.",
    answer:
      "The blues took shape in African-American communities of the southern United States around the turn of the 20th century, growing out of work songs, field hollers, and spirituals — music with older West African roots — before it was first published and recorded in the 1910s and 1920s.",
    genres: ["blues"],
    scales: ["blues-scale", "minor-pentatonic"],
    // Bibliography — public-domain / open-archive first. Order here sets the
    // footnote numbering rendered by the citation components.
    sources: [
      {
        id: "folkways-before",
        title: "Before the Blues: From Africa to the United States",
        publication: "Smithsonian Folkways Recordings",
        url: "https://folkways.si.edu/lesson/before-the-blues/from-africa-to-the-united-states",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "kubik-afropop",
        author: "Gerhard Kubik",
        title: "Africa and The Blues: An Interview with Gerhard Kubik",
        publication: "Afropop Worldwide",
        year: "2007",
        url: "https://www.afropop.org/articles/africa-and-the-blues-an-interview-with-gerhard-kubik",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "kubik-1999",
        author: "Gerhard Kubik",
        title: "Africa and the Blues",
        publication: "University Press of Mississippi",
        year: "1999",
        access: "Quoted briefly under fair use",
      },
      {
        id: "loc-blues",
        title: "Blues",
        publication: "The Library of Congress Celebrates the Songs of America",
        url: "https://www.loc.gov/collections/songs-of-america/articles-and-essays/musical-styles/popular-songs-of-the-day/blues/",
        access: "Retrieved 2026-09-05",
        publicDomain: true,
      },
      {
        id: "loc-folklife",
        title:
          "Blues: Resources in the American Folklife Center — Introduction",
        publication: "Library of Congress Research Guides",
        url: "https://guides.loc.gov/folklife-blues/introduction",
        access: "Retrieved 2026-09-05",
        publicDomain: true,
      },
      {
        id: "southern-cultures-handy",
        title: "W. C. Handy and the \u201cBirth\u201d of the Blues",
        publication: "Southern Cultures",
        year: "2018",
        url: "https://www.southerncultures.org/article/w-c-handy-and-the-birth-of-the-blues/",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "handy-1941",
        author: "W. C. Handy",
        title: "Father of the Blues: An Autobiography",
        publication: "Macmillan, New York",
        year: "1941",
        access: "Quoted briefly under fair use",
      },
      {
        id: "msbluestrail-handy",
        title: "W. C. Handy (Tutwiler marker)",
        publication: "Mississippi Blues Trail",
        url: "https://web.archive.org/web/20210221010924/http://msbluestrail.org/blues-trail-markers/w-c-handy",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "hearing-americas",
        title: "Who was the first Black blues singer on record?",
        publication: "Hearing the Americas",
        url: "https://hearingtheamericas.org/s/the-americas/page/q-blues-first",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "ms-encyclopedia-muddy",
        title: "Muddy Waters (McKinley Morganfield)",
        publication: "Mississippi Encyclopedia",
        url: "https://mississippiencyclopedia.org/entries/muddy-waters/",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "loc-protest",
        title: "Blues as Protest",
        publication: "The Library of Congress Celebrates the Songs of America",
        url: "https://www.loc.gov/collections/songs-of-america/articles-and-essays/historical-topics/blues-as-protest/",
        access: "Retrieved 2026-09-05",
        publicDomain: true,
      },
    ],
    status: "live",
    keywords: [
      "history of the blues",
      "where did the blues come from",
      "origins of blues music",
      "delta blues history",
      "great migration blues",
      "west african roots of the blues",
      "predecessors of the blues",
    ],
  },
  {
    slug: "klezmer",
    name: "Klezmer",
    question: "Where did klezmer come from?",
    summary:
      "From the wedding bands of Ashkenazi Eastern Europe through the 78rpm era of immigrant New York to the 1970s revival — the story of klezmer, sourced and linked.",
    answer:
      "Klezmer is the celebration music of the Ashkenazi Jews of Eastern Europe, played above all for weddings by professional musicians called klezmorim. Carried to America in the great migration of 1881–1924 and captured on 78rpm records in New York, it was nearly silenced by assimilation and the Holocaust — then revived from the 1970s, when 'klezmer' first became the name of a genre.",
    genres: ["klezmer"],
    scales: ["freygish"],
    // Bibliography — public-domain / open-archive first. Order here sets the
    // footnote numbering rendered by the citation components.
    sources: [
      {
        id: "yivo-traditional",
        title: "Music: Traditional and Instrumental Music",
        publication: "YIVO Encyclopedia of Jews in Eastern Europe",
        url: "https://encyclopedia.yivo.org/article/2193",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "britannica-klezmer",
        title: "Klezmer music",
        publication: "Encyclopædia Britannica",
        url: "https://www.britannica.com/art/klezmer-music",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "feldman-shofar",
        author: "Walter Zev Feldman",
        title:
          "Musical Fusion and Allusion in the Core and the Transitional Klezmer Repertoires",
        publication: "Shofar: An Interdisciplinary Journal of Jewish Studies",
        year: "2022",
        url: "https://doi.org/10.1353/sho.2022.0026",
        access: "Quoted briefly under fair use",
      },
      {
        id: "stroum-jewish",
        title: "What makes music sound “Jewish”?",
        publication: "UW Stroum Center for Jewish Studies",
        url: "https://jewishstudies.washington.edu/arts-culture/what-makes-music-sound-jewish/",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "rubin-nyklezmer",
        author: "Joel E. Rubin",
        title:
          "New York Klezmer in the Early Twentieth Century: The Music of Naftule Brandwein and Dave Tarras",
        publication: "University of Rochester Press",
        year: "2020",
        url: "https://muse.jhu.edu/book/77384",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "wikipedia-brandwein",
        title: "Naftule Brandwein",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Naftule_Brandwein",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "nea-tarras",
        title: "Dave Tarras — 1984 NEA National Heritage Fellow",
        publication: "National Endowment for the Arts",
        url: "https://www.arts.gov/honors/heritage/dave-tarras",
        access: "Retrieved 2026-09-05",
        publicDomain: true,
      },
      {
        id: "milken-beimir",
        title: "Bay mir bistu sheyn",
        publication:
          "Milken Archive of Jewish Music — Great Songs of the American Yiddish Stage",
        url: "https://www.milkenarchive.org/music/volumes/view/great-songs-of-the-american-yiddish-stage/work/bay-mir-bistu-sheyn/",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "sapoznik-swing",
        author: "Henry Sapoznik",
        title: "Yiddish Swing",
        publication: "henrysapoznik.com",
        url: "https://www.henrysapoznik.com/swing",
        access: "Quoted briefly under fair use",
      },
      {
        id: "nmusa-shtetl",
        title: "Rockin' the Shtetl",
        publication: "NewMusicBox (New Music USA)",
        url: "https://newmusicusa.org/nmbx/rockin-the-shtetl/",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "jta-feldman",
        title:
          "He kicked off the 1970s klezmer revival. Now, he's paying tribute to New York's vast global music scene.",
        publication: "New York Jewish Week / JTA",
        year: "2025",
        url: "https://www.jta.org/2025/07/16/ny/he-kicked-off-the-1970s-klezmer-revival-now-hes-paying-tribute-to-new-yorks-vast-global-music-scene",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "klezmorim-krono",
        author: "Lev Liberman",
        title: "The Klezmorim — 1975, the inside story",
        publication: "klezmo.com",
        url: "https://klezmo.com/krono_1975_inside.html",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "ybc-sapoznik",
        title: "Henry Sapoznik — oral history interview",
        publication: "Yiddish Book Center, Wexler Oral History Project",
        year: "2012",
        url: "https://www.yiddishbookcenter.org/collections/oral-histories/interviews/woh-fi-0000275/henry-sapoznik-2012",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "rojanski-yiddish",
        author: "Rachel Rojanski",
        title: "Yiddish in Israel: A History",
        publication: "Indiana University Press",
        year: "2020",
        url: "https://iupress.org/9780253045140/yiddish-in-israel/",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "wikipedia-feidman",
        title: "Giora Feidman",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Giora_Feidman",
        access: "Retrieved 2026-09-05",
      },
      {
        id: "wikipedia-safed-festival",
        title: "International Klezmer Festival in Safed",
        publication: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/International_Klezmer_Festival_in_Safed",
        access: "Retrieved 2026-09-05",
      },
    ],
    status: "live",
    keywords: [
      "history of klezmer",
      "where did klezmer come from",
      "klezmorim eastern europe",
      "klezmer clarinet brandwein tarras",
      "yiddish swing bei mir bistu shein",
      "klezmer revival 1970s",
      "klezmer in israel safed festival giora feidman",
      "freygish ahava rabbah",
    ],
  },
];

export function getArticle(slug: string): HistoryArticle | undefined {
  return HISTORY_ARTICLES.find((a) => a.slug === slug);
}

/** The history article covering a given genre slug, if one exists. */
export function getArticleByGenre(
  genreSlug: string,
): HistoryArticle | undefined {
  return HISTORY_ARTICLES.find((a) => a.genres.includes(genreSlug));
}

/** History articles that name this scale — a scale can show up in more than one story. */
export function getArticlesByScale(scaleSlug: string): HistoryArticle[] {
  return HISTORY_ARTICLES.filter((a) => a.scales.includes(scaleSlug));
}

/** Articles safe to index (real content), for the sitemap. */
export const LIVE_HISTORY = HISTORY_ARTICLES.filter((a) => a.status === "live");
