/**
 * Places registry — the geography behind the Music History Map (`/map`).
 *
 * Same pattern as the genre/history/scale registries: a typed data module is
 * the single source of truth for what the map can select, search, and say.
 * The map renders world countries + US states from TopoJSON in `public/geo/`;
 * this registry binds those shapes (by world-atlas country id / US FIPS id),
 * plus city points and hand-drawn historical overlays, to our music content.
 *
 * Honesty rules (see docs/plans/music-history-map-and-contributions.md):
 * - A place is only `rich` when the blurb is backed by a sourced article or
 *   uncontroversial fact — the map must not out-claim the articles.
 * - Anything NOT in this registry renders the "not mapped yet" panel with a
 *   contribute invitation. Vast empty swaths are a feature, not a bug.
 * - Historical names are first-class: aliases carry era context and are
 *   searchable (Kishinev finds Chișinău; the Pale of Settlement is a shape).
 */

import { getGenre } from "@/lib/genres/registry";

export type PlaceKind =
  | "country"
  | "state"
  | "region"
  | "city"
  | "historical-region";

export interface PlaceAlias {
  name: string;
  /** Era/context note shown next to the alias ("Russian-era name"). */
  era?: string;
}

export interface PlaceGeo {
  /** world-atlas numeric country id ("840" = United States). */
  countryId?: string;
  /** us-atlas state FIPS id ("28" = Mississippi). */
  stateId?: string;
  /** [lng, lat] marker for cities and small places. */
  point?: [number, number];
  /** GeoJSON overlay in public/geo/overlays/ for historical regions. */
  overlay?: string;
}

export interface PlaceMusic {
  /**
   * 2–5 sentence music-history summary. Honest; backed by our articles.
   * Rendered through `makeTermLinker()`, so catalog artist names, concepts,
   * and loanwords light up — write the full catalog `name` ("Abe Schwartz").
   */
  blurb: string;
  /** Genre registry slugs. */
  genres?: string[];
  /** History article slugs. */
  history?: string[];
  /** Piano Roll manifest labels whose songs come from / evoke this place. */
  songLabels?: string[];
}

export interface Place {
  /** Stable id, kebab-case ("mississippi-delta", "bessarabia"). */
  id: string;
  kind: PlaceKind;
  /** Canonical display name. */
  name: string;
  /** Historical / alternate names, era-annotated, searchable. */
  aliases?: PlaceAlias[];
  geo: PlaceGeo;
  music: PlaceMusic;
  /** rich = real story; stub = a pointer to richer neighbours. */
  status: "rich" | "stub";
}

export const PLACES: Place[] = [
  // ──────────────────────────────── Klezmer ────────────────────────────────
  {
    id: "pale-of-settlement",
    kind: "historical-region",
    name: "Pale of Settlement",
    aliases: [{ name: "the Pale", era: "Russian Empire, 1791–1917" }],
    geo: { overlay: "pale-of-settlement.json" },
    music: {
      blurb:
        "The western provinces of the Russian Empire where most Jews were required to live — and the heartland of klezmer. Professional wedding musicians (klezmorim) worked its towns in family bands, playing freylekhs, shers, and bulgars around the rituals of the multi-day Jewish wedding. The shape drawn here is approximate; the Pale's exact boundaries shifted over its 126 years.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "galicia",
    kind: "historical-region",
    name: "Galicia",
    aliases: [
      { name: "Halychyna", era: "Ukrainian name" },
      { name: "Galitsye", era: "Yiddish name" },
    ],
    geo: { overlay: "galicia.json" },
    music: {
      blurb:
        "Austro-Hungarian crownland straddling today's Poland–Ukraine border, and one of klezmer's great regional schools. Naftule Brandwein — the 'King of the Klezmer Clarinet' — was born into a Galician klezmer dynasty in Przemyślany in 1884 before carrying the style to New York. Boundaries drawn here are approximate.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "bessarabia",
    kind: "historical-region",
    name: "Bessarabia",
    aliases: [
      { name: "Moldova", era: "modern state on most of its territory" },
    ],
    geo: { overlay: "bessarabia.json" },
    music: {
      blurb:
        "The land between the Prut and Dniester rivers — today mostly Moldova — where Jewish klezmorim and Rom lautari worked side by side for centuries. The bulgar and the hora entered klezmer here, and the region gave the American repertoire some of its best-loved tunes (our library's 'Bessarabyanke' among them). Boundaries approximate.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "ukraine",
    kind: "country",
    name: "Ukraine",
    aliases: [
      { name: "Podolia", era: "historical region, Dave Tarras's homeland" },
    ],
    geo: { countryId: "804" },
    music: {
      blurb:
        "Right-bank Ukraine — Podolia and Volhynia — sat at the center of the Pale of Settlement and its wedding-band tradition. Dave Tarras, the most-recorded klezmer musician in America, was born into a klezmer family near Ternivka in Podolia; the ethnomusicologist Moisei Beregovskii documented the Ukrainian klezmer repertoire in the 1930s–40s, defining how the genre system is understood today.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "romania",
    kind: "country",
    name: "Romania",
    aliases: [
      { name: "Wallachia", era: "historical principality" },
      { name: "Moldavia", era: "historical principality" },
    ],
    geo: { countryId: "642" },
    music: {
      blurb:
        "Klezmer's southern well. The doina (free-time lament), the hora, and the sirba all entered the Jewish repertoire from Romanian and Moldavian practice, where klezmorim and Rom lautari long worked in a single professional world. Abe Schwartz — Columbia Records' Jewish-music bandleader — was born near Bucharest in 1881.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "poland",
    kind: "country",
    name: "Poland",
    aliases: [
      {
        name: "Polish–Lithuanian Commonwealth",
        era: "1569–1795, where klezmer guilds formed",
      },
    ],
    geo: { countryId: "616" },
    music: {
      blurb:
        "In the towns of the Polish–Lithuanian Commonwealth, Jewish musicians organized into guilds from the late 16th century — the moment the respectable word 'klezmer' (from Hebrew kley zemer, 'vessels of song') displaced older, mocking names for the trade. Western Galicia, including Kraków, lies in today's Poland.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "lithuania",
    kind: "country",
    name: "Lithuania",
    geo: { countryId: "440" },
    music: {
      blurb:
        "The northern reach of the klezmer world. Vilnius — Vilna to its Jews — was one of Ashkenazi Europe's great cultural capitals, home of the YIVO institute whose archives later fueled the klezmer revival. Our library's 'Shabes in Vilna' remembers it in song.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "stub",
  },
  {
    id: "moldova",
    kind: "country",
    name: "Moldova",
    aliases: [{ name: "Bessarabia", era: "historical name of the region" }],
    geo: { countryId: "498" },
    music: {
      blurb:
        "Modern Moldova covers most of historical Bessarabia — see the Bessarabia overlay for the klezmer story: the homeland of the bulgar and the hora, where Jewish and Rom musicians shared one professional world.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "stub",
  },
  {
    id: "vilnius",
    kind: "city",
    name: "Vilnius",
    aliases: [
      { name: "Vilna", era: "Yiddish/Russian-era name" },
      { name: "Wilno", era: "Polish-era name" },
    ],
    geo: { point: [25.2797, 54.6872] },
    music: {
      blurb:
        "'The Jerusalem of Lithuania' — a capital of Ashkenazi learning and culture, remembered in our library by 'Shabes in Vilna.' The YIVO institute, founded here in 1925 and re-rooted in New York, kept the record collections that the 1970s klezmer revival was built on.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "odessa",
    kind: "city",
    name: "Odesa",
    aliases: [{ name: "Odessa", era: "Russian-era spelling" }],
    geo: { point: [30.7233, 46.4825] },
    music: {
      blurb:
        "The Black Sea boomtown of the late Russian Empire, with one of the world's largest Jewish communities and a famously worldly musical life where klezmer met Greek, Russian, and Romanian styles. The repertoire remembers it by name — 'Odessa Bulgarish' and 'Mayn tayere Odessa' are both in our library.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "chisinau",
    kind: "city",
    name: "Chișinău",
    aliases: [{ name: "Kishinev", era: "Russian-era name" }],
    geo: { point: [28.8575, 47.0105] },
    music: {
      blurb:
        "Capital of Bessarabia and a klezmer center — the 'Keshenever Bulgar' in our library carries its old name. The city's 1903 pogrom also drove a wave of the emigration that carried this music to America.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "israel",
    kind: "country",
    name: "Israel",
    geo: { countryId: "376" },
    music: {
      blurb:
        "Klezmer's other diaspora. Ashkenazi immigrants carried the wedding repertoire here, but the young state pressed toward a new Hebrew identity and often heard Yiddish and its music as the sound of the exile it was leaving behind — a marginalization more uneven than the 'ban' of legend. From the 1980s the music returned as heritage: the Israel Philharmonic clarinetist Giora Feidman took it to the world's stages, and Safed's summer festival became the largest of its kind. Zoom in for the festival town.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
  {
    id: "safed",
    kind: "city",
    name: "Safed",
    aliases: [
      { name: "Tzfat", era: "common transliteration" },
      { name: "Tsfat", era: "Hebrew name" },
    ],
    geo: { point: [35.4936, 32.9662] },
    music: {
      blurb:
        "The Galilean hill town — one of Judaism's four holy cities — that has hosted the International Klezmer Festival every summer since 1988, filling the alleys of its Old City with free performances. It is the largest klezmer festival in Israel, and Giora Feidman's 'Clarinet and Klezmer in the Galilee' master class meets in the same town.",
      genres: ["klezmer"],
      history: ["klezmer"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },

  // ──────────────────────────────── Blues ─────────────────────────────────
  {
    id: "west-african-savanna",
    kind: "region",
    name: "West African savanna",
    aliases: [
      { name: "Sudanic belt", era: "ethnomusicologists' term" },
      { name: "Sahel", era: "the belt's northern edge" },
    ],
    geo: { overlay: "west-african-savanna.json" },
    music: {
      blurb:
        "The savanna and Sahel of West Africa — the region ethnomusicologist Gerhard Kubik identifies with the practices that fed the blues: pentatonic pitch, call-and-response, and bent, sliding notes. These traits crossed the Atlantic with enslaved people and were remade in the American South; the blues did not exist here as a genre, but much of its vocabulary did. Shape approximate.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "united-states",
    kind: "country",
    name: "United States",
    geo: { countryId: "840" },
    music: {
      blurb:
        "Two of our mapped histories converge here: the blues, which took shape in African-American communities of the South around the turn of the 20th century, and klezmer, which immigrant Jewish musicians carried into New York's halls, theaters, and recording studios. Zoom in — the states and cities each hold a chapter.",
      genres: ["blues", "klezmer"],
      history: ["blues", "klezmer"],
      songLabels: ["blues", "klezmer"],
    },
    status: "rich",
  },
  {
    id: "mississippi-delta",
    kind: "historical-region",
    name: "Mississippi Delta",
    aliases: [{ name: "the Delta", era: "Yazoo–Mississippi floodplain" }],
    geo: { overlay: "mississippi-delta.json" },
    music: {
      blurb:
        "The flat, cotton-rich floodplain between the Mississippi and Yazoo rivers — the landscape most tightly bound to the blues legend. The popular story of the blues being 'born' here is more legend than settled history (the form likely crystallized here rather than began here), but the Delta's players — Muddy Waters among them — defined country blues before carrying it north. Shape approximate.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "mississippi",
    kind: "state",
    name: "Mississippi",
    geo: { stateId: "28" },
    music: {
      blurb:
        "W. C. Handy's famous account of first hearing the blues is set at a train station in Tutwiler, Mississippi, around 1903 — a guitarist pressing a knife to the strings, singing about 'where the Southern cross' the Dog.' Muddy Waters was first recorded near Clarksdale in 1941 by Alan Lomax and John Work for the Library of Congress. See also the Mississippi Delta overlay.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "memphis",
    kind: "city",
    name: "Memphis",
    geo: { point: [-90.049, 35.1495] },
    music: {
      blurb:
        "Where the blues went to press: W. C. Handy's Memphis years produced the first widely published blues sheet music in the 1910s, turning a vernacular practice into popular song. Beale Street became the genre's first urban address.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "st-louis",
    kind: "city",
    name: "St. Louis",
    geo: { point: [-90.1994, 38.627] },
    music: {
      blurb:
        "W. C. Handy's 'St. Louis Blues' (1914) reached a national audience and became one of the most-recorded songs of its era — the moment the blues became an industry as well as a practice. The city sat on the migration route that carried Delta players north.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "new-orleans",
    kind: "city",
    name: "New Orleans",
    geo: { point: [-90.0715, 29.9511] },
    music: {
      blurb:
        "The Gulf port where blues, ragtime, and brass-band traditions cross-pollinated into jazz. Louis Armstrong carried its cornet style north — and in 1925 traded call-and-response phrases with Bessie Smith on the classic recording of 'St. Louis Blues.'",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "chicago",
    kind: "city",
    name: "Chicago",
    geo: { point: [-87.6298, 41.8781] },
    music: {
      blurb:
        "Terminus of the Great Migration and birthplace of the electric blues. Muddy Waters arrived from Mississippi in 1943 and switched to electric guitar to cut through noisy South Side clubs; pushed by a full band, country blues became Chicago blues — the sound that fed directly into rock and roll.",
      genres: ["blues", "rock"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "great-migration",
    kind: "historical-region",
    name: "Great Migration corridor",
    aliases: [{ name: "Highway 61 / Illinois Central route", era: "20th century" }],
    geo: { overlay: "great-migration.json" },
    music: {
      blurb:
        "Between roughly 1916 and 1970, millions of Black Americans left the rural South for northern cities, and the blues traveled with them — up Highway 61 and the Illinois Central line from the Delta through Memphis and St. Louis to Chicago. The corridor drawn here is schematic: one of several routes, and the one the blues story follows most closely.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "rich",
  },
  {
    id: "texas",
    kind: "state",
    name: "Texas",
    geo: { stateId: "48" },
    music: {
      blurb:
        "Home of one of the blues' oldest regional branches — itinerant songsters working outside the Delta orbit, later an electric tradition of its own. Our library's blues collection includes many Texas-associated tunes.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "stub",
  },
  {
    id: "tennessee",
    kind: "state",
    name: "Tennessee",
    geo: { stateId: "47" },
    music: {
      blurb:
        "Memphis is the story here — the city where W. C. Handy first published the blues. Select it on the map for the full chapter.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "stub",
  },
  {
    id: "louisiana",
    kind: "state",
    name: "Louisiana",
    geo: { stateId: "22" },
    music: {
      blurb:
        "New Orleans is the story here — where blues and ragtime met the brass bands and became jazz. Select the city for the full chapter.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "stub",
  },
  {
    id: "illinois",
    kind: "state",
    name: "Illinois",
    geo: { stateId: "17" },
    music: {
      blurb:
        "Chicago is the story here — the electric blues capital at the end of the Great Migration. Select the city for the full chapter.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "stub",
  },
  {
    id: "missouri",
    kind: "state",
    name: "Missouri",
    geo: { stateId: "29" },
    music: {
      blurb:
        "St. Louis is the story here — the city in the title of the song that made the blues a national music. Select the city for the full chapter.",
      genres: ["blues"],
      history: ["blues"],
      songLabels: ["blues"],
    },
    status: "stub",
  },

  // ─────────────────────────── Shared / crossover ──────────────────────────
  {
    id: "new-york",
    kind: "city",
    name: "New York",
    aliases: [
      { name: "Lower East Side", era: "immigrant klezmer's first American home" },
      { name: "Second Avenue", era: "the Yiddish theater district" },
    ],
    geo: { point: [-73.9857, 40.7484] },
    music: {
      blurb:
        "Where klezmer became American. Two million Eastern European Jews arrived between 1881 and 1924; their music filled Lower East Side halls, Second Avenue's Yiddish theaters, and — from about 1917 — the recording studios, where Abe Schwartz's orchestras and the rival clarinets of Naftule Brandwein and Dave Tarras cut the 78s the revival was later built on. It's also where the blues first hit records: Mamie Smith's 'Crazy Blues' (1920) was cut here, and 'Bei Mir Bistu Shein' jumped from the Yiddish stage to the top of the charts in 1937.",
      genres: ["klezmer", "blues"],
      history: ["klezmer", "blues"],
      songLabels: ["klezmer"],
    },
    status: "rich",
  },
];

export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

/** Places whose music touches a given genre slug ("blues", "klezmer"). */
export function placesByGenre(genre: string): Place[] {
  return PLACES.filter((p) => (p.music.genres ?? []).includes(genre));
}

/** True when a place belongs to the given genre (null genre = no filter). */
export function placeInGenre(
  place: Place | undefined,
  genre: string | null,
): boolean {
  if (!genre) return true;
  return Boolean(place && (place.music.genres ?? []).includes(genre));
}

/** Genre slugs that actually have at least one mapped place, in first-seen order. */
export function mappedGenreSlugs(): string[] {
  const seen: string[] = [];
  for (const p of PLACES) {
    for (const g of p.music.genres ?? []) {
      if (!seen.includes(g)) seen.push(g);
    }
  }
  return seen;
}

/** Place bound to a world-atlas country feature id, if any. */
export function placeByCountryId(countryId: string): Place | undefined {
  return PLACES.find((p) => p.geo.countryId === countryId);
}

/** Place bound to a us-atlas state FIPS id, if any. */
export function placeByStateId(stateId: string): Place | undefined {
  return PLACES.find((p) => p.geo.stateId === stateId);
}

export interface PlaceSearchResult {
  place: Place;
  /** The name that matched — canonical or an alias (with its era note). */
  matched: string;
  era?: string;
}

/**
 * Alias-aware search over the registry. Case-insensitive substring match,
 * canonical-name prefix matches first. Small corpus — no index needed.
 */
export function searchPlaces(query: string, limit = 8): PlaceSearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results: (PlaceSearchResult & { rank: number })[] = [];
  for (const place of PLACES) {
    const names: { name: string; era?: string }[] = [
      { name: place.name },
      ...(place.aliases ?? []),
    ];
    let best: (PlaceSearchResult & { rank: number }) | undefined;
    for (const n of names) {
      const lower = n.name.toLowerCase();
      const idx = lower.indexOf(q);
      if (idx === -1) continue;
      // Prefix beats infix; canonical beats alias.
      const rank = (idx === 0 ? 0 : 2) + (n.name === place.name ? 0 : 1);
      if (!best || rank < best.rank) {
        best = { place, matched: n.name, era: n.era, rank };
      }
    }
    if (best) results.push(best);
  }
  results.sort(
    (a, b) => a.rank - b.rank || a.place.name.localeCompare(b.place.name),
  );
  return results
    .slice(0, limit)
    .map(({ place, matched, era }) => ({ place, matched, era }));
}

/** A search hit is either a place to zoom to or a genre to filter by. */
export type MapSearchResult =
  | ({ kind: "place" } & PlaceSearchResult)
  | { kind: "genre"; slug: string; name: string };

/**
 * Unified map search: matches genre names/slugs AND place names/aliases, so
 * the single search box handles everything the map offers. Genre hits lead
 * (they're the broad "show me this music's world" answer); place hits follow.
 */
export function searchMap(query: string, limit = 8): MapSearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const genreHits: MapSearchResult[] = [];
  for (const slug of mappedGenreSlugs()) {
    const name = getGenre(slug)?.name ?? slug;
    if (slug.includes(q) || name.toLowerCase().includes(q)) {
      genreHits.push({ kind: "genre", slug, name });
    }
  }

  const placeHits: MapSearchResult[] = searchPlaces(query, limit).map((r) => ({
    kind: "place",
    ...r,
  }));

  return [...genreHits, ...placeHits].slice(0, limit);
}
