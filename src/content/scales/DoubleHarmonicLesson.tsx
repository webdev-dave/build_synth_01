/**
 * Double harmonic — freygish with its seventh raised too.
 *
 * The page is about a scale with *two* augmented seconds where most have
 * none, and about the label it is sold under: "the Arabic scale" is a
 * Western nickname for a pattern that Arabic music (Hijaz Kar), Turkish
 * music (Hicazkâr), and Hindustani music (Bhairav) each name and tune their
 * own way. Comparer: freygish → double harmonic (swap, the 7th). Then the
 * two leaps, the palindrome, and an honest paragraph on intonation.
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

// E — the root the freygish page opens on, so "raise the seventh" is a
// key-for-key hand-off: E freygish's D becomes D♯.
const DEFAULT_ROOT_PC = 4;

const DOUBLE_HARMONIC = degreesOf("doubleHarmonic");
const FREYGISH = degreesOf("phrygianDominant");
const DOUBLE_HARMONIC_OFFSETS = DOUBLE_HARMONIC.map((d) => d.offset);

const FLAT_SECOND = 1;
const MAJOR_THIRD = 4;
const FLAT_SIXTH = 8;
const FLAT_SEVENTH = 10;
const MAJOR_SEVENTH = 11;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 1, label: "♭2", role: "lowered second — one key above home" },
  { offset: 4, label: "3", role: "major third — three keys above the ♭2" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 8, label: "♭6", role: "lowered sixth" },
  { offset: 11, label: "7", role: "raised seventh — three keys above the ♭6" },
];

const SOURCES = [
  {
    label:
      "Scott Marcus, “The Interface between Theory and Practice: Intonation in Arab Music,” Asian Music 24/2 (1993) — augmented seconds and the notes that move in performance",
    url: "https://doi.org/10.2307/834466",
  },
  {
    label:
      "Maqam World — Jins Hijaz: the tetrachord this scale stacks twice, and the note that its leap is “usually played smaller than notated”",
    url: "https://maqamworld.com/en/jins/hijaz.php",
  },
];

export function DoubleHarmonicLesson() {
  return (
    <ScaleLessonProvider
      defaultRootPc={DEFAULT_ROOT_PC}
      degrees={DOUBLE_HARMONIC}
    >
      <section className="mt-8" aria-label="Double harmonic lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> double harmonic. Keys
          with a green number are in the <Term id="scale">scale</Term> and play;
          keys with a red dot stay silent. Press <Mono>Play</Mono>. If a film
          wanted you to know a scene was set somewhere &ldquo;east,&rdquo; this
          is the scale it reached for — and the reason is audible in the first
          three notes: a cramped half step, then a leap wide enough to feel like
          a jump.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={DOUBLE_HARMONIC_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={DOUBLE_HARMONIC} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">
          2. Counting from home: two flats around a major third
        </H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>. Count keys to the right,
          black and white alike; each key is one{" "}
          <Term id="steps">half step</Term>. The plain numbers 1 to 7 belong to
          the <LessonLink href="/scales/major-scale">major scale</LessonLink>; a{" "}
          <Term id="flats-and-sharps">flat</Term> (<Mono>♭</Mono>) means
          &ldquo;that note, one key lower.&rdquo;
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={MAJOR_SEVENTH} />
        <P>
          Two flats, and they sit in odd company: a <Mono>♭2</Mono> next to a
          plain <Mono>3</Mono>, and a <Mono>♭6</Mono> next to a plain{" "}
          <Mono>7</Mono>. Each pair is three keys apart. Click a chip to hear
          each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={DOUBLE_HARMONIC}
          spotlightOffset={MAJOR_SEVENTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="raise-the-seventh">
          3. Move one key: freygish becomes double harmonic
        </H2>
        <P>
          Start from <LessonLink href="/scales/freygish">freygish</LessonLink> —
          the klezmer and flamenco scale, also called Phrygian dominant — in{" "}
          <RootName />. It already has the <Mono>♭2</Mono>-to-<Mono>3</Mono>{" "}
          leap. Now raise its <Mono>♭7</Mono>,{" "}
          <NoteAt offset={FLAT_SEVENTH} degrees={FREYGISH} />, one key to{" "}
          <NoteAt offset={MAJOR_SEVENTH} />. Flip the toggle and play both.
          Freygish ends its climb with a relaxed whole step; double harmonic
          ends with a second leap and a leading tone that snaps shut onto home.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "phrygianDominant", name: "Freygish", degrees: FREYGISH }}
          b={{
            id: "doubleHarmonic",
            name: "Double harmonic",
            degrees: DOUBLE_HARMONIC,
            spotlightOffset: MAJOR_SEVENTH,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="two-leaps">4. Two augmented seconds</H2>
        <P>
          A step of three keys between two <em>neighbouring</em> scale degrees
          is an <Term id="augmented-second">augmented second</Term>. Most scales
          have none; the{" "}
          <LessonLink href="/scales/harmonic-minor">harmonic minor</LessonLink>{" "}
          and freygish each have one, and it is the most recognisable thing
          about them. Double harmonic has two, in the same place in each half of
          the scale: <Mono>♭2 → 3</Mono> low down and <Mono>♭6 → 7</Mono> up
          top. Press each; they are the same shape a fifth apart.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear ♭2 → 3"
              offsets={[FLAT_SECOND, MAJOR_THIRD]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Hear ♭6 → 7"
              offsets={[FLAT_SIXTH, MAJOR_SEVENTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          That repetition is why the scale is built the way it is. The four-note
          cell <Mono>1 ♭2 3 4</Mono> — half step, leap, half step — is what
          Arabic theory calls{" "}
          <Word id="jins">
            <em>jins</em>
          </Word>{" "}
          <Word id="hijaz">Hijaz</Word>; stack it on the root and
          again on the fifth and you have this scale, which is why Arabic music
          calls it{" "}
          <Word id="hijaz-kar">
            <em>Hijaz Kar</em>
          </Word>
          : Hijaz, doubled.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="palindrome">5. It reads the same backwards</H2>
        <P>
          Write the steps out in half steps and you get{" "}
          <Mono>1 – 3 – 1 – 2 – 1 – 3 – 1</Mono>: a palindrome. Play the run up
          and then down and the pattern of small and large steps is the same in
          both directions — the only scale on this site with that property. It
          is part of why the scale sounds so closed and ornamental: it has no
          lopsided side.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Play up and down"
              offsets={DOUBLE_HARMONIC_OFFSETS}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-name">6. About the name &ldquo;Arabic scale&rdquo;</H2>
        <P>
          Guitar books call this the Arabic scale, or the Byzantine scale, or —
          in older books — the Gypsy major. None of those is what the musicians
          who actually use the pattern call it. In Arabic music it is{" "}
          <Word id="maqam">maqam</Word> Hijaz Kar; in Turkish music,{" "}
          <Word id="hicazkar">
            <em>Hicazkâr</em>
          </Word>
          ; in North
          Indian music the same seven notes are{" "}
          <Word id="bhairav">
            <em>Bhairav</em>
          </Word>
          , the morning
          raga and one of the ten parent scales. Those names are listed under
          this page&rsquo;s title, and searching any of them brings you here.
        </P>
        <P>
          One honest caveat. Twelve equal keys are a Western convenience. In
          Arabic practice the Hijaz leap is usually played <em>smaller</em> than
          written — the <Mono>♭2</Mono> a little higher, the <Mono>3</Mono> a
          little lower — and the same goes for the upper leap, so what this
          keyboard plays is the shape of Hijaz Kar in a tuning that is close but
          not the same. The augmented second is one of the intervals players are
          known to adjust by ear. The{" "}
          <LessonLink href="/scales/rast">Rast</LessonLink> page shows what it
          takes to bend a piano toward those pitches.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and hold the root. The two leaps are the whole
          colour, so lean on them: <Mono>♭2 → 3</Mono> and{" "}
          <Mono>♭6 → 7 → 1</Mono> as phrase shapes, <Mono>♭2 → 1</Mono> to
          close. If it starts to sound like a cartoon, slow down and let the{" "}
          <Mono>♭2</Mono> sit — the scale is dramatic; it does not need help.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play double harmonic"
              offsets={DOUBLE_HARMONIC_OFFSETS}
            />
          </LessonToolbar>
        </div>

        <Sources items={SOURCES} />
      </section>
    </ScaleLessonProvider>
  );
}
