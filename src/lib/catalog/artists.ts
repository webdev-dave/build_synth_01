/**
 * Artists catalog — the people the app writes about.
 *
 * One of two cross-linked registries in the editorial catalog (the other is
 * `songs.ts`). An artist lists nothing about their songs; the song→artist link
 * lives on the song (`artists` plus optional `mentioned`), and
 * `songsByArtist()` derives the reverse. Both sides
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
  /**
   * Place-registry ids for this artist's embedded map, when genre-derivation
   * would be too broad. A pin is a *curated* set (the cities/regions they
   * actually worked in), so an artist page frames just their geography — not
   * the whole genre's. Omit to fall back to genre/history derivation.
   */
  places?: string[];
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
    places: ["mississippi", "memphis", "st-louis"],
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
    places: ["new-york", "mississippi"],
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
    places: ["new-orleans", "chicago", "new-york"],
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
    places: ["new-york"],
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
    places: ["mississippi-delta", "mississippi", "chicago"],
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
    places: ["galicia", "new-york"],
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
    places: ["ukraine", "new-york"],
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
    places: ["romania", "new-york"],
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
    places: ["ukraine", "new-york"],
    name: "Sholom Secunda",
    era: "1894–1974",
    micro:
      "Yiddish theater composer — one of the “big four” of New York's Second Avenue stage, and the writer of “Bei Mir Bistu Shein” and, with Aaron Zeitlin, “Dona Dona.”",
    bio: "Sholom Secunda was born in 1894 in Alexandria in the Kherson Governorate of the Russian Empire (now Ukraine) and emigrated with his family in 1907–08 after the pogroms, arriving at Ellis Island in steerage. A child-prodigy cantor, he studied at New York's Institute of Musical Arts (the future Juilliard) and became one of the “big four” composers of the Second Avenue Yiddish theater. His “Bay mir bistu sheyn,” written for a 1932 musical that closed after one season, was sold off for $30 — and became a worldwide hit in 1937 in the Andrews Sisters' English version, the Yiddish stage's greatest crossover. With Aaron Zeitlin he wrote “Dona Dona” for the 1940–41 play Esterke; in English translation it became a folk-revival standard.",
    genres: ["yiddish-theater"],
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
      "Dona Dona composer",
      "Yiddish theater composer",
    ],
  },
  {
    slug: "aaron-zeitlin",
    places: ["poland", "vilnius", "new-york"],
    name: "Aaron Zeitlin",
    era: "1898–1973",
    micro:
      "Yiddish and Hebrew poet and playwright who wrote the lyric of “Dona Dona” for his play Esterke — stranded in New York in 1939, he never saw his family in Warsaw again.",
    bio: "Aaron Zeitlin was born in 1898 in Uvarovichi (now Belarus), the son of the writer and thinker Hillel Zeitlin, and came of age in Gomel, Vilna, and Warsaw. He wrote in both Yiddish and Hebrew — poetry, fiction, criticism — chaired the Yiddish PEN Club in Warsaw, and edited the literary monthly Globus, where Isaac Bashevis Singer was a close collaborator. He published the play Esterke there in 1932. In 1939 Maurice Schwartz invited him to New York to prepare a production; the war closed the way home, and his wife, children, father, and brother were murdered. He settled in New York, taught Hebrew literature at the Jewish Theological Seminary, and wrote some of the most unsparing Yiddish and Hebrew poems of the destruction. The lyric he gave Sholom Secunda for Esterke — “Dona Dona,” or “Dos kelbl” — outlived the play. He died in 1973.",
    genres: ["yiddish-theater", "yiddish-folk"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Aaron_Zeitlin",
      },
      {
        label: "YIVO Encyclopedia — Zeitlin Family",
        url: "https://encyclopedia.yivo.org/article.aspx/Zeitlin_Family",
      },
    ],
    status: "live",
    keywords: [
      "Aaron Zeitlin",
      "Dona Dona lyricist",
      "Dos kelbl",
      "Esterke Yiddish play",
    ],
  },
  {
    slug: "maurice-schwartz",
    places: ["ukraine", "new-york"],
    name: "Maurice Schwartz",
    era: "1890–1960",
    micro:
      "Actor-manager who founded New York’s Yiddish Art Theatre in 1918 and staged Aaron Zeitlin’s Esterke — the 1940 production that first sang “Dona Dona.”",
    bio: "Maurice Schwartz was born Avram Moishe Schwartz in 1890 in Volhynia (now Ukraine) and reached New York after a hard childhood that included a stretch alone in London. In 1918 he founded the Yiddish Art Theatre, aiming at a literary company rather than Second Avenue potboilers — Shakespeare and Sholem Aleichem on the same boards. He directed and acted there for more than three decades. In October 1940 he opened the season with Zeitlin’s Esterke, music by Sholom Secunda: a costume drama of the Polish Esterke legend, and the first home of the song later known as “Dona Dona.” He died in 1960.",
    genres: ["yiddish-theater"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Maurice_Schwartz",
      },
    ],
    status: "live",
    keywords: [
      "Maurice Schwartz",
      "Yiddish Art Theatre",
      "Esterke",
    ],
  },
  {
    slug: "arthur-kevess",
    places: ["new-york"],
    name: "Arthur Kevess",
    era: "1916–1973",
    micro:
      "American translator of Yiddish and German songs whose 1950s English for “Dona Dona,” finished with Teddi Schwartz, is the version the folk revival sang.",
    bio: "Arthur Kevess (1916–1973) was a New York lyricist and translator, mainly of Yiddish and German songs, and an ASCAP writer. In July 1953 Sing Out! printed his English of “Dana, Dana, Dana,” still more populist than the later standard. In 1956 he and Teddi Schwartz revised it for their Hargail pamphlet Tumbalalaika — seventeen Jewish songs “for singing in English” — and that is the translation Joan Baez, Donovan, and most later English singers used. He also English’d the German protest song “Die Gedanken sind frei.”",
    genres: ["folk-revival", "yiddish-theater"],
    history: ["klezmer"],
    links: [
      {
        label: "SecondHandSongs",
        url: "https://secondhandsongs.com/artist/26245",
      },
    ],
    status: "live",
    keywords: [
      "Arthur Kevess",
      "Dona Dona English translation",
      "Tumbalalaika songbook",
    ],
  },
  {
    slug: "teddi-schwartz",
    places: ["new-york"],
    name: "Teddi Schwartz",
    era: "1914–2017",
    micro:
      "Yiddish singer and translator who, with Arthur Kevess, wrote the English “Dona Dona” that Joan Baez carried around the world.",
    bio: "Teddi Schwartz was born Theodora Rothfarb in 1914 in East Harlem to Yiddish-speaking immigrants; her father, Max, was a klezmer cornetist as well as a tailor. She studied at the Manhattan School of Music, sang and taught, and began turning American songs into Yiddish — then, with Arthur Kevess, turning Yiddish songs into singable English. Their 1956 Tumbalalaika pamphlet included “Dona Dona”; Jewish Currents reprinted it in 1958. She performed through the folk years, appeared at the 1964 World’s Fair, later toured with the Yiddisher Caravan, and turned up at the early KlezKamps. She died in 2017, at 103.",
    genres: ["yiddish-folk", "folk-revival"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Teddi_Schwartz",
      },
    ],
    status: "live",
    keywords: [
      "Teddi Schwartz",
      "Teddy Schwartz",
      "Dona Dona translator",
      "Yiddish folk singer",
    ],
  },
  {
    slug: "giora-feidman",
    places: ["chisinau", "bessarabia", "israel", "safed", "new-york"],
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
    places: ["new-york"],
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
  {
    slug: "theodore-bikel",
    places: ["israel", "new-york"],
    name: "Theodore Bikel",
    era: "1924–2015",
    micro:
      "Vienna-born actor and folk singer who recorded “Dona Dona” in Yiddish in 1959 — keeping the theater song alive on the American folk circuit just before Joan Baez’s English version.",
    bio: "Theodore Bikel was born in Vienna in 1924; after the Anschluss his family fled to Mandatory Palestine, where he acted with Habimah and helped found the Cameri Theatre. He studied at RADA in London, then made a dual career in America as a character actor — Captain von Trapp in the original Broadway Sound of Music, Tevye in Fiddler on the Roof more than two thousand times — and as a folk singer. For Elektra he cut albums of Jewish, Israeli, and international songs; Theodore Bikel Sings More Jewish Folk Songs (1959) includes “Dona Dona” in Yiddish. He co-founded the Newport Folk Festival that same year. He died in 2015.",
    genres: ["folk-revival", "yiddish-folk"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Theodore_Bikel",
      },
    ],
    status: "live",
    keywords: [
      "Theodore Bikel",
      "Dona Dona Yiddish",
      "Jewish folk songs Elektra",
    ],
  },
  {
    slug: "joan-baez",
    places: ["new-york"],
    name: "Joan Baez",
    era: "b. 1941",
    micro:
      "The soprano of the American folk revival, whose 1960 recording of “Donna, Donna” turned a Yiddish theater song into an English protest standard.",
    bio: "Joan Baez was born in New York in 1941 and came up through the Cambridge folk clubs and the 1959 Newport Folk Festival. At nineteen she recorded her Vanguard debut, Joan Baez (1960); among its traditional ballads sat “Donna, Donna” — Arthur Kevess and Teddi Schwartz’s English of Aaron Zeitlin and Sholom Secunda’s “Dona Dona.” The record made her famous, and she sang the calf-and-swallow lyric at civil-rights gatherings through the decade. She has spent a career interpreting other people’s songs (Dylan’s among the first) and tying the voice to nonviolence, civil rights, and human rights. She was inducted into the Rock and Roll Hall of Fame in 2017.",
    genres: ["folk-revival"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Joan_Baez",
      },
    ],
    status: "live",
    keywords: [
      "Joan Baez",
      "Donna Donna",
      "Dona Dona folk revival",
    ],
  },
  {
    slug: "donovan",
    name: "Donovan",
    era: "b. 1946",
    micro:
      "Scottish singer-songwriter who put Joan Baez’s “Donna, Donna” on his 1965 debut and helped carry the English Dona Dona into 1960s pop-folk.",
    bio: "Donovan Philips Leitch was born in Glasgow in 1946 and became the face of British folk-pop in the mid-1960s. His debut album, What’s Bin Did and What’s Bin Hid (1965), included a cover of Joan Baez’s “Donna, Donna,” which took the English Dona Dona onto the British and European circuit. Hits such as “Catch the Wind,” “Sunshine Superman,” and “Mellow Yellow” followed; the Yiddish theater calf was already on the record that introduced him.",
    genres: ["folk-revival"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Donovan",
      },
    ],
    status: "live",
    keywords: [
      "Donovan",
      "Donna Donna",
      "What's Bin Did and What's Bin Hid",
    ],
  },
  {
    slug: "tetos-demetriades",
    places: ["istanbul", "new-york"],
    name: "Tetos Demetriades",
    era: "1897–1971",
    micro:
      "Ottoman Greek tenor and later record man who cut the earliest known Misirlou — Columbia, New York, July 1927.",
    bio: "Theodotos (“Tetos”) Demetriades was born in Constantinople (Istanbul), most sources saying 4 December 1897, and left for the United States in 1921. He recorded widely for Columbia and Victor’s Greek catalogs, then moved into production: Orthophonic, Standard Phono, and Colonial. His July 1927 Columbia side of “Misirlou” is the earliest recording of the folk tune that can be pointed at. He died in Bergen, New Jersey, in 1971.",
    links: [
      {
        label: "Recording Pioneers",
        url: "https://www.recordingpioneers.com/RP_DEMETRIADES1.html",
      },
      {
        label: "DAHR — Misirlou, 1927",
        url: "https://adp.library.ucsb.edu/index.php/matrix/detail/2000375011/W205625-Misirlou_",
      },
    ],
    status: "live",
    keywords: [
      "Tetos Demetriades",
      "Theodotos Demetriades",
      "Misirlou 1927",
    ],
  },
  {
    slug: "michalis-patrinos",
    places: ["athens", "new-york"],
    name: "Michalis Patrinos",
    era: "active 1930s",
    micro:
      "Greek rebetiko singer who recorded Misirlou as Mousourlou around 1930 in Athens — a slower tsifteteli that also circulated in New York.",
    bio: "Michalis (Mike) Patrinos recorded the eastern Mediterranean folk tune in Greece circa 1930 under the title Mousourlou, and again in New York in 1931 on Orthophonic. His take is slower than Demetriades’s 1927 New York side and is the rebetiko / tsifteteli life most often cited next to it. In Greece he is sometimes credited as composer; elsewhere Nick Roubanis’s later copyright usually stands.",
    links: [
      {
        label: "Wikipedia — Misirlou",
        url: "https://en.wikipedia.org/wiki/Misirlou",
      },
      {
        label: "Shira.net — the story behind the song",
        url: "http://www.shira.net/music/misirlou-story.htm",
      },
    ],
    status: "live",
    keywords: [
      "Michalis Patrinos",
      "Mike Patrinos",
      "Mousourlou",
    ],
  },
  {
    slug: "nick-roubanis",
    places: ["new-york"],
    name: "Nick Roubanis",
    era: "active 1920s–1940s",
    micro:
      "Greek-American music instructor who registered a jazz-exotica arrangement of Misirlou and is still often printed as its composer.",
    bio: "Nicholas (Nick, Nikos) Roubanis was a Greek-American music instructor — sources also call him a teacher of Byzantine music — who copyrighted an arrangement of Misirlou (often dated 1934 or 1941). Because the claim was not legally challenged, he remains the credited composer on most American printings, including Dick Dale’s 1962 single. The folk contour is older; Demetriades had already named the song on a 1927 Columbia disc. English lyrics were later added by Chaim Tauber, Fred Wise, and Milton Leeds.",
    links: [
      {
        label: "Wikipedia — Misirlou",
        url: "https://en.wikipedia.org/wiki/Misirlou",
      },
    ],
    status: "live",
    keywords: [
      "Nick Roubanis",
      "Nikos Roubanis",
      "Misirlou composer credit",
    ],
  },
  {
    slug: "seymour-rexite",
    places: ["new-york"],
    name: "Seymour Rexite",
    era: "1914–2002",
    micro:
      "Yiddish theater tenor and radio star — born Shayele Rechtzeit — who sang Miriam Kressyn’s Yiddish Misirlou on Banner around 1948.",
    bio: "Seymour Rexite (born Shayele Rechtzeit in Piotrków Trybunalski, 18 January 1914) immigrated to the United States in 1920 as a child prodigy and became a leading voice of the New York Yiddish stage and of WEVD radio. With his wife Miriam Kressyn, whom he married in 1943, he spent decades performing American pop in Yiddish. Their Misirlou is the documented Yiddish life of the eastern Mediterranean folk tune; Banner issued it circa 1948 with Abe Ellstein at the piano. He served as president of the Hebrew Actors’ Union and died in New York in 2002.",
    genres: ["yiddish-theater"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Seymour_Rexite",
      },
      {
        label: "UW–Madison — Miserlou",
        url: "https://digital.library.wisc.edu/1711.dl/4L7FXNFQHRDTJ8U",
      },
    ],
    status: "live",
    keywords: [
      "Seymour Rexite",
      "Seymour Rechtzeit",
      "Yiddish radio",
      "Misirlou Yiddish",
    ],
  },
  {
    slug: "miriam-kressyn",
    places: ["new-york"],
    name: "Miriam Kressyn",
    era: "1910–1996",
    micro:
      "Yiddish theater actress and lyricist who wrote the Yiddish words to Misirlou and, with Seymour Rexite, turned American pop into Second Avenue Yiddish.",
    bio: "Miriam Kressyn was a star of the American Yiddish stage and, after her 1943 marriage to Seymour Rexite, his partner on a long-running WEVD radio program of Yiddish translations of popular songs. She is credited with the Yiddish lyric of Misirlou in the 1940s — the words Rexite recorded for Banner. She died in 1996 at 86; the couple is buried under the family name Rechtzeit at Mount Hebron.",
    genres: ["yiddish-theater"],
    history: ["klezmer"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Miriam_Kressyn",
      },
    ],
    status: "live",
    keywords: [
      "Miriam Kressyn",
      "Yiddish lyricist",
      "Misirlou Yiddish",
    ],
  },
  {
    slug: "dick-dale",
    places: ["california"],
    name: "Dick Dale",
    era: "1937–2019",
    micro:
      "The “King of the Surf Guitar,” whose 1962 Misirlou — learned from Lebanese uncles on the oud — became the life of the tune most of the world knows.",
    bio: "Dick Dale was born Richard Anthony Monsour in Massachusetts in 1937. His father was Lebanese; uncles played the eastern Mediterranean folk tune Misirlou on the oud, and Dale recast it as a one-string surf-guitar instrumental, released on Deltone in April 1962. The family had moved to Orange County, California, in 1954, where he took up surfing and built the reverb-heavy sound that defined the genre. Quentin Tarantino quoted the 1962 record over the opening of Pulp Fiction in 1994. Dale died in 2019, at 81.",
    links: [
      {
        label: "NPR obituary",
        url: "https://www.npr.org/2019/03/18/704329806/dick-dale-surf-guitar-legend-dead-at-81",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Dick_Dale",
      },
    ],
    status: "live",
    keywords: [
      "Dick Dale",
      "King of the Surf Guitar",
      "Misirlou 1962",
    ],
  },
  {
    slug: "naftali-abulafia",
    places: ["new-york"],
    name: "Naftali Zvi Margolies Abulafia",
    era: "recorded 1950s",
    micro:
      "Orthodox rabbi on the Lower East Side whom Harry Smith recorded singing Misirlou in the 1950s — a Jewish room for the tune, language uncertain.",
    bio: "Naftali Zvi Margolies Abulafia was an Orthodox rabbi in Manhattan. Ethnomusicologist and filmmaker Harry Smith recorded him singing Misirlou on the Lower East Side in the 1950s; Seth Rogovoy notes the tape as evidence that the melody had Jewish lives beyond the klezmer dance floor. A later write-up treats the performance as Hebrew. We do not have a verified public upload to catalog as its own song page.",
    history: ["klezmer"],
    links: [
      {
        label: "The Forward — Metamorphoses",
        url: "https://forward.com/culture/133769/metamorphoses-the-sources-and-journeys-of-a-tune/",
      },
    ],
    status: "live",
    keywords: [
      "Naftali Zvi Margolies Abulafia",
      "Harry Smith Misirlou",
      "Lower East Side",
    ],
  },
  {
    slug: "the-shvesters",
    places: ["israel", "new-york"],
    name: "The Shvesters",
    era: "formed 2017",
    micro:
      "Yiddish vocal duo of Chava Levi and Polina Fradkin — tight close harmony, jazz-leaning arrangements of Yiddish theater and folk songs. The name is Yiddish for “the sisters.”",
    bio: "The Shvesters are Chava Levi and Polina Fradkin, who met in Detroit high-school choir and theater and started singing together in Tel Aviv in 2017. They are not sisters — shvesters is Yiddish for sisters — but they dress and phrase like one instrument: close harmony, mouth trumpet, and swing takes on Yiddish oldies in the line of the Barry Sisters. Social-media clips made them widely known; they now tour from Israel and the U.S. Their live “Dona, Dona” is the Yiddish performance on this site.",
    genres: ["yiddish-theater", "yiddish-folk"],
    history: ["klezmer"],
    links: [
      {
        label: "Official site",
        url: "https://theshvesters.com/about",
      },
      {
        label: "JNS — How two Yiddish soul sisters became a singing sensation",
        url: "https://www.jns.org/feature/how-two-yiddish-soul-sisters-became-a-singing-sensation",
      },
    ],
    status: "live",
    keywords: [
      "The Shvesters",
      "Chava Levi",
      "Polina Fradkin",
      "Yiddish vocal duo",
    ],
  },
  {
    slug: "judy-garland",
    places: ["california"],
    name: "Judy Garland",
    era: "1922–1969",
    micro:
      "The voice of Dorothy in The Wizard of Oz — her 1939 “Over the Rainbow” became the song she was asked for for the rest of her life.",
    bio: "Judy Garland was born Frances Ethel Gumm in Grand Rapids, Minnesota, on June 10, 1922, and grew up on the vaudeville circuit with her sisters before MGM signed her as a teenager. In The Wizard of Oz (1939) she sang Harold Arlen and Yip Harburg’s “Over the Rainbow”; the studio nearly cut the ballad, and it became her signature. She recorded it for the film on October 7, 1938, and again for Decca in 1939. The Library of Congress added the 1939 record to the National Recording Registry (2016 class). She died in London on January 22, 1969.",
    links: [
      {
        label: "Library of Congress — Over the Rainbow (1939)",
        url: "https://www.loc.gov/programs/national-recording-preservation-board/recording-registry/registry-by-induction-years/2016/",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Judy_Garland",
      },
    ],
    status: "live",
    keywords: [
      "Judy Garland",
      "Dorothy Gale",
      "Over the Rainbow",
      "Wizard of Oz",
    ],
  },
  {
    slug: "harold-arlen",
    places: ["new-york", "california"],
    name: "Harold Arlen",
    era: "1905–1986",
    micro:
      "Buffalo-born composer — a cantor’s son, born Hyman Arluck — who wrote the melody of “Over the Rainbow” and a shelf of American standards.",
    bio: "Harold Arlen was born Hyman Arluck in Buffalo on February 15, 1905, the son of Cantor Samuel Arluck of the Pine Street Shul (Congregation B’rith Sholem). He sang in his father’s choir, left for New York as a pianist and singer, and took the name Arlen. With lyricist Yip Harburg he wrote the songs for The Wizard of Oz (1939); “Over the Rainbow” won the Academy Award for Best Original Song. The rest of his catalog — “Stormy Weather,” “Blues in the Night,” “That Old Black Magic” — sits in the Great American Songbook. He died on April 23, 1986.",
    links: [
      {
        label: "Songwriters Hall of Fame",
        url: "https://www.songhall.org/profiles/harold-arlen",
      },
      {
        label: "Jewish Buffalo History Center",
        url: "https://jewishbuffalohistory.org/a-z/arlen-harold/",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Harold_Arlen",
      },
    ],
    status: "live",
    keywords: [
      "Harold Arlen",
      "Hyman Arluck",
      "Over the Rainbow composer",
      "Wizard of Oz",
    ],
  },
  {
    slug: "yip-harburg",
    places: ["new-york", "california"],
    name: "Yip Harburg",
    era: "1896–1981",
    micro:
      "Lyricist of “Over the Rainbow” and “Brother, Can You Spare a Dime?” — born Isidore Hochberg on the Lower East Side to Yiddish-speaking parents.",
    bio: "Edgar Yipsel “Yip” Harburg was born Isidore Hochberg on the Lower East Side of New York on April 8, 1896. His parents, Lewis Hochberg and Mary Ricing, were Yiddish-speaking Orthodox Jews who had emigrated from Russia; he later said his love of theater began in boyhood visits to Yiddish theater and vaudeville with his father. He wrote the words to “Brother, Can You Spare a Dime?” and, with Harold Arlen, all the songs for The Wizard of Oz, including “Over the Rainbow.” He was blacklisted in Hollywood from 1950 to 1962. He died in Los Angeles on March 5, 1981.",
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Yip_Harburg",
      },
    ],
    status: "live",
    keywords: [
      "Yip Harburg",
      "E. Y. Harburg",
      "Isidore Hochberg",
      "Over the Rainbow lyricist",
    ],
  },
  {
    slug: "al-grand",
    places: ["new-york"],
    name: "Al Grand",
    era: "active 1970s–2000s",
    micro:
      "Retired New York City schoolteacher who put Gilbert and Sullivan into Yiddish — and wrote a singable Yiddish “Over the Rainbow.”",
    bio: "Al Grand is a retired New York City schoolteacher and lifelong Gilbert and Sullivan fan, long based on Long Island (North Bellmore). He is known for full Yiddish translations of the Savoy operas — especially Di Yam Gazlonim (The Pirates of Penzance) — performed with the Gilbert & Sullivan Light Opera Company of Long Island. In his spare time he also Yiddishized American popular songs. The Forward printed his “Iber a sheynem regnboygn” on June 13, 2003; he asked that the lyric not be used without permission. He also posted his own recording of the Yiddish “Over the Rainbow” to his YouTube channel, and Wolf Krakowski recorded the translation in Westhampton, Massachusetts, in 2016.",
    links: [
      {
        label: "The Forward — Der Yiddish-Vinkl, June 13, 2003",
        url: "https://forward.com/news/7485/der-yiddish-vinkl-june-13-2003/",
      },
      {
        label: "The New York Times — Dress British, Sing Yiddish",
        url: "https://www.nytimes.com/2006/10/22/theater/22schi.html",
      },
      {
        label: "YouTube — Al Grand’s channel (@algrand2)",
        url: "https://www.youtube.com/@algrand2",
      },
    ],
    status: "live",
    keywords: [
      "Al Grand",
      "Iber a sheynem regnboygn",
      "Di Yam Gazlonim",
      "Yiddish Gilbert and Sullivan",
    ],
  },
  {
    slug: "wolf-krakowski",
    name: "Wolf Krakowski",
    era: "b. 1947",
    micro:
      "Yiddish-speaking songwriter and guitarist who recasts old songs in a blues-and-rock idiom — including Al Grand’s “Iber dem regnboygn.”",
    bio: "Wolf Krakowski was born in 1947 at Saalfelden Farmach, a displaced-persons camp in Austria; his parents were Polish Jews who had survived the war in the Soviet Union. The family lived in Sweden and, from 1954, in Toronto. He later settled in Northampton, Massachusetts, and records on his own Kame’a Media label. Transmigrations / Gilgul (1996) put traditional Yiddish songs in a blues–rock–reggae band; Tzadik later issued Goyrl: Destiny (2002). In 2016 he recorded Al Grand’s Yiddish of “Over the Rainbow” in Westhampton, Massachusetts — the performance this site plays.",
    links: [
      {
        label: "Kame’a Media",
        url: "https://www.kamea.com/home.html",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Wolf_Krakowski",
      },
    ],
    status: "live",
    keywords: [
      "Wolf Krakowski",
      "Kamea Media",
      "Iber dem regnboygn",
      "Yiddish blues",
    ],
  },

  // ───────────────── The blues abroad (see /history/blues#abroad) ─────────────
  {
    slug: "chris-barber",
    places: ["united-kingdom", "london"],
    name: "Chris Barber",
    era: "1930–2021",
    micro:
      "English trad-jazz trombonist who used his own popularity to import the blues — the tours that put Big Bill Broonzy and Muddy Waters in front of British audiences were his.",
    bio: "Chris Barber led one of Britain's most popular bands of the 1950s, and spent that success on music his fans had never heard. Because the Musicians' Union barred visiting American instrumentalists, he first exploited the fact that singers belonged to a different union, then worked through the 1956 exchange agreement: Big Bill Broonzy and Brother John Sellers on a British concert tour in 1957, Sister Rosetta Tharpe, Sonny Terry and Brownie McGhee, and in October 1958 Muddy Waters with pianist Otis Spann. Barber spent decades afterwards correcting the legend that Muddy's electric guitar had scandalized Britain — Muddy, he said, never played loud. He kept touring into his late eighties and died in 2021.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "fRoots — “Blues History” interview",
        url: "https://www.chrisbarber.net/archives/froots/froots.htm",
      },
      {
        label: "Record Collector — The Demon Barber of British Blues",
        url: "https://recordcollectormag.com/articles/the-demon-barber-of-british-blues",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Chris_Barber",
      },
    ],
    status: "live",
    keywords: [
      "Chris Barber",
      "British blues tours 1957 1958",
      "Muddy Waters UK tour",
    ],
  },
  {
    slug: "big-bill-broonzy",
    places: ["chicago", "united-kingdom"],
    name: "Big Bill Broonzy",
    era: "c. 1893–1958",
    micro:
      "Prolific Chicago bluesman who reinvented himself as a solo “folk blues” singer for European audiences — the first of the great bluesmen many Britons ever heard live.",
    bio: "Born Lee Conley Bradley in the Mississippi Delta — the year is disputed, either 1893 or 1903, and he encouraged the confusion — Broonzy moved north in the 1920s and became one of the most recorded bluesmen of the pre-war Chicago era, first with a country style and later fronting small bands. After the war, as electric bands took over, he recast himself as a lone acoustic songster for the folk audience, and from 1951 toured Europe repeatedly. In 1957 he crossed Britain on a concert tour with Chris Barber's band, one of the first sustained encounters between British audiences and a working American blues singer. He died of cancer in Chicago in 1958.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Big_Bill_Broonzy",
      },
    ],
    status: "live",
    keywords: [
      "Big Bill Broonzy",
      "folk blues Europe tour",
      "Chicago blues 1930s",
    ],
  },
  {
    slug: "alexis-korner",
    places: ["london", "united-kingdom"],
    name: "Alexis Korner",
    era: "1928–1984",
    micro:
      "Paris-born, London-raised guitarist called the “father of British blues” — his Blues Incorporated was the band nearly every British blues musician passed through.",
    bio: "Alexis Korner was born in Paris in 1928 and moved to London as a teenager. He played in Chris Barber's band, then teamed with harmonica player Cyril Davies to run the London Blues and Barrelhouse Club, and in 1961 the pair formed Blues Incorporated — the first amplified rhythm-and-blues band in Britain, with a deliberately fluid line-up. Their Rhythm and Blues Night, opened at the Ealing Jazz Club on 17 March 1962, is generally treated as the moment British blues became its own scene; Korner introduced Mick Jagger and Keith Richards to Brian Jones there. He was inducted into the Rock & Roll Hall of Fame in 2024, alongside John Mayall, under the Musical Influence Award.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "The Ealing Club — history",
        url: "https://www.ealingclub.com/ealingclubhistory/",
      },
      {
        label: "Rock & Roll Hall of Fame — Class of 2024",
        url: "https://rockhall.com/inductees/classes/2024/",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Alexis_Korner",
      },
    ],
    status: "live",
    keywords: [
      "Alexis Korner",
      "Blues Incorporated",
      "Ealing Club 1962",
      "father of British blues",
    ],
  },
  {
    slug: "john-mayall",
    places: ["united-kingdom", "london"],
    name: "John Mayall",
    era: "1933–2024",
    micro:
      "The “godfather of British blues” — a bandleader whose Bluesbreakers worked less like a group than a school for guitarists.",
    bio: "John Mayall was born in Cheshire in 1933 and taught himself piano, guitar, and harmonica on his father's jazz and blues records. Alexis Korner talked him into moving to London, where he formed the Bluesbreakers; from 1963 the band held down a Marquee Club residency, and between 1965 and 1969 its revolving line-ups launched Eric Clapton (who left for Cream), Peter Green, John McVie, and Mick Fleetwood (who formed Fleetwood Mac), and Mick Taylor (who joined the Rolling Stones). The 1966 album Blues Breakers with Eric Clapton is usually credited with lighting the electric blues boom on both sides of the Atlantic. He was awarded an OBE in 2005, toured until 2022, and was inducted into the Rock & Roll Hall of Fame in 2024. He died in California that July.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "BBC News — obituary",
        url: "https://www.bbc.com/news/articles/c80ej3j9j72o",
      },
      {
        label: "Rock & Roll Hall of Fame — Class of 2024",
        url: "https://rockhall.com/inductees/classes/2024/",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/John_Mayall",
      },
    ],
    status: "live",
    keywords: [
      "John Mayall",
      "Bluesbreakers",
      "godfather of British blues",
    ],
  },
  {
    slug: "the-rolling-stones",
    places: ["london", "united-kingdom"],
    name: "The Rolling Stones",
    era: "formed 1962",
    micro:
      "The London band that formed at a blues night and took its name from a Muddy Waters record — then used its fame to put American bluesmen on American television.",
    bio: "The Rolling Stones came together in 1962 out of the crowd at Alexis Korner and Cyril Davies's blues night at the Ealing Club, where Brian Jones met Mick Jagger and Keith Richards; Charlie Watts arrived from Blues Incorporated. Their name came from Muddy Waters's “Rollin' Stone,” and their early sets were largely covers of Chess Records material — Waters, Howlin' Wolf, Jimmy Reed, Willie Dixon. That debt was not private: when ABC's Shindig! booked them in May 1965, they made Howlin' Wolf's appearance a condition of their own and sat at his feet while he played, giving him his first performance on American national television.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "Open Culture — the Stones introduce Howlin’ Wolf (1965)",
        url: "https://www.openculture.com/2024/07/the-rolling-stones-introduce-bluesman-howlin-wolf-on-us-tv-1965.html",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/The_Rolling_Stones",
      },
    ],
    status: "live",
    keywords: [
      "Rolling Stones blues covers",
      "Rollin' Stone Muddy Waters name",
      "Shindig Howlin' Wolf 1965",
    ],
  },
  {
    slug: "howlin-wolf",
    places: ["mississippi", "chicago", "germany", "united-kingdom"],
    name: "Howlin’ Wolf",
    era: "1910–1976",
    micro:
      "Born Chester Burnett — the huge voice of Chicago blues, and Muddy Waters’s great rival at Chess Records.",
    bio: "Chester Arthur Burnett was born in Mississippi in 1910 and worked as a farmer and juke-joint singer before recording in Memphis and moving to Chicago in the early 1950s. At Chess he cut “Smokestack Lightning,” “Spoonful,” “Little Red Rooster,” and “Killing Floor” — much of it written by or with Willie Dixon — in a voice that no British singer ever managed to imitate. His 1964 European tour with the American Folk Blues Festival found him larger crossover crowds than he had at home; the following year the Rolling Stones made his booking a condition of their own Shindig! appearance, and he played American national television for the first time at 54. He died in 1976.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "Open Culture — Howlin’ Wolf on Shindig! (1965)",
        url: "https://www.openculture.com/2024/07/the-rolling-stones-introduce-bluesman-howlin-wolf-on-us-tv-1965.html",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Howlin%27_Wolf",
      },
    ],
    status: "live",
    keywords: [
      "Howlin' Wolf",
      "Chester Burnett",
      "Chess Records",
      "Smokestack Lightning",
    ],
  },
  {
    slug: "willie-dixon",
    places: ["mississippi", "chicago", "germany"],
    name: "Willie Dixon",
    era: "1915–1992",
    micro:
      "Chess Records’ bassist, songwriter, and talent broker — the man who wrote much of the Chicago blues canon and helped ship it to Europe.",
    bio: "Willie Dixon was born in Vicksburg, Mississippi, in 1915 and became the central working musician of Chess Records in Chicago: house bassist, arranger, producer, and above all songwriter, with “Hoochie Coochie Man,” “Little Red Rooster,” “Spoonful,” and “I Just Want to Make Love to You” among the songs British bands later treated as standards. When the German promoters Horst Lippmann and Fritz Rau wanted to bring American blues to Europe, it was Dixon's contacts that made the American Folk Blues Festival possible from 1962, and he toured with it as bassist and de facto musical director. He spent his later years fighting for songwriters' royalties and founded the Blues Heaven Foundation. He died in 1992.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia — American Folk Blues Festival",
        url: "https://en.wikipedia.org/wiki/American_Folk_Blues_Festival",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Willie_Dixon",
      },
    ],
    status: "live",
    keywords: [
      "Willie Dixon",
      "Chess Records songwriter",
      "American Folk Blues Festival",
    ],
  },
  {
    slug: "memphis-slim",
    places: ["memphis", "chicago", "france"],
    name: "Memphis Slim",
    era: "1915–1988",
    micro:
      "Blues pianist born Peter Chatman who moved to Paris in 1962 and spent the rest of his life as Europe’s resident bluesman.",
    bio: "Memphis Slim was born John Len Chatman in Memphis in 1915 and made his name in Chicago from the late 1930s, leading the House Rockers and cutting hundreds of sides. In 1959 he formed a duo with Willie Dixon, first left the United States in 1960, and returned to Europe in 1962 with the first American Folk Blues Festival tour — then stayed. He lived in Paris for the rest of his life, playing the Latin Quarter clubs, appearing constantly on French television, acting in films, and scoring one. France made him a Commander of the Ordre des Arts et des Lettres. He died in Paris in 1988 and is buried in Memphis.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Memphis_Slim",
      },
      {
        label: "The New York Times — obituary (1988)",
        url: "https://www.nytimes.com/1988/02/27/obituaries/memphis-slim-singer-of-blues-is-dead-at-72.html",
      },
    ],
    status: "live",
    keywords: [
      "Memphis Slim",
      "Peter Chatman",
      "blues in Paris",
      "American blues expatriate",
    ],
  },
  {
    slug: "van-morrison",
    places: ["belfast", "united-kingdom"],
    name: "Van Morrison",
    era: "b. 1945",
    micro:
      "Belfast singer whose band Them turned a seaman’s mission into the north of Ireland’s rhythm-and-blues headquarters.",
    bio: "Van Morrison was born in Belfast in 1945 and grew up on his father's American blues, jazz, and gospel records. After showband work he fronted Them, whose residency at the Maritime Hotel — an old seaman's mission turned R&B club — made Belfast the place in Ireland where the blues was played hard, and produced “Gloria,” “Here Comes the Night,” and “Mystic Eyes.” He left for America and a long solo career, beginning with Astral Weeks (1968), which is not a blues record but could not have been made by someone who had not played them.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Van_Morrison",
      },
    ],
    status: "live",
    keywords: [
      "Van Morrison",
      "Them Belfast",
      "Maritime Hotel R&B",
      "Irish blues",
    ],
  },
  {
    slug: "rory-gallagher",
    places: ["ireland", "belfast", "united-kingdom"],
    name: "Rory Gallagher",
    era: "1948–1995",
    micro:
      "Irish blues guitarist who found the music in shortwave static in Cork, then made Belfast his base — a live player’s player who never chased a hit.",
    bio: "Rory Gallagher was born in Ballyshannon, County Donegal, in 1948 and raised in Cork, where he hunted American Forces Network and Radio Luxembourg for the blues that Irish state radio would not play. He formed Taste in Cork, then based himself in Belfast from 1967: the city sat outside the Federation of Irish Musicians' reach, had a hard blues and jazz scene around record-shop owner Dougie Knight and pianist Jim Daly, and gave Taste a residency at the Maritime that Them had made famous. He went solo in 1971 and built his reputation almost entirely on stage — Irish Tour '74, recorded through the worst of the Troubles, is the record most often held up as the evidence. He died in London in 1995, at 47.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "Louder — The Making of Irish Tour ’74",
        url: "https://www.loudersound.com/features/rory-gallagher-the-making-of-irish-tour-74",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Rory_Gallagher",
      },
    ],
    status: "live",
    keywords: [
      "Rory Gallagher",
      "Taste",
      "Irish Tour '74",
      "Irish blues guitar",
    ],
  },
  {
    slug: "cuby-and-blizzards",
    places: ["netherlands"],
    name: "Cuby + Blizzards",
    era: "formed 1964",
    micro:
      "Dutch blues band from the village of Grolloo whose farmhouse became a waystation for visiting American and British bluesmen.",
    bio: "Cuby + Blizzards were founded in 1964 in Grolloo, in the Dutch province of Drenthe, by singer Harry Muskee — whose dog Cuby gave the band its name — and guitarist Eelco Gelling. Their sound had no real precedent in the Netherlands, and hits like “Back Home” (1966) and “Window of My Eyes” (1967) made them a national band. Grolloo mattered as much as the records: the Chicago pianist Eddie Boyd rehearsed at Muskee's farm for three days before they cut Praise the Blues together in Hilversum in March 1967, John Mayall stayed there the same year, and Alexis Korner sat in with them on Live in Düsseldorf (1968). Muskee died in 2011.",
    genres: ["blues", "rock"],
    history: ["blues"],
    links: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Cuby_%2B_Blizzards",
      },
      {
        label: "Cuby Museum Grolloo — Praise the Blues",
        url: "https://www.cubymuseumgrolloo.nl/archief/edboyd.htm",
      },
    ],
    status: "live",
    keywords: [
      "Cuby + Blizzards",
      "Harry Muskee",
      "Dutch blues",
      "Praise the Blues Eddie Boyd",
    ],
  },
  {
    slug: "ali-farka-toure",
    places: ["mali", "west-african-savanna"],
    name: "Ali Farka Touré",
    era: "1939–2006",
    micro:
      "Malian guitarist whose music the West sold as “desert blues” — a label he rejected for the rest of his life.",
    bio: "Ali Ibrahim “Farka” Touré was born in the Timbuktu region of Mali in 1939 and made his home in Niafunké, on the Niger river. His hypnotic, repetitive guitar drew constant comparison to John Lee Hooker — journalists called him “the African John Lee Hooker” — and the comparison first built his international career and then infuriated him: he said he played traditional Songhai music, not the blues, and that the traffic had run the other way. His collaborations with Ry Cooder (Talking Timbuktu, 1994) and Toumani Diabaté brought him a worldwide audience, and he became the godfather of the Festival au Désert, playing its closing concert every year from 2003. He died in Bamako in 2006.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "The Guardian — obituary (2006)",
        url: "https://www.theguardian.com/news/2006/mar/08/guardianobituaries.artsobituaries",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Ali_Farka_Toure",
      },
    ],
    status: "live",
    keywords: [
      "Ali Farka Touré",
      "desert blues",
      "Malian blues",
      "Talking Timbuktu",
    ],
  },
  {
    slug: "tinariwen",
    places: ["mali"],
    name: "Tinariwen",
    era: "formed late 1970s",
    micro:
      "Tuareg collective from the Sahara whose guitar music is filed under “desert blues” — though they say they first heard American blues on tour in the 2000s.",
    bio: "Tinariwen — the name is Tamasheq for “deserts” — formed among Tuareg exiles in southern Algeria and northern Mali in the late 1970s. Founder Ibrahim Ag Alhabib built his first guitar from an oil can, a stick, and a bicycle brake wire, and learned on old Tuareg melodies, Arabic pop, and Ali Farka Touré's cassettes. Their songs of exile and rebellion circulated for years on tape before their first studio album in the early 1990s and their international touring from the early 2000s; Tassili (2011) won a Grammy. Members have said the resemblance to American blues is not borrowed — they had not heard it until they left the Sahara, and the bootlegs that did reach them were Dire Straits and Jimi Hendrix.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "Tinariwen — official biography",
        url: "https://www.tinariwen.com/About",
      },
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Tinariwen",
      },
    ],
    status: "live",
    keywords: [
      "Tinariwen",
      "Tuareg guitar",
      "desert blues",
      "Sahara blues band",
    ],
  },
  {
    slug: "downchild",
    places: ["canada"],
    name: "Downchild Blues Band",
    era: "formed 1969",
    micro:
      "Toronto blues band, named for a Sonny Boy Williamson song, whose bar-band repertoire the Blues Brothers carried onto American radio.",
    bio: "Downchild was formed in Toronto in 1969 by the guitarist and harmonica player Donnie “Mr. Downchild” Walsh and his brother, the singer Richard “Hock” Walsh, and took its name from Sonny Boy Williamson's “Mr. Downchild.” Two years as house band at Grossman's Tavern built the jump-and-Chicago-blues style that made them Canada's first nationally known blues act, with the 1973 hit “Flip, Flop and Fly.” Dan Aykroyd and John Belushi modeled the Blues Brothers on the Walsh brothers and recorded two Downchild songs — “(I Got Everything I Need) Almost” and “Shot Gun Blues” — on Briefcase Full of Blues in 1978.",
    genres: ["blues"],
    history: ["blues"],
    links: [
      {
        label: "The Canadian Encyclopedia",
        url: "https://thecanadianencyclopedia.ca/en/article/downchild-emc",
      },
      {
        label: "Canadian Songwriters Hall of Fame",
        url: "https://www.cshf.ca/song/ive-got-everything-i-need-almost/",
      },
    ],
    status: "live",
    keywords: [
      "Downchild Blues Band",
      "Donnie Walsh",
      "Canadian blues",
      "Blues Brothers Briefcase Full of Blues",
    ],
  },
];

export function getArtist(slug: string): Artist | undefined {
  return ARTISTS.find((a) => a.slug === slug);
}

/** Artists safe to index (real bios), for the sitemap + static params. */
export const LIVE_ARTISTS = ARTISTS.filter((a) => a.status === "live");
