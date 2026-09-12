/**
 * Locrian, taught honestly: the mode whose home chord cannot hold.
 *
 * One note past Phrygian — the ♭5 — and the triad on the root turns
 * diminished, so the scale has no stable place to rest. The page shows the
 * swap (Phrygian → Locrian), lets the reader hear the minor chord collapse
 * into the diminished one, re-homes B Locrian as C major, and is candid
 * about how the mode is actually used: as a colour and a chord scale more
 * than as a key.
 *
 * Server component: prose ships as static HTML; widgets are client leaves.
 */
import { Term } from "@/components/concepts/Term";
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
  type DegreeRow,
} from "@/components/scales/lessonPrimitives";
import { degreesOf } from "@/lib/music/scaleCatalog";

// B is the classroom key: B Locrian is all white keys (C major from B).
const DEFAULT_ROOT_PC = 11;

const LOCRIAN = degreesOf("locrian");
const PHRYGIAN = degreesOf("phrygian");
const MAJOR = degreesOf("major");
const LOCRIAN_OFFSETS = LOCRIAN.map((d) => d.offset);

const FLAT_THIRD = 3;
const FLAT_FIFTH = 6;
const FIFTH = 7;
/** C major's root sits one half step above B. */
const PARENT_MAJOR_OFFSET = 1;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home, such as it is" },
  { offset: 1, label: "♭2", role: "lowered second — one key above home" },
  { offset: 3, label: "♭3", role: "lowered third — minor" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 6, label: "♭5", role: "lowered fifth — the changed note" },
  { offset: 8, label: "♭6", role: "lowered sixth" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

export function LocrianLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={LOCRIAN}>
      <section className="mt-8" aria-label="Locrian lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> Locrian. Keys with a
          green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono>. It opens with the
          same cramped half step as{" "}
          <LessonLink href="/scales/phrygian">Phrygian</LessonLink>, and then
          the fifth — the one note every other scale on this site leaves alone —
          comes out wrong. The run ends on the root, but the root does not feel
          like arriving. That is not a flaw in your ear. It is the mode.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={LOCRIAN_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={LOCRIAN} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: five flats</H2>
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
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={FLAT_FIFTH} />
        <P>
          Five flats — every note that can be lowered, is. Only the{" "}
          <Mono>1</Mono> and <Mono>4</Mono> stand where the major scale put
          them. The <Mono>♭5</Mono> is the one no other mode of the major scale
          touches. Click a chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={LOCRIAN}
          spotlightOffset={FLAT_FIFTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="lower-the-fifth">3. Move one key: Phrygian becomes Locrian</H2>
        <P>
          Take <LessonLink href="/scales/phrygian">Phrygian</LessonLink> in{" "}
          <RootName /> and lower its <Mono>5</Mono> —{" "}
          <NoteAt offset={FIFTH} degrees={PHRYGIAN} /> — one key to{" "}
          <NoteAt offset={FLAT_FIFTH} />. Nothing else changes. Flip the toggle
          and watch one key go dark while its lower neighbour lights. Phrygian
          is dark but it stands up; the fifth holds it. Locrian takes the fifth
          away.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "phrygian", name: "Phrygian", degrees: PHRYGIAN }}
          b={{
            id: "locrian",
            name: "Locrian",
            degrees: LOCRIAN,
            spotlightOffset: FLAT_FIFTH,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="diminished">
          4. Why it cannot rest: the home chord is diminished
        </H2>
        <P>
          Build a chord on the root of any scale from its <Mono>1</Mono>,{" "}
          <Mono>3</Mono>, and <Mono>5</Mono> — a <Term id="triad">triad</Term>.
          In every other mode of the major scale that chord is major or minor,
          and the fifth on top makes it solid: root and fifth are the two notes
          a power chord is made of. Locrian&rsquo;s home triad is{" "}
          <Mono>1 ♭3 ♭5</Mono>. Its outer notes are six half steps apart — a{" "}
          <Term id="tritone">tritone</Term> — and the chord is{" "}
          <em>diminished</em>. Press the two chords in turn: the first settles,
          the second asks a question and waits.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Minor chord: 1 ♭3 5"
              offsets={[0, FLAT_THIRD, FIFTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Diminished chord: 1 ♭3 ♭5"
              offsets={[0, FLAT_THIRD, FLAT_FIFTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          A scale whose home chord wants to move somewhere else has no stable
          centre, and that is why Locrian is rare as a <em>key</em>. Whole
          pieces in it are unusual; you meet it instead as a colour — a metal
          riff that leans on the <Mono>♭2</Mono> and <Mono>♭5</Mono> against a
          low root, a bar of tension before a resolution — and, in jazz, as the
          set of notes that fits a half-diminished chord. That last use is why
          its other name is the <em>half-diminished scale</em>.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">
          5. Same keys, different home: a major scale from its seventh
        </H2>
        <P>
          Now the map view. Take the seven keys of <RootName /> Locrian and,
          without turning any on or off, call the <Mono>♭2</Mono> home instead.
          You are now playing the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> on{" "}
          <NoteAt offset={PARENT_MAJOR_OFFSET} />. In <Mono>B</Mono> that is{" "}
          <Mono>C</Mono> major: the same white keys, settling one key higher.
          Flip the toggle and only the green <Mono>1</Mono> moves — and the
          whole scale suddenly sounds stable, because the note it now rests on
          has a real fifth above it.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "locrian", name: "Locrian", degrees: LOCRIAN }}
          b={{
            id: "major",
            name: "Major",
            degrees: MAJOR,
            rootOffset: PARENT_MAJOR_OFFSET,
          }}
        />
        <P>
          Locrian is the seventh and last <Term id="mode">mode</Term> of the
          major scale — the major scale started from its seventh degree, the
          leading tone. Every note in it is pulled toward the C a half step up,
          which is another way of saying why B never quite feels like home.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">6. What to do with it</H2>
        <P>
          Keep the lock on and hold a low root while you play above it. Do not
          look for a resting note — use the instability. Lean on{" "}
          <Mono>♭2 → 1</Mono> and <Mono>♭5 → 4</Mono> as the two falling steps;
          let the <Mono>♭5</Mono> ring against the root when you want the sound
          of something unresolved. Then flip any comparer above back to its
          other side and notice how much relief one key can bring.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton label="Play Locrian" offsets={LOCRIAN_OFFSETS} />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
