/**
 * Artists catalog — the people the app writes about.
 *
 * One of two cross-linked registries in the editorial catalog (the other is
 * `songs.ts`). An artist lists nothing about their songs; the song→artist link
 * lives on the song, and `songsByArtist()` derives the reverse. Both sides
 * cross-link to genres/history by slug, so mentioning an artist in an article,
 * a song page, or a genre page all resolve to the same entry.
 *
 * This is *not* `src/lib/songs` (the MIDI arrangements the Piano Roll loads).
 * That catalog is about what we can play; this one is about what we reference.
 *
 * Source of truth for the `/artists` hub, `/artists/[slug]` pages, the inline
 * `<ArtistLink>` popover, and the sitemap.
 */

export interface ArtistLinkOut {
  label: string;
  url: string;
}

export interface Artist {
  /** URL slug + `<ArtistLink id>` key. Kebab-case ("bessie-smith"). */
  slug: string;
  /** Display name ("Bessie Smith"). */
  name: string;
  /** One-line "who is this" — shown in the popover and on cards. */
  micro: string;
  /** Longer plain-text bio for the spoke page. */
  bio?: string;
  /** Lifespan or active era, shown as a quiet subtitle ("1894–1937"). */
  era?: string;
  /** Genre registry slugs this artist is associated with. */
  genres?: string[];
  /** History article slugs that discuss them. */
  history?: string[];
  /** External "learn more" links (encyclopedias, archives). */
  links?: ArtistLinkOut[];
  /** "live" pages are indexed + in the sitemap; "soon" are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases for the spoke page metadata. */
  keywords?: string[];
}

export const ARTISTS: Artist[] = [
  {
    slug: "w-c-handy",
    name: "W. C. Handy",
    era: "1873–1958",
    micro:
      "Bandleader and composer often billed the “Father of the Blues” — not its inventor, but the musician who first wrote blues themes down and carried a folk music into print and popular song.",
    bio: "William Christopher Handy was a formally trained cornetist and bandleader who, by his own account, first heard the blues at a Mississippi train station around 1903. He began publishing adaptations of blues themes in the 1910s — “Memphis Blues” (1912) and “St. Louis Blues” (1914) among them — and more than anyone put the form into sheet music and, soon after, the record industry. The “Father of the Blues” title (also the name of his 1941 autobiography) overstates a single origin; historians treat him as the great popularizer and notator of a music that already lived in the vernacular.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Mississippi Blues Trail",
        url: "https://web.archive.org/web/20210221010924/http://msbluestrail.org/blues-trail-markers/w-c-handy",
      },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/W._C._Handy" },
    ],
    status: "live",
    keywords: ["W. C. Handy", "father of the blues", "St. Louis Blues composer"],
  },
  {
    slug: "bessie-smith",
    name: "Bessie Smith",
    era: "1894–1937",
    micro:
      "The “Empress of the Blues” — the most popular and highest-paid Black performer of the 1920s, whose big, unamplified voice defined classic (vaudeville) blues on record.",
    bio: "Bessie Smith rose through Black vaudeville and the tent-show circuit to become the leading blues singer of the 1920s. She began recording for Columbia in 1923; “Down Hearted Blues” sold in huge numbers and earned her the billing “Empress of the Blues” — the most popular and highest-paid Black performer of the decade. Her phrasing and sheer unamplified vocal power set the standard for classic (vaudeville) blues. The 1925 sessions, including “St. Louis Blues” with Louis Armstrong on cornet, are landmarks of the era. Her career waned with the Depression and the shift toward swing, and she died after a car accident in Mississippi in 1937.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bessie_Smith" },
    ],
    status: "live",
    keywords: ["Bessie Smith", "empress of the blues", "classic blues singer"],
  },
  {
    slug: "louis-armstrong",
    name: "Louis Armstrong",
    era: "1901–1971",
    micro:
      "Trumpeter and singer who reshaped jazz around the soloist; his cornet answers Bessie Smith’s vocals on the classic 1925 recording of “St. Louis Blues.”",
    bio: "Louis Armstrong, out of New Orleans, did more than any single musician to turn jazz into a soloist’s art, and his influence runs straight through American popular singing. He came up in the city’s brass-band and riverboat world, then through King Oliver’s band in Chicago and Fletcher Henderson’s in New York, before the Hot Five and Hot Seven sides of the late 1920s made the improvised solo the center of the music. In 1925 he recorded “St. Louis Blues” with Bessie Smith, his cornet trading phrases with her voice in the call-and-response the blues inherited. His career spanned five decades, from those early sides to “Hello, Dolly!” and “What a Wonderful World.”",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Louis_Armstrong",
      },
    ],
    status: "live",
    keywords: ["Louis Armstrong", "Satchmo", "jazz trumpet"],
  },
  {
    slug: "mamie-smith",
    name: "Mamie Smith",
    era: "1891–1946",
    micro:
      "Vaudeville singer whose 1920 “Crazy Blues” was the first blues hit recorded by a Black artist — the record that convinced labels a Black audience existed.",
    bio: "Mamie Smith was a vaudeville and cabaret performer when, in 1920, she recorded Perry Bradford’s “Crazy Blues” for OKeh. It sold in huge numbers, largely to Black buyers, and showed the labels that African American customers were a market they had ignored. The industry answered with a segregated catalog it called “race records” — 78s by Black musicians, sold as a category apart — the commercial door through which the country and city blues of the following decades walked. She continued to perform and appear in films through the 1940s.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mamie_Smith" },
    ],
    status: "live",
    keywords: ["Mamie Smith", "Crazy Blues", "first blues record"],
  },
  {
    slug: "muddy-waters",
    name: "Muddy Waters",
    era: "1913–1983",
    micro:
      "Born McKinley Morganfield, the Delta guitarist who electrified the blues in postwar Chicago, shaping the sound that fed directly into rock and roll.",
    bio: "McKinley Morganfield grew up on Stovall Plantation in the Mississippi Delta and was first recorded there playing acoustic country blues by Alan Lomax and John Work for the Library of Congress in 1941. He moved to Chicago in 1943 and switched to electric guitar to cut through noisy clubs; pushed by a full band, his country blues became Chicago blues — the sound that Chess Records put on disc and that British rock bands later treated as scripture. Records like “Rollin’ Stone” gave a British band its name and, more broadly, handed rock and roll much of its vocabulary. He died in 1983.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "Mississippi Encyclopedia",
        url: "https://mississippiencyclopedia.org/entries/muddy-waters/",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Muddy_Waters",
      },
    ],
    status: "live",
    keywords: ["Muddy Waters", "Chicago blues", "electric blues"],
  },
  {
    slug: "naftule-brandwein",
    name: "Naftule Brandwein",
    era: "1884–1963",
    micro:
      "The self-styled “King of the Klezmer Clarinet” — a wild, ecstatic Galician-born virtuoso whose 1920s New York recordings are still the reference point for klezmer clarinet a century later.",
    bio: "Naftule Brandwein was born in 1884 in Przemyślany, in Austro-Hungarian Galicia (now Ukraine), into a klezmer dynasty — his father Peysekhe was a fiddler and badkhn (wedding jester), and nearly all of his many brothers played. He emigrated to New York in 1909, settling on the Lower East Side, and through the 1920s recorded prolifically for Victor and Columbia, defining the hot, ornament-dense, seemingly improvised solo style of American klezmer clarinet. He was a legendary showman — the stories say he sometimes played with his back to the audience so rival clarinetists couldn't steal his fingerings. Hard living wound his career down; after a last 1941 session under the anglicized nickname “Nifty,” he faded from view, and by his death in 1963 he was known mainly to insiders. The 1970s revival restored him to the center of the canon.",
    genres: ["klezmer"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Naftule_Brandwein",
      },
      {
        label: "Institut Européen des Musiques Juives",
        url: "https://www.iemj.org/en/brandwein-naftule-1889-1963/",
      },
    ],
    status: "live",
    keywords: [
      "Naftule Brandwein",
      "king of the klezmer clarinet",
      "klezmer clarinet 78rpm",
    ],
  },
  {
    slug: "dave-tarras",
    name: "Dave Tarras",
    era: "c. 1895–1989",
    micro:
      "Brandwein's great rival and opposite — a poised, lyrical clarinetist from Podolia who defined American klezmer for half a century and lived to mentor the 1970s revival.",
    bio: "Dave Tarras was born David Tarasiuk around 1895–97 near Ternivka in Podolia (now Ukraine), third-generation klezmer — his father was a trombonist and badkhn. Conscripted into the tsar's army in 1915, his musicianship kept him in the regimental band and out of the trenches; after the revolution and pogroms he emigrated, reaching New York in 1921, where he briefly worked in a garment shop before his clarinet made him the most recorded klezmer musician in America. Where Brandwein was wild, Tarras was precise: warm-toned, elegantly phrased, at home in Yiddish theater pits and on Greek, Polish, and Russian sessions alike. At the start of the klezmer revival he mentored young musicians including Andy Statman, and in 1984 the National Endowment for the Arts awarded him a National Heritage Fellowship — the United States' highest honor in the folk and traditional arts. He died in 1989.",
    genres: ["klezmer"],
    history: ["klezmer"],
    links: [
      {
        label: "NEA National Heritage Fellow",
        url: "https://www.arts.gov/honors/heritage/dave-tarras",
      },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Dave_Tarras" },
    ],
    status: "live",
    keywords: [
      "Dave Tarras",
      "klezmer clarinet",
      "NEA National Heritage Fellowship klezmer",
    ],
  },
  {
    slug: "abe-schwartz",
    name: "Abe Schwartz",
    era: "1881–1963",
    micro:
      "Romanian-born violinist, composer, and Columbia Records' Jewish-music bandleader — the man whose studio orchestras put early American klezmer on record.",
    bio: "Abe Schwartz was born near Bucharest in 1881 and emigrated to New York in 1899. A dance-band violinist and leader in the city's Jewish circles, he was hired by Columbia Records around 1917 to organize ethnic-music sessions and scout Jewish talent — a role that made him the de facto architect of the recorded klezmer repertoire. His orchestras (under many names) cut hundreds of sides, including the 1918 “Der shtiler bulgar,” and his discoveries included Naftule Brandwein, who can be heard in his bands before striking out on his own. Because Schwartz often skipped written arrangements and trusted his players to know what to do, his records preserve the vernacular, spontaneous sound of the immigrant bands.",
    genres: ["klezmer"],
    history: ["klezmer"],
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Abe_Schwartz" },
      {
        label: "Milken Archive",
        url: "https://www.milkenarchive.org/artists/view/abe-schwartz",
      },
    ],
    status: "live",
    keywords: [
      "Abe Schwartz klezmer",
      "Abe Schwartz Orchestra",
      "early klezmer recordings Columbia",
    ],
  },
  {
    slug: "sholom-secunda",
    name: "Sholom Secunda",
    era: "1894–1974",
    micro:
      "Yiddish theater composer — one of the “big four” of New York's Second Avenue stage, and the writer of “Bei Mir Bistu Shein” and “Dona Dona.”",
    bio: "Sholom Secunda was born in 1894 in Alexandria in the Kherson Governorate of the Russian Empire (now Ukraine) and emigrated with his family in 1907–08 after the pogroms, arriving at Ellis Island in steerage. A child-prodigy cantor, he studied at New York's Institute of Musical Arts (the future Juilliard) and became one of the “big four” composers of the Second Avenue Yiddish theater. His “Bay mir bistu sheyn,” written for a 1932 musical that closed after one season, was sold off for $30 — and became a worldwide hit in 1937 in the Andrews Sisters' English version, the Yiddish stage's greatest crossover. His “Dona Dona” (1940) became a folk-revival standard in English translation.",
    genres: ["klezmer"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Sholom_Secunda",
      },
      {
        label: "Milken Archive",
        url: "https://www.milkenarchive.org/music/volumes/view/great-songs-of-the-american-yiddish-stage/work/bay-mir-bistu-sheyn/",
      },
    ],
    status: "live",
    keywords: [
      "Sholom Secunda",
      "Bei Mir Bistu Shein composer",
      "Yiddish theater composer",
    ],
  },
  {
    slug: "giora-feidman",
    name: "Giora Feidman",
    era: "b. 1936",
    micro:
      "Argentine-born Israeli clarinetist, the self-styled “King of Klezmer,” who left the Israel Philharmonic to carry klezmer to concert stages worldwide and helped drive its late-20th-century revival.",
    bio: "Giora Feidman was born in Buenos Aires in 1936 into a family of klezmorim — his father, grandfather, and great-grandfather were wedding musicians — whose Bessarabian Jewish forebears had fled the pogroms of Chișinău around 1905. After joining the Teatro Colón orchestra at eighteen, he emigrated to Israel in 1956 and became the youngest clarinetist ever to play with the Israel Philharmonic Orchestra, where he stayed for nearly two decades. In the early 1970s he left to pursue klezmer as a soloist; from New York, where he was crowned the “King of Klezmer,” he carried the music onto the world’s classical concert stages, later helped seed the klezmer revival in Germany, and contributed the clarinet voice to the score of “Schindler’s List.” He founded the annual “Clarinet and Klezmer in the Galilee” master class held in Safed, Israel.",
    genres: ["klezmer"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Giora_Feidman",
      },
      {
        label: "Deutsche Welle — “King of Klezmer” turns 85",
        url: "https://www.dw.com/en/king-of-klezmer-giora-feidman-turns-85/a-19134067",
      },
    ],
    status: "live",
    keywords: [
      "Giora Feidman",
      "King of Klezmer clarinet",
      "Israel Philharmonic klezmer",
    ],
  },
  {
    slug: "billie-holiday",
    name: "Billie Holiday",
    era: "1915–1959",
    micro:
      "Jazz and blues singer of unmatched phrasing whose 1939 “Strange Fruit” turned the blues tradition toward open protest.",
    bio: "Billie Holiday (born Eleanora Fagan) reshaped popular singing with her behind-the-beat phrasing and emotional directness, working with the leading jazz musicians of her time — from the Columbia small-group sides of the mid-1930s into a career that never sat still. In 1939, at Café Society in Greenwich Village, she began closing sets with “Strange Fruit,” Abel Meeropol’s stark poem about the lynching of Black Americans. Columbia would not touch it; she recorded it for Commodore, and it became the song she is most remembered for. She made the blues tradition’s undercurrent of witness and protest explicit, and she made the song her own. She died in 1959, at 44.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Billie_Holiday",
      },
    ],
    status: "live",
    keywords: ["Billie Holiday", "Strange Fruit", "jazz blues singer"],
  },
];

export function getArtist(slug: string): Artist | undefined {
  return ARTISTS.find((a) => a.slug === slug);
}

/** Artists safe to index (real bios), for the sitemap + static params. */
export const LIVE_ARTISTS = ARTISTS.filter((a) => a.status === "live");
