/**
 * Lydian, taught as "major that won't come down."
 *
 * One raised note — the ♯4 — removes the major scale's strongest downward
 * pull (4 → 3) and puts a tritone against the root, so the mode hovers
 * instead of settling. Two comparers: major → Lydian (swap), and F Lydian
 * re-homed as C major (the mode idea).
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

// F is the classroom key: F Lydian is all white keys (C major from F).
const DEFAULT_ROOT_PC = 5;

const LYDIAN = degreesOf("lydian");
const MAJOR = degreesOf("major");
const LYDIAN_OFFSETS = LYDIAN.map((d) => d.offset);

const MAJOR_THIRD = 4;
const FOURTH = 5;
const SHARP_FOURTH = 6;
const FIFTH = 7;
/** C major's root sits a perfect fifth above F. */
const PARENT_MAJOR_OFFSET = 7;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 4, label: "3", role: "major third — bright" },
  { offset: 6, label: "♯4", role: "raised fourth — the changed note" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "sixth" },
  { offset: 11, label: "7", role: "seventh — the leading tone" },
];

export function LydianLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={LYDIAN}>
      <section className="mt-8" aria-label="Lydian lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> Lydian. Keys with a green
          number are in the <Term id="scale">scale</Term> and play; keys with a
          red dot stay silent. Press <Mono>Play</Mono>. It is major — brighter
          than major, if anything — and yet it never quite lands. The fourth
          step goes somewhere unexpected and the whole scale seems to lift off
          the ground. Film composers use it for wonder, flight, and the moment a
          door opens onto somewhere impossible.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={LYDIAN_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={LYDIAN} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: one sharp</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>. Count keys to the right,
          black and white alike; each key is one{" "}
          <Term id="steps">half step</Term>. The plain numbers 1 to 7 belong to
          the <LessonLink href="/scales/major-scale">major scale</LessonLink>; a{" "}
          <Term id="flats-and-sharps">sharp</Term> (<Mono>♯</Mono>) means
          &ldquo;that note, one key higher.&rdquo;
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={SHARP_FOURTH} />
        <P>
          Six plain numbers and one sharp. It is the only mode of the major
          scale that <em>raises</em> a note rather than lowering one — which is
          why it is the only one that sounds brighter than major itself. Click a
          chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={LYDIAN}
          spotlightOffset={SHARP_FOURTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="raise-the-fourth">3. Move one key: major becomes Lydian</H2>
        <P>
          Take the major scale in <RootName /> and raise its <Mono>4</Mono> —{" "}
          <NoteAt offset={FOURTH} degrees={MAJOR} /> — one key to{" "}
          <NoteAt offset={SHARP_FOURTH} />. Nothing else changes. Flip the
          toggle and watch one key go dark while its upper neighbour lights;
          play both runs and listen to the middle of the scale. Major pauses on
          the fourth and falls back. Lydian steps up instead and keeps going.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "lydian",
            name: "Lydian",
            degrees: LYDIAN,
            spotlightOffset: SHARP_FOURTH,
          }}
          defaultSide="b"
        />
        <P>
          Why does the fourth matter? In the major scale the <Mono>4</Mono> sits
          one key above the <Mono>3</Mono> and leans down onto it — the most
          reliable falling step in Western melody, the &ldquo;A-men&rdquo; of a
          hymn. Lydian has no such note. Its <Mono>♯4</Mono> is a whole step
          from the third and a half step below the fifth, so it leans{" "}
          <em>up</em>. Press both pairs: the first sinks, the second rises.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Major: hear 4 → 3"
              offsets={[FOURTH, MAJOR_THIRD]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Lydian: hear ♯4 → 5"
              offsets={[SHARP_FOURTH, FIFTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="tritone">4. The float: a tritone against home</H2>
        <P>
          Count from the root to the <Mono>♯4</Mono>: six half steps, exactly
          half an octave. That distance is the <Term id="tritone">tritone</Term>
          , the one <Term id="interval">interval</Term> that splits the octave
          evenly and so has no lean in either direction. In the major scale the
          tritone lives between the <Mono>4</Mono> and the <Mono>7</Mono>, away
          from home, and it resolves. In Lydian it sits right on top of the
          root, and it does not. Hold <Mono>1</Mono> and <Mono>♯4</Mono>{" "}
          together and you are hearing why the mode floats: home itself has a
          question mark in it.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear 1 and ♯4"
              offsets={[0, SHARP_FOURTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Hear the home chord: 1 3 ♯4 5 7"
              offsets={[0, MAJOR_THIRD, SHARP_FOURTH, FIFTH, 11]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">
          5. Same keys, different home: a major scale from its fourth
        </H2>
        <P>
          Now the map view. Take the seven keys of <RootName /> Lydian and,
          without turning any on or off, call the <Mono>5</Mono> home instead.
          You are now playing the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> on{" "}
          <NoteAt offset={PARENT_MAJOR_OFFSET} />. In <Mono>F</Mono> that is{" "}
          <Mono>C</Mono> major: the same white keys, settling a fifth higher.
          Flip the toggle and only the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "lydian", name: "Lydian", degrees: LYDIAN }}
          b={{
            id: "major",
            name: "Major",
            degrees: MAJOR,
            rootOffset: PARENT_MAJOR_OFFSET,
          }}
        />
        <P>
          Lydian is the fourth <Term id="mode">mode</Term> of the major scale —
          the major scale started from its fourth degree. It is the mirror of{" "}
          <LessonLink href="/scales/mixolydian">Mixolydian</LessonLink>: that
          mode lowers one note from major and sits a fifth <em>above</em> its
          parent; this one raises one note and sits a fifth <em>below</em>.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">6. What to do with it</H2>
        <P>
          Keep the lock on and play slowly over a held root — Lydian is a
          one-chord mode and does not want a progression. Let phrases end on{" "}
          <Mono>♯4</Mono>, <Mono>7</Mono>, or <Mono>2</Mono>, the notes that
          refuse to settle, rather than <Mono>1</Mono>; the floating feeling
          comes from never quite arriving. If it starts to sound like plain
          major, you have been avoiding the <Mono>♯4</Mono> — it is the one note
          that makes the mode itself.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton label="Play Lydian" offsets={LYDIAN_OFFSETS} />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
