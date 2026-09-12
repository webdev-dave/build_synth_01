/**
 * Major blues — the sunny twin of the blues scale.
 *
 * The blues page adds a ♭5 to the minor pentatonic; this page adds a ♭3 to
 * the major pentatonic. Same move, other family. Comparers: major
 * pentatonic → major blues (added note), then the twin relationship — C
 * major blues re-homed as A minor blues, the six keys the blues page opens
 * on.
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

// C: its twin, A minor blues, is the key the blues-scale page opens on, so
// the two pages share every key.
const DEFAULT_ROOT_PC = 0;

const MAJOR_BLUES = degreesOf("majorBlues");
const MAJOR_PENTATONIC = degreesOf("pentatonicMajor");
const MINOR_BLUES = degreesOf("blues");
const MAJOR_BLUES_OFFSETS = MAJOR_BLUES.map((d) => d.offset);

const SECOND = 2;
const FLAT_THIRD = 3;
const MAJOR_THIRD = 4;
/** A minor blues' root sits a major sixth above C. */
const TWIN_OFFSET = 9;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 3, label: "♭3", role: "lowered third — the blue note" },
  { offset: 4, label: "3", role: "major third — right next to it" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "sixth" },
];

export function MajorBluesLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={MAJOR_BLUES}>
      <section className="mt-8" aria-label="Major blues lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> major blues. Keys with a
          green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono>. It is bright —
          the sound of a country guitar intro, a gospel piano turnaround, a
          swing-era horn lick — with one smudge in the middle where two keys sit
          side by side. That smudge is the whole scale.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={MAJOR_BLUES_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={MAJOR_BLUES} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: two thirds</H2>
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
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={FLAT_THIRD} />
        <P>
          Six notes, and two of them are thirds: a <Mono>♭3</Mono> and a{" "}
          <Mono>3</Mono>, one key apart. No ordinary scale does that — a scale
          is supposed to pick <em>one</em> third and be major or minor about it.
          The blues does not pick. Click a chip to hear each degree in{" "}
          <RootName />.
        </P>
        <DegreeStrip
          degrees={MAJOR_BLUES}
          spotlightOffset={FLAT_THIRD}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="add-one-key">
          3. Add one key: major pentatonic becomes major blues
        </H2>
        <P>
          Start from the{" "}
          <LessonLink href="/scales/major-pentatonic">
            major pentatonic
          </LessonLink>{" "}
          in <RootName /> — <Mono>1 2 3 5 6</Mono>, five notes, no half steps.
          Now squeeze in one extra key, <NoteAt offset={FLAT_THIRD} />, just
          below the third. Flip the toggle and watch it light. Play both runs:
          the pentatonic walks up clean; the blues scale stumbles for one step,
          on purpose.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "pentatonicMajor",
            name: "Major pentatonic",
            degrees: MAJOR_PENTATONIC,
          }}
          b={{
            id: "majorBlues",
            name: "Major blues",
            degrees: MAJOR_BLUES,
            spotlightOffset: FLAT_THIRD,
          }}
          defaultSide="b"
        />
        <P>
          The <Mono>♭3</Mono> is this scale&rsquo;s{" "}
          <Term id="blue-notes">blue note</Term>. It is almost never a resting
          place. It is a note you pass through — slide <Mono>2 → ♭3 → 3</Mono>{" "}
          and the third arrives with a little bend in it, the way a singer or a
          guitarist would bend into it. Press the slide, then the plain step,
          and hear what the extra key buys.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Slide: 2 → ♭3 → 3"
              offsets={[SECOND, FLAT_THIRD, MAJOR_THIRD]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Plain: 2 → 3"
              offsets={[SECOND, MAJOR_THIRD]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Lick: 3 → ♭3 → 1"
              offsets={[MAJOR_THIRD, FLAT_THIRD, 0]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="twin">4. Same keys, different home: the minor blues scale</H2>
        <P>
          Take the six keys of <RootName /> major blues and, without turning any
          on or off, call the <Mono>6</Mono> home instead. You are now playing
          the <LessonLink href="/scales/blues-scale">blues scale</LessonLink> —
          the usual, minor one — on <NoteAt offset={TWIN_OFFSET} />. In{" "}
          <Mono>C</Mono> that is <Mono>A</Mono> blues, the exact keys the
          blues-scale page opens on. Flip the toggle and only the green{" "}
          <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "majorBlues", name: "Major blues", degrees: MAJOR_BLUES }}
          b={{
            id: "blues",
            name: "Blues scale",
            degrees: MINOR_BLUES,
            rootOffset: TWIN_OFFSET,
          }}
        />
        <P>
          The two scales are built by the same move in mirror image. Minor blues
          is the minor pentatonic plus a <Mono>♭5</Mono> squeezed in below the
          fifth; major blues is the major pentatonic plus a <Mono>♭3</Mono>{" "}
          squeezed in below the third. And because the two pentatonics already
          share their keys three half steps apart, so do the two blues scales —
          the extra note lands on the same key either way. Blues and country
          players switch between them mid-phrase without moving their hand.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">5. What to do with it</H2>
        <P>
          Keep the lock on and play over a bright, major chord — this is the
          scale for the <Mono>I</Mono> chord of a country or gospel tune, the
          moment the minor blues scale would sound too dark. Land on{" "}
          <Mono>1</Mono>, <Mono>3</Mono>, or <Mono>5</Mono>; use{" "}
          <Mono>6 → 5</Mono> and <Mono>♭3 → 3</Mono> as your two signature
          moves, and <Mono>3 → 2 → 1</Mono> to close. Then read{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink> for
          the form both scales grew up on.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play major blues"
              offsets={MAJOR_BLUES_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
