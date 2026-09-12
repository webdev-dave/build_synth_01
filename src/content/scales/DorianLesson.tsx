/**
 * Dorian, taught as "minor with the lights on."
 *
 * One note separates it from natural minor — the raised 6th — and the page
 * is about what that note does: it warms the minor sound and makes the chord
 * on the 4th degree major. Two comparers: natural minor → Dorian (swap), and
 * D Dorian re-homed as C major (the mode idea). It ends at the harmonica's
 * third position and points one sharp further to Ukrainian Dorian.
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

// D is the classroom key: D Dorian is all white keys (C major from D), and a
// C harp in third position plays in D.
const DEFAULT_ROOT_PC = 2;

const DORIAN = degreesOf("dorian");
const MINOR = degreesOf("minor");
const MAJOR = degreesOf("major");
const DORIAN_OFFSETS = DORIAN.map((d) => d.offset);

const FLAT_THIRD = 3;
const FOURTH = 5;
const FLAT_SIXTH = 8;
const MAJOR_SIXTH = 9;
/** C major's root sits ten semitones above D — a whole step below. */
const PARENT_MAJOR_OFFSET = 10;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 3, label: "♭3", role: "lowered third — what makes it minor" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "major sixth — the changed note" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

export function DorianLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={DORIAN}>
      <section className="mt-8" aria-label="Dorian lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> Dorian. Keys with a green
          number are in the <Term id="scale">scale</Term> and play; keys with a
          red dot stay silent. Press <Mono>Play</Mono>. It is minor — the third
          is low — but it does not sink the way natural minor does. Something
          near the top stays bright. &ldquo;Scarborough Fair,&rdquo; the vamp of
          &ldquo;So What,&rdquo; and half the funk and soul grooves built on a
          minor chord live here.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={DORIAN_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={DORIAN} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: two flats</H2>
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
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={MAJOR_SIXTH} />
        <P>
          Two flats, not three. The <Mono>♭3</Mono> makes it minor and the{" "}
          <Mono>♭7</Mono> keeps it relaxed, but the sixth is plain — the same{" "}
          <Mono>6</Mono> the major scale has. Click a chip to hear each degree
          in <RootName />.
        </P>
        <DegreeStrip
          degrees={DORIAN}
          spotlightOffset={MAJOR_SIXTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="raise-the-sixth">
          3. Move one key: natural minor becomes Dorian
        </H2>
        <P>
          Take the{" "}
          <LessonLink href="/scales/natural-minor">natural minor</LessonLink>{" "}
          scale in <RootName /> and raise its <Mono>♭6</Mono> —{" "}
          <NoteAt offset={FLAT_SIXTH} degrees={MINOR} /> — one key to{" "}
          <NoteAt offset={MAJOR_SIXTH} />. Nothing else changes. Flip the toggle
          and watch one key go dark while its upper neighbour lights; play both
          runs and listen to the sixth step. Minor droops there. Dorian lifts.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "minor", name: "Natural minor", degrees: MINOR }}
          b={{
            id: "dorian",
            name: "Dorian",
            degrees: DORIAN,
            spotlightOffset: MAJOR_SIXTH,
          }}
          defaultSide="b"
        />
        <P>
          Hear the note against home. In natural minor the <Mono>♭6</Mono> sits
          one key above the <Mono>5</Mono> and leans down onto it — the sigh
          that makes minor sound sad. Dorian&rsquo;s <Mono>6</Mono> is a whole
          step above the fifth and does not lean; it sits there, warm. That
          single change is why Dorian sounds like minor that has made its peace.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Minor: hear 1 → ♭6"
              offsets={[0, FLAT_SIXTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Dorian: hear 1 → 6"
              offsets={[0, MAJOR_SIXTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="four-chord">
          4. What the 6 gives: a major chord on the fourth
        </H2>
        <P>
          Build a chord on the fourth degree: <Mono>4 6 1</Mono>. In natural
          minor that chord uses the <Mono>♭6</Mono> and comes out minor. In
          Dorian the <Mono>6</Mono> is raised, so the chord on the fourth is{" "}
          <em>major</em> — a bright chord sitting inside a minor scale. A
          two-chord vamp between the minor home chord and that major fourth
          chord is the single most common Dorian sound: soul, funk, modal jazz,
          and a great deal of folk-rock run on it.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Home chord: 1 ♭3 5"
              offsets={[0, FLAT_THIRD, 7]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Fourth chord: 4 6 1"
              offsets={[FOURTH, MAJOR_SIXTH, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">
          5. Same keys, different home: a major scale from its second
        </H2>
        <P>
          Now the map view. Take the seven keys of <RootName /> Dorian and,
          without turning any on or off, call the <Mono>♭7</Mono> home instead.
          You are now playing the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> on{" "}
          <NoteAt offset={PARENT_MAJOR_OFFSET} />. In <Mono>D</Mono> that is{" "}
          <Mono>C</Mono> major: the same white keys, settling one note lower.
          Flip the toggle and only the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "dorian", name: "Dorian", degrees: DORIAN }}
          b={{
            id: "major",
            name: "Major",
            degrees: MAJOR,
            rootOffset: PARENT_MAJOR_OFFSET,
          }}
        />
        <P>
          Dorian is the second <Term id="mode">mode</Term> of the major scale —
          the major scale started from its second degree. Every white-key tune
          in C major is a D Dorian tune if it keeps coming home to D.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="third-position">
          6. Harmonica third position, and one sharp further
        </H2>
        <P>
          A C harmonica blows and draws the notes of C major. Play it in{" "}
          <Mono>D</Mono> and those same notes spell D Dorian —{" "}
          <em>third position</em>, the position blues players reach for when the
          song is minor. The <Mono>♭3</Mono> and <Mono>♭7</Mono> are already in
          the harp; no bends needed to sound minor. The{" "}
          <LessonLink href="/harmonica-lab/v2?position=3">
            Harmonica Lab
          </LessonLink>{" "}
          shows which hole gives each note, for any key of harp.
        </P>
        <P>
          Raise Dorian&rsquo;s <Mono>4</Mono> one key and you have{" "}
          <LessonLink href="/scales/ukrainian-dorian">
            Ukrainian Dorian
          </LessonLink>
          , the klezmer <em>Mi Sheberakh</em> mode — Dorian with a wide,
          dramatic leap in the middle. Its page opens on this same root, so you
          can walk straight across.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and play the green keys over a held root. Land on{" "}
          <Mono>1</Mono>, <Mono>♭3</Mono>, or <Mono>5</Mono> to settle; lean on
          the <Mono>6</Mono> when you want the warmth that tells the ear this is
          Dorian and not plain minor. Then set the root to a key with black keys
          and notice the shape changes but the colour does not.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton label="Play Dorian" offsets={DORIAN_OFFSETS} />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
