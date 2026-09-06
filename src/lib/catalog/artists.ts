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
];

export function getArtist(slug: string): Artist | undefined {
  return ARTISTS.find((a) => a.slug === slug);
}

/** Artists safe to index (real bios), for the sitemap + static params. */
export const LIVE_ARTISTS = ARTISTS.filter((a) => a.status === "live");
