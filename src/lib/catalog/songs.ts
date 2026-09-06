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
 *
 * `lyrics` is sourced text for the song page: original language plus a
 * line-by-line English gloss when the original isn't English, and a separate
 * entry for each published version. Never invent a line.
 */
import { getArtist } from "./artists";
import { sortByLabel } from "@/lib/search/normalize";

/** One sung line. Non-English songs fill `en` (and usually `latin`). */
export interface LyricLine {
  /** The line as sung / printed in this version. */
  text: string;
  /** Romanization when `text` is not Latin (YIVO for Yiddish, etc.). */
  latin?: string;
  /** Line-by-line English gloss when this version isn't English. */
  en?: string;
  /** Stanza grouping (1, 2, …). Same number = same block on the page. */
  stanza?: number;
  /** Marks a refrain/chorus block. */
  role?: "verse" | "refrain";
}

export interface LyricSource {
  label: string;
  url?: string;
}

/** A labeled YouTube performance on the song page (Yiddish vs English, etc.). */
export interface SongRecording {
  youtubeId: string;
  /** Heading over the player ("Yiddish — The Shvesters, live"). */
  label: string;
  /** Catalog artist slug for this performance, when it isn't only the song credit. */
  artist?: string;
}

/** One published version of a song's words (original, translation, …). */
export interface SongLyrics {
  id: string;
  /** Heading ("Yiddish original", "English — Kevess & Schwartz"). */
  label: string;
  /** BCP-47 of `LyricLine.text`. */
  lang: string;
  /** Language name shown to the reader ("Yiddish"). */
  language: string;
  /** Who wrote or translated this version. */
  credit?: string;
  /** Where we took the text from — required, verified. */
  source: LyricSource;
  note?: string;
  lines: LyricLine[];
}

/**
 * Original-language naming for a song whose `title` is not English.
 * `title` stays the best-known Latin display; this carries the English name
 * and the home-language spelling so both show and both are searchable.
 * See `.cursor/rules/catalog-songs.mdc` — "Bilingual titles".
 */
export interface SongOriginalTitle {
  /** English title, or a literal gloss in quotes when there is no English title. */
  english: string;
  /** BCP-47 of the original language ("yi", "el", "ro"). */
  lang: string;
  /** Romanization when `title` is a stylized variant of the romanized form. */
  latin?: string;
  /** Native-script spelling — attested only, never invented. */
  native?: string;
}

export interface CatalogSong {
  /** URL slug + `<SongLink id>` key + in-page anchor. Kebab-case. */
  slug: string;
  /** Song/composition title ("St. Louis Blues"). Best-known Latin form. */
  title: string;
  /** Present iff `title` is not English — the English + home-language names. */
  original?: SongOriginalTitle;
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
  /**
   * YouTube video id — verified upload, never from memory. Omit when we
   * only have an archive/source link (`listen`) and no legal player.
   */
  youtubeId?: string;
  /**
   * Archive or publisher page when there is no YouTube id — the honest
   * way to hear a side we will not pirate.
   */
  listen?: { label: string; url: string };
  /**
   * Extra (or labeled) recordings — e.g. a Yiddish performance next to
   * the English one. When set, the song page and `<SongLink>` play these
   * in order; `youtubeId` is still the single-player fallback.
   */
  recordings?: SongRecording[];
  /** Playable arrangement id in `src/lib/songs`, when we have one. */
  pianoRollId?: string;
  /** One-line note about the song/recording, for the popover and card. */
  micro?: string;
  /** Longer plain-text note for the song spoke page, when the micro isn't enough. */
  about?: string;
  /**
   * Other catalog artists discussed on the song page (translators, additional
   * performers) who should get the reverse “Songs on the site” link without
   * appearing in the header credit line.
   */
  mentioned?: string[];
  /**
   * Sourced lyric versions for the song page. Non-English versions carry a
   * line-by-line English gloss. Omit only when no citable text can be found.
   */
  lyrics?: SongLyrics[];
  /** Genre registry slugs. */
  genres?: string[];
  /** History article slugs the song appears in. */
  history?: string[];
  /**
   * Cousin-article slugs this recording belongs to. Required when the
   * song is a member (or is named) in a `/cousins` article — the song
   * page renders those links at the top. Keep in sync with
   * `CousinArticle.members`.
   */
  cousins?: string[];
  /** Concept registry slugs this recording helps explain. */
  concepts?: string[];
  /** "live" pages are indexed + in the sitemap; "soon" are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases for the spoke page metadata. */
  keywords?: string[];
}

/** Shared Greek lyric for the two early Misirlou vocals. */
const MISIRLOU_GREEK_LYRICS: SongLyrics = {
  id: "greek",
  label: "Greek",
  lang: "el",
  language: "Greek",
  source: {
    label: "Greek Wikipedia, “Μισιρλού” (στίχοι)",
    url: "https://el.wikipedia.org/wiki/%CE%9C%CE%B9%CF%83%CE%B9%CF%81%CE%BB%CE%BF%CF%8D",
  },
  note: "Folk / rebetiko words as printed on the Greek Wikipedia article. English is a line-by-line gloss, not a singable rewrite.",
  lines: [
    {
      text: "Μισιρλού μου, η γλυκιά σου η ματιά",
      latin: "Misirlou mou, i glykia sou i matia",
      en: "My Misirlou, your sweet glance",
      stanza: 1,
    },
    {
      text: "Φλόγα μου 'χει ανάψει μες στην καρδιά.",
      latin: "Floga mou 'chei anapsei mes stin kardia.",
      en: "has lit a flame in my heart.",
      stanza: 1,
    },
    {
      text: "Αχ, για χαμπίμπι, αχ, για λε-λέλι, αχ,",
      latin: "Ach, gia habibi, ach, gia le-leli, ach,",
      en: "Ah, ya habibi, ah, ya le-leli, ah,",
      stanza: 1,
    },
    {
      text: "Τα δυο σου χείλη στάζουνε μέλι, αχ.",
      latin: "Ta dyo sou cheili stazoune meli, ach.",
      en: "your two lips drip honey, ah.",
      stanza: 1,
    },
    {
      text: "Αχ, Μισιρλού, μαγική, ξωτική ομορφιά.",
      latin: "Ach, Misirlou, magiki, xotiki omorfia.",
      en: "Ah, Misirlou, magical, exotic beauty.",
      stanza: 2,
      role: "refrain",
    },
    {
      text: "Τρέλα θα μου 'ρθει, δεν υποφέρω πια.",
      latin: "Trela tha mou 'rthei, den ypofero pia.",
      en: "Madness will come over me; I cannot bear it any longer.",
      stanza: 2,
      role: "refrain",
    },
    {
      text: "Αχ, θα σε κλέψω μέσ' απ' την Αραπιά.",
      latin: "Ach, tha se klepso mes' ap' tin Arapia.",
      en: "Ah, I will steal you out of Arabia.",
      stanza: 2,
      role: "refrain",
    },
    {
      text: "Μαυρομάτα Μισιρλού μου τρελή,",
      latin: "Mavromata Misirlou mou treli,",
      en: "Black-eyed Misirlou of mine, wild one,",
      stanza: 3,
    },
    {
      text: "Η ζωή μου αλλάζει μ' ένα φιλί.",
      latin: "I zoi mou allazei m' ena fili.",
      en: "my life changes with one kiss.",
      stanza: 3,
    },
    {
      text: "Αχ, για χαμπίμπι ενα φιλάκι, άχ",
      latin: "Ach, gia habibi ena filaki, ach",
      en: "Ah, ya habibi, one little kiss, ah",
      stanza: 3,
    },
    {
      text: "Απ' το γλυκό σου το στοματάκι, αχ.",
      latin: "Ap' to glyko sou to stomataki, ach.",
      en: "from your sweet little mouth, ah.",
      stanza: 3,
    },
  ],
};

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
    lyrics: [
      {
        id: "english",
        label: "English — Handy, 1914",
        lang: "en",
        language: "English",
        credit: "W. C. Handy — published as “Yellow Dog Rag” (1914), retitled “Yellow Dog Blues” (1919)",
        source: {
          label: "Wikisource, “Yellow Dog Rag” (Pace & Handy, 1914)",
          url: "https://en.wikisource.org/wiki/Yellow_Dog_Rag",
        },
        note: "Public domain in the United States. Dialect and period wording are as printed on the 1914 sheet.",
        lines: [
          {
            text: "E'er since Miss Susan Johnson lost her Jockey, Lee,",
            stanza: 1,
          },
          {
            text: "There has been much excitement, more to be;",
            stanza: 1,
          },
          {
            text: "You can hear her moaning night and morn.",
            stanza: 1,
          },
          {
            text: "“Wonder where my Easy Rider's gone?”",
            stanza: 1,
          },
          { text: "Cablegrams come of sympathy,", stanza: 1 },
          { text: "Telegrams go of inquiry,", stanza: 1 },
          {
            text: "Letters come from down in “Bam”,",
            stanza: 1,
          },
          { text: "And ev'ry where that Uncle Sam", stanza: 1 },
          { text: "Has even a rural delivery.", stanza: 1 },
          {
            text: "All day the phone rings, but it's not for me,",
            stanza: 1,
          },
          {
            text: "At last good tidings fill our hearts with glee,",
            stanza: 1,
          },
          { text: "This message comes from Tennessee:", stanza: 1 },
          {
            text: "Dear Sue, your Easy Rider struck his burg today",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "On a southboun' rattler sidedoor Pullman car.",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "Seen him here an' he was on the hog.",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "(spoken) The smoke was broke, no joke, not a jitney on him.",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "Easy Riders got a stay way,",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "So he had to vamp it but the hike aint far.",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "He's gone where the Southern cross' the Yellow Dog.",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "I know the Yellow Dog District like a book,",
            stanza: 3,
          },
          {
            text: "Indeed I know the route that Rider took;",
            stanza: 3,
          },
          {
            text: "Ev'ry crosstie, bayou, burg and bog.",
            stanza: 3,
          },
          {
            text: "Way down where the Southern cross' the Dog,",
            stanza: 3,
          },
          {
            text: "Money don't zactly grow on trees,",
            stanza: 3,
          },
          {
            text: "On cotton stalks it grows wid ease;",
            stanza: 3,
          },
          {
            text: "No racehorse, racetrack no grandstand",
            stanza: 3,
          },
          {
            text: "Is like Old Beck and Buckshot land,",
            stanza: 3,
          },
          {
            text: "Down where the Southern cross' the Dog.",
            stanza: 3,
          },
          {
            text: "Every kitchen there is a cabaret,",
            stanza: 3,
          },
          {
            text: "Down there the boll wevil works while the darkies glee,",
            stanza: 3,
          },
          {
            text: "This Yellow Dog Rag the livelong day.",
            stanza: 3,
          },
        ],
      },
    ],
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
    lyrics: [
      {
        id: "english",
        label: "English — Handy, 1914",
        lang: "en",
        language: "English",
        credit: "W. C. Handy",
        source: {
          label: "Wikisource, “St. Louis Blues” (Handy Bros., 1914)",
          url: "https://en.wikisource.org/wiki/St._Louis_Blues",
        },
        note: "Public domain in the United States. The 1914 sheet has further verses; this is the opening strain plus the gypsy verse — the core of the Bessie Smith recording.",
        lines: [
          { text: "I hate to see de ev'nin' sun go down", stanza: 1 },
          { text: "Hate to see de evenin' sun go down", stanza: 1 },
          { text: "Cause my baby, he done lef dis town", stanza: 1 },
          { text: "Feelin' tomorrow lak Ah feel today", stanza: 1 },
          { text: "Feel tomorrow lak Ah feel today", stanza: 1 },
          { text: "I'll pack my trunk, make ma get away", stanza: 1 },
          {
            text: "St. Louis woman wid her diamon' rings",
            stanza: 2,
          },
          {
            text: "Pulls dat man roun' by her apron strings",
            stanza: 2,
          },
          {
            text: "'Twant for powder an' for store bought hair",
            stanza: 2,
          },
          {
            text: "De man I love would not gone nowhere",
            stanza: 2,
          },
          {
            text: "Got de St. Louis Blues jes as blue as Ah can be",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "Dat man got a heart lak a rock cast in the sea",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "Or else he wouldn't have gone so far from me",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "Been to de Gypsy to get ma fortune tole",
            stanza: 4,
          },
          {
            text: "To de Gypsy done got ma fortune tole",
            stanza: 4,
          },
          {
            text: "Cause I'm most wile 'bout ma Jelly Roll",
            stanza: 4,
          },
          {
            text: "Gypsy done tole me, “don't you wear no black”",
            stanza: 4,
          },
          {
            text: "Yes she done tole me “don't you wear no black”",
            stanza: 4,
          },
          { text: "Go to St. Louis, you can win him back", stanza: 4 },
        ],
      },
    ],
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
      "Perry Bradford wrote the song; Smith recorded it for OKeh in August 1920. Major labels had treated Black artists as novelties and marketed almost exclusively to white buyers. Crazy Blues sold in huge numbers, many of them to Black customers, and OKeh — then Columbia, Paramount, and others — opened separate numbered series aimed at African American listeners. “Race records” was the industry’s name for that shelf, used from the early 1920s into the 1940s. In the Black press of the time, “the race” often meant “our people”; on a record label it still marked a Jim Crow product line. That segregated market is also the commercial door the country and city blues of the next decades walked through. Billboard retired the chart name in 1949 in favor of “rhythm and blues.” The 1920 Bradford sheet is public domain (IMSLP). This pass found no clean published transcription we will reprint — hunt again; do not invent a line.",
    genres: ["blues"],
    history: ["blues"],
    concepts: ["race-records"],
    status: "live",
    keywords: ["Crazy Blues", "Mamie Smith", "race records", "OKeh 1920"],
  },
  {
    slug: "heyser-bulgar",
    title: "Heyser Bulgar",
    // Full title "Der Heyser Bulgar" (The Hot Bulgar); de.pluspedia.org.
    original: {
      english: "The Hot Bulgar",
      lang: "yi",
      native: "הייסער בולגאר",
    },
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
    // "The Quiet Bulgar." No cited Yiddish spelling verified — english only.
    original: {
      english: "The Quiet Bulgar",
      lang: "yi",
    },
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
    // YIVO romanization "Bay mir bistu sheyn"; modern spelling בײַ מיר ביסטו שיין
    // (Wikipedia; SecondHandSongs). Older sheet music: בײַ מיר ביסטו שעהן.
    original: {
      english: "To Me You’re Beautiful",
      lang: "yi",
      latin: "Bay mir bistu sheyn",
      native: "בײַ מיר ביסטו שיין",
    },
    artists: ["sholom-secunda"],
    artistLabel: "The Andrews Sisters, 1937",
    year: "1932",
    youtubeId: "EGveTSQbH30",
    pianoRollId: "bei-mir-bistu-shein",
    micro:
      "Written by Sholom Secunda for a 1932 Yiddish musical that closed in a season; five years later the Andrews Sisters' English version became a worldwide hit — the Yiddish stage's greatest crossover.",
    about:
      "Secunda and lyricist Jacob Jacobs wrote it for the 1932 Yiddish musical I Would If I Could (M’ken lebn nor m’lozt nit), which closed after one season in Brooklyn. In 1937 they sold the publishing rights for $30. That same year Sammy Cahn and Lou Levy heard two Black performers sing it in Yiddish at the Apollo; Cahn wrote English lyrics, and the Andrews Sisters cut it for Decca as a B-side. It became their first huge hit — and the Yiddish stage’s greatest crossover — while Secunda watched from Second Avenue.",
    lyrics: [
      {
        id: "yiddish",
        label: "Yiddish — Jacobs",
        lang: "yi",
        language: "Yiddish",
        credit: "Jacob Jacobs (words), Sholom Secunda (music), 1932",
        source: {
          label: "Milken Archive, “Bay mir bistu sheyn” (Levin liner notes + lyrics)",
          url: "https://www.milkenarchive.org/music/volumes/view/great-songs-of-the-american-yiddish-stage/work/bay-mir-bistu-sheyn/",
        },
        note: "Romanization and English as printed by the Milken Archive. The Andrews Sisters’ English is a different lyric, not a translation.",
        lines: [
          {
            text: "ven du zolst zayn shvarts vi a toter,",
            en: "Even if you had a Tatar complexion,",
            stanza: 1,
          },
          {
            text: "ven du host oygn vi bay a koter,",
            en: "even if you had tomcat eyes,",
            stanza: 1,
          },
          {
            text: "un ven du hinkst tsu bislekh host hil serne fislekh,",
            en: "and even if you had a little limp, or had wooden legs,",
            stanza: 1,
          },
          {
            text: "zog ikh, “dos art mikh nit.”",
            en: "I would say, “It doesn’t bother me.”",
            stanza: 1,
          },
          {
            text: "ven du host a narishn shmeykhl,",
            en: "Even if you had a foolish smile,",
            stanza: 2,
          },
          {
            text: "un ven du host vayzoses seykhl,",
            en: "or were an utter simpleton,",
            stanza: 2,
          },
          {
            text: "ven du bist vild vi an indiyaner,",
            en: "even if you were as unrefined as a wild Indian,",
            stanza: 2,
          },
          {
            text: "bist afile a galitsyaner,",
            en: "even if you were as common as a coarse Galician Jew,",
            stanza: 2,
          },
          {
            text: "zog ikh, “dos art mikh nit.”",
            en: "I’d say, “It doesn’t bother me.”",
            stanza: 2,
          },
          {
            text: "bay mir bistu sheyn,",
            en: "To me you’re beautiful,",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "bay mir hostu kheyn,",
            en: "to me you have grace,",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "bay mir bistu eyner af der velt.",
            en: "to me you’re one of a kind.",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "bay mir bistu gut,",
            en: "To me you’re great,",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "bay mir hostu “it,”",
            en: "to me you have “it,”",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "bay mir bistu tayerer fun gelt.",
            en: "to me you’re more precious than riches.",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "fil sheyne meydlekh hobn shoyn gevolt nemen mikh.",
            en: "Many beautiful girls have wanted me,",
            stanza: 4,
          },
          {
            text: "un fun zey ale oysgeklibn hob ikh nor dikh.",
            en: "and from all of them I chose only you.",
            stanza: 4,
          },
        ],
      },
    ],
    genres: ["yiddish-theater"],
    history: ["klezmer"],
    status: "live",
  },
  {
    slug: "dona-dona",
    title: "Dona Dona",
    original: {
      english: "‘The Calf’ (Dos kelbl)",
      lang: "yi",
      native: "דאָנאַ דאָנאַ",
    },
    artists: ["aaron-zeitlin", "sholom-secunda", "the-shvesters"],
    artistLabel: "Aaron Zeitlin & Sholom Secunda, 1940",
    year: "1940",
    youtubeId: "hVZnQ6THZrI",
    pianoRollId: "dona-dona",
    cousins: ["dona-dona"],
    micro:
      "A 1940 Yiddish theater song — Aaron Zeitlin’s lyric, Sholom Secunda’s tune — about a calf bound for slaughter and a swallow that is free. The Shvesters sing it here in Yiddish; the English folk-revival life, “Donna, Donna,” has its own page.",
    about:
      "Aaron Zeitlin wrote the lyric and Sholom Secunda the tune for Zeitlin’s play Esterke (1940–41), first titled “Dana Dana” and also known as “Dos kelbl” (“the calf”). This page holds the Yiddish words and plays The Shvesters live. The English translation Joan Baez made famous is a separate catalog page, and the tune’s wider travels are told on the Cousins page.",
    mentioned: ["maurice-schwartz", "theodore-bikel"],
    lyrics: [
      {
        id: "yiddish",
        label: "Yiddish original",
        lang: "yi",
        language: "Yiddish",
        credit: "Aaron Zeitlin (words), Sholom Secunda (music)",
        source: {
          label: "Yosl and Chana Mlotek Yiddish Song Collection",
          url: "https://yiddishsongs.org/dona-dona/",
        },
        note: "First titled “Dana Dana,” also “Dos kelbl.” The refrain repeats after each verse.",
        lines: [
          {
            text: "אױפֿן פֿורל ליגט דאָס קעלבל",
            latin: "Oyfn furl ligt dos kelbl",
            en: "Upon the wagon lies the calf",
            stanza: 1,
          },
          {
            text: "ליגט געבונדן מיט אַ שטריק",
            latin: "Ligt gebundn mit a shtrik",
            en: "It lies bound with a rope",
            stanza: 1,
          },
          {
            text: "הױך אין הימל פֿליט דאָס שװעלבל",
            latin: "Hoykh in himl flit dos shvelbl",
            en: "High in the sky a swallow flies",
            stanza: 1,
          },
          {
            text: "פֿרײט זיך, דרײט זיך הין און קריק",
            latin: "Freyt zikh, dreyt zikh hin un krik",
            en: "Joyous, turning back and forth",
            stanza: 1,
          },
          {
            text: "לאַכט דער װינט אין קאָרן",
            latin: "Lakht der vint in korn",
            en: "The wind laughs in the rye",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "לאַכט און לאַכט און לאַכט",
            latin: "Lakht un lakht un lakht",
            en: "Laughs and laughs and laughs",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "לאַכט ער אָפּ אַ טאָג אַ גאַנצן",
            latin: "Lakht er op a tog a gantsn",
            en: "It laughs a whole day",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "מיט אַ האַלבער נאַכט",
            latin: "Mit a halber nakht",
            en: "Plus half the night",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "דאָנאַ, דאָנאַ, דאָנאַ…",
            latin: "Dona, dona, dona…",
            en: "Dona, dona, dona…",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "שרײַט דאָס קעלבל, זאָגט דער פּױער",
            latin: "Shrayt dos kelbl, zogt der poyer",
            en: "The calf cries; the farmer says",
            stanza: 3,
          },
          {
            text: "װער זשע הײסט דיך זײַן אַ קאַלב?",
            latin: "Ver zhe heyst dikh zayn a kalb?",
            en: "Who told you to be a calf?",
            stanza: 3,
          },
          {
            text: "װאָלסט געקערט צו זײַן אַ פֿױגל",
            latin: "Volst gekert tsu zayn a foygl",
            en: "You could have been a bird",
            stanza: 3,
          },
          {
            text: "װאָלסט געקערט צו זײַן אַ שװאַלב",
            latin: "Volst gekert tsu zayn a shvalb",
            en: "You could have been a swallow",
            stanza: 3,
          },
          {
            text: "בידנע קעלבער טוט מען בינדן",
            latin: "Bidne kelber tut men bindn",
            en: "Poor calves are bound",
            stanza: 4,
          },
          {
            text: "און מען שלעפּט זײ און מען שעכט",
            latin: "Un men shlept zey un men shekht",
            en: "And dragged and slaughtered",
            stanza: 4,
          },
          {
            text: "װער ס’האָט פֿליגל, פֿליט אַרױפֿצו",
            latin: "Ver s’hot fligl, flit aroyftsu",
            en: "Whoever has wings flies upward",
            stanza: 4,
          },
          {
            text: "איז בײַ קײנעם ניט קײן קנעכט",
            latin: "Iz bay keynem nit keyn knekht",
            en: "And is no one’s slave",
            stanza: 4,
          },
        ],
      },
    ],
    genres: ["yiddish-theater", "yiddish-folk"],
    history: ["klezmer"],
    status: "live",
    keywords: [
      "Dona Dona",
      "Dana Dana",
      "Dos kelbl",
      "Yiddish theater song",
      "The Shvesters",
    ],
  },
  {
    slug: "donna-donna",
    title: "Donna, Donna",
    artists: ["joan-baez", "arthur-kevess", "teddi-schwartz"],
    artistLabel: "Joan Baez, 1960",
    year: "1960",
    youtubeId: "j1zBEWyBJb0",
    cousins: ["dona-dona"],
    mentioned: ["aaron-zeitlin", "sholom-secunda", "donovan"],
    micro:
      "The English “Donna, Donna” — Arthur Kevess and Teddi Schwartz’s translation of the Yiddish “Dona Dona,” which Joan Baez put on her 1960 debut and the folk revival made a standard.",
    about:
      "Sholom Secunda made an English version that did not travel; the words that did are Arthur Kevess and Teddi Schwartz’s, published in Sing Out! in 1953 and revised for their 1956 pamphlet Tumbalalaika. Joan Baez recorded it as “Donna, Donna” on her 1960 Vanguard debut, and the calf became a folk-revival standard — sung at civil-rights gatherings and covered by Donovan in 1965. The Yiddish original, Aaron Zeitlin and Sholom Secunda’s theater song, is the other catalog page.",
    lyrics: [
      {
        id: "english",
        label: "English — Kevess & Schwartz",
        lang: "en",
        language: "English",
        credit: "Arthur Kevess and Teddi Schwartz, 1956 — the version Joan Baez recorded as “Donna, Donna”",
        source: {
          label: "Wikipedia, “Dona, Dona” (Kevess & Schwartz column)",
          url: "https://en.wikipedia.org/wiki/Dona,_Dona",
        },
        note: "The refrain repeats after each verse.",
        lines: [
          { text: "On a wagon bound for market", stanza: 1 },
          { text: "There's a calf with a mournful eye", stanza: 1 },
          { text: "High above him there's a swallow", stanza: 1 },
          { text: "Winging swiftly through the sky", stanza: 1 },
          {
            text: "How the winds are laughing",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "They laugh with all their might",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "Laugh and laugh the whole day through",
            stanza: 2,
            role: "refrain",
          },
          {
            text: "And half the summer's night",
            stanza: 2,
            role: "refrain",
          },
          { text: "Dona, dona, dona…", stanza: 2, role: "refrain" },
          { text: "“Stop complaining,” said the farmer", stanza: 3 },
          { text: "“Who told you a calf to be?", stanza: 3 },
          { text: "Why don't you have wings to fly away", stanza: 3 },
          { text: "Like the swallow so proud and free?”", stanza: 3 },
          {
            text: "Calves are easily bound and slaughtered",
            stanza: 4,
          },
          { text: "Never knowing the reason why", stanza: 4 },
          { text: "But whoever treasures freedom", stanza: 4 },
          { text: "Like the swallow has learned to fly", stanza: 4 },
        ],
      },
    ],
    genres: ["folk-revival"],
    history: ["klezmer"],
    status: "live",
    keywords: [
      "Donna Donna",
      "Dona Dona",
      "Joan Baez Donna Donna",
      "Donovan Donna Donna",
      "folk revival",
    ],
  },
  {
    slug: "misirlou-demetriades",
    title: "Misirlou",
    // Greek Μισιρλού, "Egyptian girl" (from Turkish Mısırlı); Wikipedia.
    original: {
      english: "‘Egyptian girl’",
      lang: "el",
      native: "Μισιρλού",
    },
    artists: ["tetos-demetriades"],
    artistLabel: "Tetos Demetriades, 1927",
    year: "1927",
    youtubeId: "LW6qGy3RtwY",
    cousins: ["miserlou"],
    mentioned: ["nick-roubanis"],
    micro:
      "The earliest known recording of the eastern Mediterranean folk tune — a Greek vocal, cut for Columbia in New York in July 1927.",
    about:
      "Theodotos (“Tetos”) Demetriades recorded “Misirlou” for Columbia in New York in July 1927 (matrix W205625; issued as Columbia 56073-F for the Greek market). He was an Ottoman Greek, born in Istanbul, who had arrived in the United States in 1921; the folk melody was already circulating among Arabic, Greek, and Jewish musicians. Nick Roubanis is often printed as composer from a later copyright; the contour is older than that credit.",
    lyrics: [MISIRLOU_GREEK_LYRICS],
    status: "live",
    keywords: [
      "Misirlou 1927",
      "Tetos Demetriades",
      "Columbia 56073-F",
      "Greek rebetiko",
    ],
  },
  {
    slug: "misirlou-patrinos",
    title: "Misirlou",
    original: {
      english: "‘Egyptian girl’",
      lang: "el",
      native: "Μισιρλού",
    },
    artists: ["michalis-patrinos"],
    artistLabel: "Michalis Patrinos, ca. 1930",
    year: "1930",
    youtubeId: "1Qd2Nb-oh4I",
    cousins: ["miserlou"],
    micro:
      "A slower Athens rebetiko / tsifteteli take, circulated as Mousourlou — the Greek life of the tune a few years after Demetriades’s New York 78.",
    about:
      "Michalis (Mike) Patrinos recorded the tune in Greece around 1930 as “Mousourlou,” a slower rebetiko intended for tsifteteli; a New York side followed in 1931 on Orthophonic. Some later credits in Greece name him instead of Roubanis. The YouTube transfer we play is a labeled 1930 Patrinos upload.",
    lyrics: [MISIRLOU_GREEK_LYRICS],
    status: "live",
    keywords: [
      "Mousourlou",
      "Michalis Patrinos",
      "Mike Patrinos Misirlou",
      "rebetiko 1930",
    ],
  },
  {
    slug: "misirlou-rexite",
    title: "Misirlou",
    original: {
      english: "‘Egyptian girl’",
      lang: "el",
      native: "Μισιρλού",
    },
    artists: ["seymour-rexite", "miriam-kressyn"],
    artistLabel: "Seymour Rexite, ca. 1948",
    year: "1948",
    listen: {
      label: "Listen at UW–Madison",
      url: "https://digital.library.wisc.edu/1711.dl/4L7FXNFQHRDTJ8U",
    },
    cousins: ["miserlou"],
    micro:
      "Yiddish words by Miriam Kressyn, sung by Seymour Rexite on Banner — the documented Yiddish life of Misirlou, held at UW–Madison.",
    about:
      "Miriam Kressyn wrote Yiddish lyrics for Misirlou in the 1940s; her husband Seymour Rexite (born Shayele Rechtzeit) popularized them. The copy we can point at is Banner’s “Miserlou,” ca. 1948, Rexite with Abe Ellstein at the piano, on the album Seymour Rechtzeit sings your favorite songs in his intimate style (Banner B 103). The University of Wisconsin–Madison holds the transfer. There is no verified YouTube upload we will embed, and we do not have a citable full Yiddish text to print.",
    genres: ["yiddish-theater"],
    history: ["klezmer"],
    status: "live",
    keywords: [
      "Miserlou Yiddish",
      "Seymour Rexite",
      "Seymour Rechtzeit",
      "Miriam Kressyn",
      "Banner Records",
    ],
  },
  {
    slug: "misirlou-dale",
    title: "Misirlou",
    original: {
      english: "‘Egyptian girl’",
      lang: "el",
      native: "Μισιρλού",
    },
    artists: ["dick-dale"],
    artistLabel: "Dick Dale & His Del-Tones, 1962",
    year: "1962",
    youtubeId: "MXB6T55oytE",
    cousins: ["miserlou"],
    micro:
      "The surf-guitar instrumental that made the folk tune a Western hit — one string, much faster, later quoted over the opening of Pulp Fiction.",
    about:
      "Dick Dale (born Richard Anthony Monsour) released “Miserlou” as a Deltone single in April 1962. He had learned the melody from Lebanese uncles who played it on the oud, and he recast it as a high-speed one-string guitar instrumental. Quentin Tarantino put this record — not a new composition — over the opening of Pulp Fiction in 1994. The track is instrumental; there are no lyrics to source.",
    genres: ["rock"],
    status: "live",
    keywords: [
      "Dick Dale Misirlou",
      "Miserlou 1962",
      "surf guitar",
      "Pulp Fiction",
    ],
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
    lyrics: [
      {
        id: "english",
        label: "English — Meeropol",
        lang: "en",
        language: "English",
        credit: "Abel Meeropol (as Lewis Allan), poem 1937; song recorded by Billie Holiday, 1939",
        source: {
          label: "African American Registry, “Strange Fruit” by Abel Meeropol",
          url: "https://aaregistry.org/poem/strange-fruit-by-abel-meeropol/",
        },
        note: "Still under U.S. copyright. Printed here for teaching, with attribution.",
        lines: [
          { text: "Southern trees bearing a strange fruit", stanza: 1 },
          { text: "Blood on the leaves and blood at the root", stanza: 1 },
          {
            text: "Black bodies swinging in the Southern breeze",
            stanza: 1,
          },
          {
            text: "Strange fruit hanging from the poplar trees",
            stanza: 1,
          },
          { text: "Pastoral scene of the gallant South", stanza: 2 },
          { text: "The bulging eyes and the twisted mouth", stanza: 2 },
          { text: "Scent of magnolia sweet and fresh", stanza: 2 },
          {
            text: "Then the sudden smell of burning flesh.",
            stanza: 2,
          },
          {
            text: "Here is a fruit for the crow to pluck",
            stanza: 3,
          },
          {
            text: "For the rain to wither, for the wind to suck",
            stanza: 3,
          },
          {
            text: "For the sun to rot, for the trees to drop",
            stanza: 3,
          },
          { text: "Here is a strange and bitter crop.", stanza: 3 },
        ],
      },
    ],
    genres: ["blues"],
    history: ["blues"],
    status: "live",
  },
  {
    slug: "over-the-rainbow",
    title: "Over the Rainbow",
    artists: ["judy-garland", "harold-arlen", "yip-harburg"],
    artistLabel: "Judy Garland, 1939",
    year: "1939",
    youtubeId: "PSZxmZmBfnU",
    cousins: ["over-the-rainbow"],
    micro:
      "Harold Arlen and Yip Harburg’s ballad for The Wizard of Oz — Judy Garland as Dorothy, 1939. The studio nearly cut it; it became her signature, and later took Yiddish words.",
    about:
      "The published title is “Over the Rainbow”; English speakers also call it “Somewhere Over the Rainbow.” Arlen wrote the tune and Harburg the lyric for MGM’s The Wizard of Oz. Garland recorded the film version on October 7, 1938, and a Decca side in 1939. It won the Academy Award for Best Original Song, and the Library of Congress added the 1939 record to the National Recording Registry (2016 class). Harburg was born Isidore Hochberg on the Lower East Side to Yiddish-speaking parents; the song itself is English. Al Grand’s Yiddish, “Iber dem regnboygn,” is a later life of the same melody — that recording has its own page.",
    lyrics: [
      {
        id: "english",
        label: "English — Harburg",
        lang: "en",
        language: "English",
        credit: "E. Y. “Yip” Harburg (words), Harold Arlen (music), 1939",
        source: {
          label: "Leo Feist, Inc. sheet music, 1939 — as sung in The Wizard of Oz",
          url: "https://www.loc.gov/exhibits/oz/ozsect2.html",
        },
        note: "Still under U.S. copyright. Printed here for teaching, with attribution — not a substitute for the publisher’s edition.",
        lines: [
          { text: "Somewhere over the rainbow", stanza: 1 },
          { text: "Way up high", stanza: 1 },
          { text: "There's a land that I heard of", stanza: 1 },
          { text: "Once in a lullaby", stanza: 1 },
          { text: "Somewhere over the rainbow", stanza: 2 },
          { text: "Skies are blue", stanza: 2 },
          { text: "And the dreams that you dare to dream", stanza: 2 },
          { text: "Really do come true", stanza: 2 },
          {
            text: "Someday I'll wish upon a star",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "And wake up where the clouds are far",
            stanza: 3,
            role: "refrain",
          },
          { text: "Behind me", stanza: 3, role: "refrain" },
          {
            text: "Where troubles melt like lemon drops",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "Away above the chimney tops",
            stanza: 3,
            role: "refrain",
          },
          {
            text: "That's where you'll find me",
            stanza: 3,
            role: "refrain",
          },
          { text: "Somewhere over the rainbow", stanza: 4 },
          { text: "Bluebirds fly", stanza: 4 },
          { text: "Birds fly over the rainbow", stanza: 4 },
          { text: "Why then, oh why can't I?", stanza: 4 },
          {
            text: "If happy little bluebirds fly",
            stanza: 5,
            role: "refrain",
          },
          { text: "Beyond the rainbow", stanza: 5, role: "refrain" },
          { text: "Why, oh why can't I?", stanza: 5, role: "refrain" },
        ],
      },
    ],
    status: "live",
    keywords: [
      "Over the Rainbow",
      "Somewhere Over the Rainbow",
      "Judy Garland",
      "Wizard of Oz",
      "Harold Arlen",
      "Yip Harburg",
    ],
  },
  {
    slug: "iber-dem-regnboygn",
    title: "Iber dem regnboygn",
    // Yiddish Forward spelling איבער דעם רעגן־בויגן (Krakowski coverage, 2016).
    original: {
      english: "Over the Rainbow",
      lang: "yi",
      native: "איבער דעם רעגן־בויגן",
    },
    artists: ["al-grand", "wolf-krakowski"],
    artistLabel: "Al Grand’s Yiddish translation",
    youtubeId: "9nCXeq9LRws",
    recordings: [
      {
        youtubeId: "9nCXeq9LRws",
        label: "Yiddish — Al Grand’s own upload (2009)",
        artist: "al-grand",
      },
      {
        youtubeId: "t9YB3QsArAI",
        label: "Yiddish — Wolf Krakowski, 2016",
        artist: "wolf-krakowski",
      },
    ],
    cousins: ["over-the-rainbow"],
    mentioned: ["judy-garland", "harold-arlen", "yip-harburg"],
    micro:
      "Al Grand’s singable Yiddish of “Over the Rainbow.” This page plays Grand’s own recording from his YouTube channel next to Wolf Krakowski’s 2016 blues-rock version.",
    about:
      "Grand, a retired New York City schoolteacher best known for putting Gilbert and Sullivan into Yiddish, published this translation in The Forward on June 13, 2003, as “Iber a sheynem regnboygn.” He marked it copyrighted and asked that it not be used without permission, so this page does not print the words. Grand later posted his own recording to his YouTube channel, its description carrying the full romanized lyric under that same 2003 copyright. Wolf Krakowski — a Yiddish-speaking songwriter who recasts old songs in a blues-and-rock band — recorded Grand’s lyric in Westhampton, Massachusetts, in 2016 for his own Kame’a Media channel (he spells the title “Iber Dem Regenboygen”). Both Yiddish recordings play here; the English original, Judy Garland in 1939, is the other catalog page.",
    genres: ["yiddish-folk"],
    status: "live",
    keywords: [
      "Iber dem regnboygn",
      "Iber a sheynem regnboygn",
      "Iber Dem Regenboygen",
      "איבער דעם רעגן־בויגן",
      "Yiddish Over the Rainbow",
      "Wolf Krakowski",
      "Al Grand",
    ],
  },
];

export function getCatalogSong(slug: string): CatalogSong | undefined {
  return SONGS_CATALOG.find((s) => s.slug === slug);
}

/** All catalog songs crediting a given artist, A–Z by title. */
export function songsByArtist(artistSlug: string): CatalogSong[] {
  return sortByLabel(
    SONGS_CATALOG.filter(
      (s) =>
        s.artists.includes(artistSlug) ||
        (s.mentioned?.includes(artistSlug) ?? false),
    ),
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

/** Renderable pieces of a song's title — Latin display plus, for non-English
 *  songs, the English name and native script. Surfaces use these instead of
 *  hand-formatting per page. See `.cursor/rules/catalog-songs.mdc`. */
export interface SongTitleParts {
  /** Primary Latin display (`song.title`). */
  display: string;
  /** English title/gloss, when the song isn't English and it differs from `display`. */
  english?: string;
  /** Native-script spelling, when attested. */
  native?: string;
  /** BCP-47 of the original language, for `<NativeScript>` / `lang`. */
  lang?: string;
}

export function songTitleParts(song: CatalogSong): SongTitleParts {
  const o = song.original;
  if (!o) return { display: song.title };
  return {
    display: song.title,
    english: o.english && o.english !== song.title ? o.english : undefined,
    native: o.native,
    lang: o.lang,
  };
}

/** Search-only alternate titles (English, romanization, native script). */
export function songTitleAliases(song: CatalogSong): string[] {
  const o = song.original;
  if (!o) return [];
  return [o.english, o.latin, o.native].filter((s): s is string => Boolean(s));
}

/** Songs safe to index (real content), for the sitemap + static params. */
export const LIVE_SONGS = SONGS_CATALOG.filter((s) => s.status === "live");

/** Players to show on the song page: labeled `recordings`, or the single default. */
export function songPageRecordings(song: CatalogSong): SongRecording[] {
  if (song.recordings?.length) return song.recordings;
  if (!song.youtubeId) return [];
  return [{ youtubeId: song.youtubeId, label: songAttribution(song) }];
}

/** Credit artists plus anyone named on a labeled recording, first-seen order. */
export function songLinkArtists(song: CatalogSong): string[] {
  const slugs = [
    ...song.artists,
    ...songPageRecordings(song)
      .map((recording) => recording.artist)
      .filter((slug): slug is string => Boolean(slug)),
  ];
  return [...new Set(slugs)];
}
