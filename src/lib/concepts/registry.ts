/**
 * Music-theory concepts registry — the glossary behind inline "define on
 * click" terms.
 *
 * When an article (or any page) mentions a theory term like *pentatonic* or
 * *syncopation*, wrapping it in `<Term id="…">` turns the word into a quiet,
 * clickable definition: a one-line micro-blurb plus a link to the full
 * explanation. This registry is the single source of truth for those blurbs,
 * for the `/concepts` glossary hub, for the `/concepts/[slug]` pages, and for
 * the sitemap.
 *
 * Two homes for "learn more":
 *   • Some terms already have a richer page — *pentatonic* lives on
 *     `/scales/minor-pentatonic`. Those set `href` to that page and do NOT get
 *     a glossary stub (no thin duplicate).
 *   • The rest are glossary-owned: `href` is `/concepts/<slug>` and the spoke
 *     page renders the definition and cross-links.
 *
 * Cross-links are data, not prose: a concept lists the scale/genre/history
 * slugs where it shows up, and the spoke page renders "See it in action."
 */

export interface Concept {
  /** URL slug + `<Term id>` key. Kebab-case ("call-and-response"). */
  slug: string;
  /** Canonical display term ("pentatonic"). */
  term: string;
  /**
   * Other spellings/phrasings an author might write in prose ("off-beat",
   * "12-bar"). Only used to help authors find the right id — matching is
   * always explicit via the `id` prop, never automatic.
   */
  aliases?: string[];
  /** The 1–2 sentence blurb shown in the click popover. True on its own. */
  micro: string;
  /**
   * A longer plain-text explanation for the glossary spoke page. Omit for
   * terms whose `href` points at a richer page elsewhere.
   */
  definition?: string;
  /**
   * Where "Full explanation →" goes. Either `/concepts/<slug>` (glossary-
   * owned) or an existing richer page (e.g. `/scales/minor-pentatonic`).
   */
  href: string;
  /**
   * Optional search-shaped page/FAQ question. Defaults to `What is <term>?`;
   * set it when that reads badly (plurals, multi-word terms — e.g. "What are
   * half steps and whole steps?").
   */
  question?: string;
  /** Scale registry slugs where this concept is audible/playable. */
  scales?: string[];
  /** Genre registry slugs that lean on this concept. */
  genres?: string[];
  /** History article slugs that discuss it. */
  history?: string[];
  /** Catalog song slugs that make the term concrete. */
  songs?: string[];
  /** "live" pages are indexed + in the sitemap; "soon" are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases for the spoke page metadata. */
  keywords?: string[];
}

/** The glossary URL a concept owns, if it isn't delegated elsewhere. */
export function conceptHome(slug: string): string {
  return `/concepts/${slug}`;
}

export const CONCEPTS: Concept[] = [
  {
    slug: "pentatonic",
    term: "pentatonic",
    aliases: ["pentatonic scale", "five-note scale", "pentatonics"],
    micro:
      "A five-note scale. With no half-steps between its notes, nothing clashes — which is why it's the safe backbone of blues, rock, and folk melodies.",
    // Delegated: the scale page is the real, playable home.
    href: "/scales/minor-pentatonic",
    scales: ["minor-pentatonic"],
    genres: ["blues", "rock"],
    history: ["blues"],
    status: "live",
  },
  {
    slug: "blue-notes",
    term: "blue notes",
    aliases: ["blue note", "bent notes", "flattened notes"],
    micro:
      "Pitches sung or bent slightly lower than the major scale expects — most often around the third, fifth, and seventh. They're the 'aching' notes that give blues and jazz their color.",
    definition:
      "Blue notes are the microtonal pitches that don't sit on the piano's keys — a singer or guitarist slides just below the major third, the fifth, or the seventh, landing in the cracks between notes. Fixed-pitch instruments approximate them with the flattened third, fifth, and seventh, which is exactly what the blues scale freezes into place. The effect is older than the blues: it comes out of the vocal traditions of work songs, field hollers, and spirituals, themselves carrying West African habits of bending and sliding pitch rather than landing square on a fixed note.",
    href: conceptHome("blue-notes"),
    scales: ["blues-scale", "minor-pentatonic"],
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what are blue notes",
      "flattened third fifth seventh",
      "bent notes blues",
    ],
  },
  {
    slug: "call-and-response",
    term: "call-and-response",
    aliases: ["call and response", "antiphony"],
    micro:
      "A back-and-forth pattern: one voice (the 'call') is answered by another voice or instrument (the 'response'). It's a core organizing principle from West African music through work songs, spirituals, and the blues.",
    definition:
      "In call-and-response, a leader sings or plays a phrase and a group — or a second instrument — answers it. The structure is a conversation, and it organizes music at every scale: a preacher and congregation, a work-gang leader and the crew, a blues singer's line and the guitar's reply between vocal phrases. It came to American music through West African performance practice and runs through the field hollers, ring shouts, and spirituals that fed the blues, and onward into gospel, jazz, and rock.",
    href: conceptHome("call-and-response"),
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is call and response",
      "call and response music",
      "antiphony",
    ],
  },
  {
    slug: "syncopation",
    term: "syncopation",
    aliases: ["off-beat accent", "off-beat", "offbeat", "syncopated"],
    micro:
      "Accenting the weak parts of a beat — the 'off-beats' — so the rhythm pushes against the steady pulse instead of sitting squarely on it. It's what makes music feel like it's leaning forward.",
    definition:
      "A steady pulse has strong beats (where you'd tap your foot) and weak ones in between. Syncopation puts the emphasis on those weak parts — the off-beats — or holds a note across a strong beat so the accent lands early or late. The pulse stays constant underneath; the melody or rhythm plays against it, creating tension and swing. It's fundamental to the feel of blues, jazz, ragtime, funk, and most African-derived music, and it's the opposite of a plain 'on-the-beat' march.",
    href: conceptHome("syncopation"),
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is syncopation",
      "off-beat accent",
      "syncopated rhythm",
    ],
  },
  {
    slug: "twelve-bar-blues",
    term: "12-bar blues",
    aliases: ["12-bar", "12 bar blues", "twelve-bar", "twelve bar", "12-bar form", "12-bar chorus"],
    micro:
      "The most common blues form: a 12-measure chord pattern built on the I, IV, and V chords that repeats for each verse. It's the harmonic loop under thousands of blues, R&B, and rock songs.",
    definition:
      "The 12-bar blues is a repeating 12-measure chord progression. In its plain form it spends four bars on the I chord, two on the IV, two back on the I, one on the V, one on the IV, and the last two turning back home (I, then V again to set up the loop). Verses are usually built as an 'AAB' lyric — a line sung, repeated, then answered — which fits neatly across the twelve bars. It became the harmonic skeleton of blues, rhythm and blues, and early rock and roll, which is why so many songs feel familiar the first time you hear them.",
    href: conceptHome("twelve-bar-blues"),
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is the 12-bar blues",
      "twelve bar blues progression",
      "I IV V blues form",
    ],
  },
  {
    slug: "shuffle",
    term: "shuffle",
    aliases: ["shuffle feel", "swing feel", "swung eighths"],
    micro:
      "A swung feel where each beat is split into a long-then-short pair (like a triplet with its middle note dropped), giving blues and swing their loping, rolling groove.",
    definition:
      "In a shuffle, the steady beats stay put but each one is divided unevenly: instead of two equal eighth notes, you get a long note followed by a short one — the same as playing the first and third notes of a triplet. That lopsided subdivision is what makes a blues 'walk' or a swing band 'roll,' as opposed to the flat, even eighths of a straight rock or pop groove. Drop the swing and play even eighths with a hard beat on 2 and 4 and you have the backbeat that rock traded the shuffle for.",
    href: conceptHome("shuffle"),
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is a shuffle rhythm",
      "shuffle feel blues",
      "swung eighth notes",
    ],
  },
  {
    slug: "race-records",
    term: "race records",
    aliases: ["race record", "race-records"],
    question: "What were race records?",
    micro:
      "The US record industry’s name, from the early 1920s into the 1940s, for 78s by Black musicians sold as a separate catalog to African American buyers — a Jim Crow marketing category, not a genre. Mamie Smith’s “Crazy Blues” (1920) is what convinced the labels the market was real.",
    definition:
      "“Race records” was the American record business’s own label for a segregated product line: blues, jazz, gospel, and popular sides by Black artists, issued in their own numbered series and advertised to Black customers — white listeners bought them too. In the Black press of the time, “the race” often meant “our people” — a self-name, not an insult — but on a record sleeve it still marked a Jim Crow shelf: Black music sold apart from the mainstream pop list. Before 1920, major labels rarely recorded Black singers for a Black audience. The runaway sales of Mamie Smith’s “Crazy Blues” on OKeh showed there was a public to sell to; OKeh, then Paramount, Columbia, and others opened dedicated series. Billboard kept a Race Records chart into the 1940s and renamed it Rhythm & Blues in 1949. The category is how a great deal of early blues, jazz, and gospel got onto disc — and why those records sat in a market of their own.",
    href: conceptHome("race-records"),
    genres: ["blues"],
    history: ["blues"],
    songs: ["crazy-blues"],
    status: "live",
    keywords: [
      "what were race records",
      "race records 1920s",
      "OKeh race series",
      "Crazy Blues Mamie Smith",
    ],
  },
  {
    slug: "interval",
    term: "interval",
    aliases: ["intervals"],
    micro:
      "The distance between two pitches, named by how many letter-names it spans and its quality — a major third, a perfect fifth. Intervals are the raw material of both melodies and chords.",
    definition:
      "An interval measures the gap between two notes. Its size is the number of letter-names it covers (C up to E is a third; C up to G is a fifth), and its quality — major, minor, perfect, augmented, diminished — fine-tunes that size by a half-step. The same two-note gap sounds the same wherever you play it, which is why musicians think in intervals rather than absolute notes: stack them and you get chords, string them in a line and you get melody.",
    href: conceptHome("interval"),
    status: "live",
    keywords: [
      "what is an interval in music",
      "musical interval",
      "interval quality",
    ],
  },
  {
    slug: "triad",
    term: "triad",
    aliases: ["triads"],
    micro:
      "A three-note chord built by stacking two thirds — a root, a third, and a fifth. Major and minor triads are the basic building blocks of harmony.",
    definition:
      "A triad is the smallest ordinary chord: take a root note, add the note a third above it, then the note a third above that (its fifth). Whether the two stacked thirds are major or minor decides the chord's flavour — a major third then a minor third gives a bright major triad; a minor third then a major third gives a darker minor triad. Nearly all chords in popular music are triads, or triads with extra notes piled on top.",
    href: conceptHome("triad"),
    status: "live",
    keywords: [
      "what is a triad",
      "major minor triad",
      "three note chord",
    ],
  },
  {
    slug: "chromatic",
    term: "chromatic",
    aliases: ["chromatically", "chromatic scale", "chromatic notes"],
    micro:
      "Moving by half-steps through notes outside the current scale. Chromatic notes step between a key's tones, adding colour and tension without belonging to the home scale.",
    definition:
      "The chromatic scale is all twelve pitches in the octave, each a half-step (semitone) apart — every key on the piano, black and white. A note is 'chromatic' when it sits outside the seven notes of the current key, used as a passing colour on the way to a scale tone rather than a member of the scale itself. The blues leans on chromatic motion: the slides and bends between the fixed 'blue' notes are the ear reaching for pitches in the cracks.",
    href: conceptHome("chromatic"),
    scales: ["blues-scale"],
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what does chromatic mean",
      "chromatic scale",
      "chromatic notes",
    ],
  },
  {
    slug: "tritone",
    term: "tritone",
    aliases: [
      "tritones",
      "flattened fifth",
      "flat fifth",
      "diminished fifth",
      "augmented fourth",
    ],
    micro:
      "The interval three whole-steps wide — exactly half an octave, and the most restless sound in Western harmony. It's the ♭5 'blue note' and the tension inside every dominant seventh chord.",
    definition:
      "A tritone spans three whole tones — six half-steps — which lands it precisely halfway across the octave. That symmetry makes it the most unstable interval in tonal music; medieval theorists nicknamed it diabolus in musica, 'the devil in music.' It's the flattened fifth the blues scale adds to the minor pentatonic, and it's the gap between the third and seventh of a dominant seventh chord — the very tension that makes such a chord lean home toward the tonic.",
    href: conceptHome("tritone"),
    scales: ["blues-scale"],
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is a tritone",
      "flat five interval",
      "diabolus in musica",
    ],
  },
  {
    slug: "mode",
    term: "mode",
    aliases: ["modes", "modal"],
    micro:
      "A scale made by treating a different note of a parent scale as home. Play only the white keys but centre everything on D and you get Dorian — same notes, new tonic, new mood.",
    definition:
      "A mode takes one parent scale and starts it from a different degree, so the same set of notes takes on a new home note and a new character. The major scale has seven modes — Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, and Locrian — each running from the next degree up. They share the same seven pitches; what changes is which note feels like 'home,' and that shift is enough to swing a scale from bright to dark.",
    href: conceptHome("mode"),
    scales: ["dorian"],
    status: "live",
    keywords: [
      "what is a musical mode",
      "modes of the major scale",
      "modal scale",
    ],
  },
  {
    slug: "dominant",
    term: "dominant",
    aliases: [
      "dominant chord",
      "dominant seventh",
      "dominant seventh chord",
      "V chord",
    ],
    micro:
      "The fifth degree of a key — and the chord built on it. Its pull back toward the home chord (the tonic) is the strongest movement in tonal harmony; a dominant seventh sharpens that pull.",
    definition:
      "In any key, the dominant is the fifth scale degree and the chord rooted there — the 'V.' It's called dominant because of how powerfully it wants to resolve down to the tonic, the key's home chord. Adding a flattened seventh makes a dominant seventh chord, whose internal tritone tightens that pull even further. The blues turns this on its head by making every chord — I, IV and V — a dominant seventh, part of why it carries its restless, unresolved colour.",
    href: conceptHome("dominant"),
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is the dominant chord",
      "dominant seventh",
      "V chord function",
    ],
  },
  {
    slug: "i-iv-v",
    term: "I–IV–V",
    aliases: [
      "I-IV-V",
      "I IV V",
      "I, IV and V",
      "I, IV, and V",
      "primary chords",
      "three-chord",
    ],
    micro:
      "The three primary chords of a key — built on its first, fourth, and fifth notes. Almost every blues, folk tune, and early rock song lives inside these three chords.",
    definition:
      "Number the chords of a scale with Roman numerals and the ones built on the first, fourth, and fifth degrees — I, IV and V — are the primary chords, the strongest and most closely related in the key. Together they can harmonise a huge share of Western melody, which is why 'three chords' is shorthand for a whole tradition of folk, country, blues, and early rock. The 12-bar blues is made of nothing but I, IV and V.",
    href: conceptHome("i-iv-v"),
    genres: ["blues", "rock"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is I IV V",
      "primary chords",
      "three chord song",
      "I IV V progression",
    ],
  },
  {
    slug: "cadence",
    term: "cadence",
    aliases: ["cadences", "turnaround"],
    micro:
      "A chord progression that closes a musical phrase — harmony's punctuation. Some cadences sound final, coming to rest on the home chord; others leave you hanging, wanting more.",
    definition:
      "A cadence is the pair or short run of chords that ends a phrase, the way a comma or full stop ends a clause. An authentic cadence (V–I) lands on the tonic and sounds conclusive; a half cadence stops on the dominant and feels unfinished, pulling you onward. In a 12-bar blues the last two bars are a turnaround — a cadence that refuses to fully settle, tipping you back to the top for the next chorus.",
    href: conceptHome("cadence"),
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is a cadence in music",
      "authentic cadence",
      "musical turnaround",
    ],
  },
  {
    slug: "backbeat",
    term: "backbeat",
    aliases: ["backbeats", "back-beat"],
    micro:
      "A hard accent on beats 2 and 4 — usually a snare-drum crack — over a steady pulse. It's the engine of rock, R&B, and pop, and what rock traded the blues shuffle for.",
    definition:
      "In 4/4 time the ear expects weight on beats 1 and 3; the backbeat defies that by slamming the accent onto the weak beats, 2 and 4, almost always with a snare drum. That relentless off-square crack is the heartbeat of rock and roll, rhythm and blues, and most pop. Where the blues loped along on a swung shuffle, rock straightened the eighth notes and drove them with the backbeat.",
    href: conceptHome("backbeat"),
    genres: ["rock"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is a backbeat",
      "snare on 2 and 4",
      "backbeat rhythm",
    ],
  },
  {
    slug: "freygish",
    term: "freygish",
    aliases: ["Ahava Rabbah", "Phrygian dominant", "freygish mode", "Ahavah Rabbah"],
    micro:
      "The signature klezmer mode — Yiddish for 'Phrygian': a scale with a flattened second but a major third, leaving a dramatic augmented-second leap between them. Hebrew prayer calls it Ahava Rabbah; Western theory, Phrygian dominant.",
    // Delegated: the scale page is the real, playable home.
    href: "/scales/freygish",
    scales: ["freygish"],
    genres: ["klezmer"],
    history: ["klezmer"],
    status: "live",
  },
  {
    slug: "augmented-second",
    term: "augmented second",
    aliases: ["augmented seconds", "augmented 2nd"],
    micro:
      "An interval of three half-steps spelled as a second — like F up to G♯. Wider than any step a major scale allows, it gives the scales that contain it (harmonic minor, freygish) their dramatic, 'Eastern' colour.",
    definition:
      "An augmented second is a major second widened by a half-step: three semitones between two neighbouring letter names, such as F to G♯. It sounds the same as a minor third in equal temperament, but it behaves differently — it's a *step* in a scale, not a leap between chord tones, and Western classical voice-leading treated it as an error to be smoothed away. Scales that keep it are exactly the ones that sound 'exotic' to major-scale ears: the harmonic minor (between its sixth and raised seventh) and the freygish / Phrygian dominant mode of klezmer, flamenco, and Middle Eastern music (between its flattened second and major third).",
    href: conceptHome("augmented-second"),
    scales: ["freygish"],
    history: ["klezmer"],
    status: "live",
    keywords: [
      "what is an augmented second",
      "augmented second interval",
      "harmonic minor augmented second",
    ],
  },
  {
    slug: "doina",
    term: "doina",
    aliases: ["doyna", "doinas"],
    micro:
      "A free-time improvised lament of Romanian origin, adopted by klezmer as its great solo showpiece: the band holds a drone, the beat stops, and a violin or clarinet pours out ornamented phrases like a voice in prayer.",
    definition:
      "The doina came into klezmer from Romanian and Moldavian folk practice, where it was a shepherd's improvised lament. In the klezmer version the pulse simply stops: over a held drone or slow-rolled chords, a solo instrument — violin in the older bands, clarinet in the American era — improvises long, sobbing, richly ornamented phrases whose rhythm follows breath and feeling rather than a beat. Its vocal, cantorial quality made it a klezmer signature, and its traditional exit is part of the drama: the doina resolves into a fast dance tune, and the room snaps from weeping to dancing in a single bar.",
    href: conceptHome("doina"),
    genres: ["klezmer"],
    history: ["klezmer"],
    status: "live",
    keywords: [
      "what is a doina",
      "klezmer doina",
      "romanian doina lament",
    ],
  },
  {
    slug: "krechtz",
    term: "krechtz",
    aliases: ["krekhts", "krechts", "krekhtsn", "krekhtz"],
    micro:
      "Yiddish for 'sob' or 'groan' — the little cracking catch a klezmer clarinet or violin puts on the tail of a note, imitating a voice breaking. It's much of why klezmer seems to weep and laugh at once.",
    definition:
      "The krechtz (plural krekhtsn) is the most famous of the klezmer ornaments: a short, throaty break added to the end of a sustained note — on the violin a ghostly touched harmonic, on the clarinet a swallowed hiccup up to a higher partial — that makes the instrument 'sob' the way a cantor's voice cracks on a word of prayer. Together with slides, bent pitches, and trills, it's part of a whole vocabulary of vocal imitation: klezmer treats the instrument as a voice davening, which is why the same tune played straight from the page stops sounding like klezmer at all.",
    href: conceptHome("krechtz"),
    genres: ["klezmer"],
    history: ["klezmer"],
    status: "live",
    keywords: [
      "what is a krechtz",
      "what is a krekhts",
      "klezmer ornament sob",
      "klezmer clarinet crying sound",
    ],
  },
  {
    slug: "steps",
    term: "steps",
    aliases: [
      "step",
      "half step",
      "half steps",
      "half-step",
      "half-steps",
      "whole step",
      "whole steps",
      "whole-step",
      "whole-steps",
      "semitone",
      "semitones",
      "whole tone",
      "whole tones",
    ],
    question: "What are half steps and whole steps?",
    micro:
      "The two smallest distances between notes. A half step is the jump to the very next key — piano or fret; a whole step is two of those, skipping the key in between. Scales are just patterns of these.",
    definition:
      "A half step (or semitone) is the smallest move in Western music: from any key to the one immediately beside it, black or white. A whole step (or whole tone) is two half steps stacked, so you skip the key in between. Every scale is a recipe written in these two distances — the major scale, for instance, runs whole–whole–half–whole–whole–whole–half. The catch is on the white keys: most neighbours are a whole step apart, but E–F and B–C are half steps with no black key between them, which is exactly why the piano is laid out the way it is.",
    href: conceptHome("steps"),
    scales: ["major-scale", "blues-scale", "minor-pentatonic"],
    genres: ["blues"],
    history: ["blues"],
    status: "live",
    keywords: [
      "what is a half step",
      "what is a whole step",
      "half step vs whole step",
      "semitone whole tone",
    ],
  },
];

export function getConcept(slug: string): Concept | undefined {
  const exact = CONCEPTS.find((c) => c.slug === slug);
  if (exact) return exact;
  const needle = slug.toLowerCase();
  return CONCEPTS.find((c) =>
    c.aliases?.some((alias) => alias.toLowerCase() === needle),
  );
}

/** The page/FAQ question for a concept — its own `question`, or a default. */
export function conceptQuestion(concept: Concept): string {
  return concept.question ?? `What is ${concept.term}?`;
}

/** Concepts that own a `/concepts/<slug>` page (not delegated elsewhere). */
export const GLOSSARY_CONCEPTS = CONCEPTS.filter(
  (c) => c.href === conceptHome(c.slug),
);

/** Glossary-owned concepts safe to index, for the sitemap + static params. */
export const LIVE_CONCEPTS = GLOSSARY_CONCEPTS.filter(
  (c) => c.status === "live",
);
