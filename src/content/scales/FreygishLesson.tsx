/**
 * Freygish (Ahava Rabbah / Phrygian dominant / Hijaz), taught from zero.
 *
 * This is the page for "the Middle Eastern sound" on a piano: the ♭2 next
 * to a major 3rd, and the augmented-second leap between them. It stands on
 * its own — degree vocabulary is introduced inline and links to the glossary
 * — and it teaches by two comparisons the comparer can play: Phrygian →
 * freygish (raise one key) and harmonic minor → freygish (same keys, new
 * home). It is honest about what a 12-key octave cannot show.
 *
 * Server component: prose ships as static HTML; widgets are client leaves.
 */
import { Term } from "@/components/concepts/Term";
import { Word } from "@/components/words/Word";
import { ScaleLessonProvider } from "@/components/scales/ScaleLessonProvider";
import { LessonToolbar } from "@/components/scales/LessonToolbar";
import { ScaleKeyboard } from "@/components/scales/ScaleKeyboard";
import { DegreeStrip } from "@/components/scales/DegreeStrip";
import { PlayPatternButton } from "@/components/scales/PlayPatternButton";
import { ScaleComparer } from "@/components/scales/ScaleComparer";
import { RootName, NoteAt } from "@/components/scales/LessonInline";
import {
  DegreeTable,
  H2,
  LessonIntro,
  LessonLink,
  Mono,
  P,
  Sources,
  type DegreeRow,
} from "@/components/scales/lessonPrimitives";
import { degreesOf } from "@/lib/music/scaleCatalog";

// E is the classroom key: E freygish is all white keys plus one G♯, so the
// note that makes it freygish is the one black key on the keyboard.
const DEFAULT_ROOT_PC = 4;

const FREYGISH = degreesOf("phrygianDominant");
const PHRYGIAN = degreesOf("phrygian");
const HARMONIC = degreesOf("harmonicMinor");
const UKRAINIAN = degreesOf("ukrainianDorian");

const FREYGISH_OFFSETS = FREYGISH.map((d) => d.offset);

/** The major third — the one key that separates freygish from Phrygian. */
const MAJOR_THIRD = 4;
const FLAT_SECOND = 1;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 1, label: "♭2", role: "lowered second — one key above home" },
  { offset: 4, label: "3", role: "major third — the surprise" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 8, label: "♭6", role: "lowered sixth" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

const SOURCES = [
  {
    label:
      "Yonatan Malin et al., “Modes in Klezmer Music,” Music Theory Online 31.3 (2025) — “freygish” from “Phrygian”; the four klezmer modes; melodies dipping below the tonic; comparison with makam hicâz",
    url: "https://www.mtosmt.org/issues/mto.25.31.3/mto.25.31.3.malin.html",
  },
  {
    label:
      "Josh Horowitz, “The Main Klezmer Modes” (KlezmerShack) — Ahava Rabboh; Mi Sheberakh begun on its second degree gives the same pitches",
    url: "https://www.klezmershack.com/articles/horowitz/horowitz.klezmodes.html",
  },
  {
    label:
      "Scott Marcus, “The Interface between Theory and Practice: Intonation in Arab Music,” Asian Music 24.2 (1993) — the “shrunken” augmented second in Hijaz",
    url: "https://doi.org/10.2307/834466",
  },
  {
    label: "Wikipedia, “Jins” — Hijaz and the equal-tempered “Piano Hijaz”",
    url: "https://en.wikipedia.org/wiki/Ajnas",
  },
];

export function FreygishLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={FREYGISH}>
      <section className="mt-8" aria-label="Freygish lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> freygish. Keys with a
          green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono>. If you have heard
          klezmer, flamenco, or almost any film score that wants to say
          &ldquo;somewhere east of here,&rdquo; you know this run already — the
          lift at the second note, the wide stretch right after it.
        </P>
        <P>
          One scale, several names. Klezmer musicians say{" "}
          <Term id="freygish">freygish</Term>, a Yiddish take on
          &ldquo;Phrygian.&rdquo; Cantors say{" "}
          <Word id="ahava-rabbah">Ahava Rabbah</Word>, after the prayer whose
          chant uses it. Western theory says <em>Phrygian dominant</em>. Arabic
          and Turkish musicians hear their <Word id="maqam">maqam</Word>{" "}
          <Word id="hijaz">
            <em>Hijaz</em>
          </Word>{" "}
          in it — with a
          caveat this page comes back to. Same seven keys, four homes.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={FREYGISH_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={FREYGISH} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: what the numbers mean</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>. Count keys to the right,
          black and white alike; each key is one{" "}
          <Term id="steps">half step</Term>. The plain numbers 1 to 7 belong to
          the major scale, the do-re-mi scale everything is measured against. A{" "}
          <Term id="flats-and-sharps">flat</Term> (<Mono>♭</Mono>) in front of a
          number means &ldquo;that note, one key lower.&rdquo;
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={MAJOR_THIRD} />
        <P>
          Read the table top to bottom and one line stands out. The second,
          sixth, and seventh are all lowered — that is a dark, minor-leaning
          shape — and then the third is <em>not</em>. A plain <Mono>3</Mono>,
          the bright major third, sitting in the middle of all those flats. That
          contradiction is the whole scale. Click the chips to hear each degree
          in <RootName />.
        </P>
        <DegreeStrip
          degrees={FREYGISH}
          spotlightOffset={MAJOR_THIRD}
          className="mt-4"
        />
        <P>
          A spelling note: this page writes the scale one letter per degree, so
          the third reads <NoteAt offset={MAJOR_THIRD} /> even though the
          keyboard labels that key with a sharp or the same key could be called
          by a flat name. One key, two names — nothing is out of tune.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="flat-two">3. The ♭2: a note that leans on home</H2>
        <P>
          Start with the second degree. In the major scale it is two keys above
          the root; here it is one — <NoteAt offset={FLAT_SECOND} />, the very
          next key up from <RootName />. A note that close to home cannot sit
          still. Play it and hold it and your ear is already pulling it back
          down. Press <Mono>Hear ♭2 fall</Mono>: that little sigh downward is in
          nearly every klezmer phrase ending.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear ♭2 fall to 1"
              offsets={[FLAT_SECOND, 0]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          The ♭2 on its own is not yet freygish. There is a plain Western{" "}
          <Term id="mode">mode</Term> with the same lowered second and
          everything else minor: <strong>Phrygian</strong>,{" "}
          <Mono>1 ♭2 ♭3 4 5 ♭6 ♭7</Mono>. It is dark and tense, and the
          harmonica lab calls its fifth position &ldquo;Spanish / Middle
          Eastern.&rdquo; It is close. It is not the sound.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="raise-the-third">
          4. Raise one key: Phrygian becomes freygish
        </H2>
        <P>
          Take Phrygian and move exactly one note: the lowered third goes up one
          key to a major third. In <RootName /> that is{" "}
          <NoteAt offset={3} degrees={PHRYGIAN} /> becoming{" "}
          <NoteAt offset={MAJOR_THIRD} />. Everything else stays. Flip the
          toggle and watch one key go dark while its neighbour lights; play both
          and listen to the second step of the run. Phrygian walks up gently.
          Freygish stretches.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "phrygian", name: "Phrygian", degrees: PHRYGIAN }}
          b={{
            id: "freygish",
            name: "Freygish",
            degrees: FREYGISH,
            spotlightOffset: MAJOR_THIRD,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="augmented-second">5. The stretch: an augmented second</H2>
        <P>
          Here is why that one key changes everything. From <Mono>♭2</Mono> (
          <NoteAt offset={FLAT_SECOND} />) to <Mono>3</Mono> (
          <NoteAt offset={MAJOR_THIRD} />) is now three half steps. No step in
          the major scale is wider than two. Because it still runs from one
          degree to the very next, it counts as a <em>second</em> — a widened
          one, an <Term id="augmented-second">augmented second</Term>. On the
          keys it covers the same distance as a minor third, but it behaves like
          a step: melodies walk across it rather than leaping over it.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear 1 → ♭2 → 3"
              offsets={[0, FLAT_SECOND, MAJOR_THIRD]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          A half step followed at once by a step-and-a-half: cramped, then wide.
          That pairing is the interval most ears file as &ldquo;the Jewish
          scale&rdquo; or &ldquo;the Arabic scale.&rdquo; It is neither alone.
          The same two keys sit at the heart of the Ottoman, Balkan, Greek,
          Romanian, and Andalusian musics that klezmer grew up beside, and the
          sound crossed between them for centuries. What is distinctive is not
          owning the interval; it is what each tradition does around it.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">
          6. Same keys, different home: harmonic minor and Mi Sheberakh
        </H2>
        <P>
          Now the map view. Take the seven keys of <RootName /> freygish and,
          without turning any on or off, call the <Mono>4</Mono> home instead.
          You are now playing{" "}
          <LessonLink href="/scales/harmonic-minor">harmonic minor</LessonLink>{" "}
          — natural minor with a raised seventh — starting on{" "}
          <NoteAt offset={5} />. The augmented second is the same two keys; in
          that scale it sits between <Mono>♭6</Mono> and <Mono>7</Mono>. Flip
          the toggle: only the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "freygish", name: "Freygish", degrees: FREYGISH }}
          b={{
            id: "harmonic",
            name: "Harmonic minor",
            degrees: HARMONIC,
            rootOffset: 5,
          }}
        />
        <P>
          Do it once more with the <Mono>♭7</Mono> (<NoteAt offset={10} />) as
          home and you get klezmer&rsquo;s other great mode,{" "}
          <LessonLink href="/scales/ukrainian-dorian">
            Ukrainian Dorian
          </LessonLink>{" "}
          — <Word id="misheberakh">Mi Sheberakh</Word>, the mode of the{" "}
          <Term id="doina">doina</Term>. Start Mi Sheberakh on its own second
          degree and you are back in freygish; the two modes lean on each other
          constantly in real tunes.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "freygish", name: "Freygish", degrees: FREYGISH }}
          b={{
            id: "ukrainian",
            name: "Ukrainian Dorian",
            degrees: UKRAINIAN,
            rootOffset: 10,
          }}
        />
        <P>
          Western theory files all three as one family — freygish is the fifth{" "}
          <Term id="mode">mode</Term> of harmonic minor, Ukrainian Dorian the
          fourth. That is true of the notes and useful on a keyboard. Klezmer
          players do not think of freygish as derived from anything. It is a
          mode in its own right, learned from prayer and from other players.
          Among the freylekhs — the most common dance in Moshe
          Beregovski&rsquo;s klezmer collection — about one tune in four is in
          freygish, second only to plain minor.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="what-the-keys-miss">7. What twelve keys cannot show</H2>
        <P>
          Two honest limits. First, real freygish melodies do not stay inside
          the octave above the root. They dip <em>below</em> it — to the{" "}
          <Mono>♭7</Mono> underneath and often to a natural sixth there, a note
          the scale above the root does not have. The lock on this page keeps
          you to seven keys per octave so the shape is clear; a clarinetist
          would not be so tidy. Unlock the keyboard and try approaching{" "}
          <RootName /> from two keys below.
        </P>
        <P>
          Second, the maqam. Arabic and Turkish <em>Hijaz</em> is built on the
          same shape — half step, augmented second, half step — but it is not a
          fixed set of twelve keys. Performers pull the <Mono>♭2</Mono> a little
          high and the <Mono>3</Mono> a little low, narrowing the stretch into
          something no piano key can reach. What this page plays is the
          piano&rsquo;s honest approximation of Hijaz, the same way the blues
          scale freezes a bent note onto the nearest key. On a voice, an{" "}
          <Word id="oud">oud</Word>, or
          a clarinet, the interval lives between the keys — and klezmer&rsquo;s
          sobbing <Term id="krechtz">krechtz</Term> is one way of getting there.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">8. What to do with it</H2>
        <P>
          Keep the lock on and play the green keys in any order. End phrases on{" "}
          <Mono>1</Mono>, and try arriving from <Mono>♭2</Mono> above rather
          than from below — that downward sigh is the signature. Walk{" "}
          <Mono>♭2 → 3</Mono> slowly until the wide step stops sounding like a
          mistake. Then go to{" "}
          <LessonLink href="/genres/klezmer">What is klezmer?</LessonLink> for
          the dances and ornaments the scale lives in, and{" "}
          <LessonLink href="/history/klezmer">
            Where did klezmer come from?
          </LessonLink>{" "}
          for how a synagogue mode became wedding music.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play freygish"
              offsets={FREYGISH_OFFSETS}
            />
          </LessonToolbar>
        </div>

        <Sources items={SOURCES} />
      </section>
    </ScaleLessonProvider>
  );
}
