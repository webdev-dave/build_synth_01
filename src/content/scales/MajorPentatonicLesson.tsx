/**
 * Major pentatonic, taught as subtraction.
 *
 * Start from the major scale and remove the two notes that sit a half step
 * from a neighbour — the 4 and the 7. What is left has no half steps, so
 * nothing clashes; that is the whole reason the scale carries so much folk,
 * country, and gospel melody. Two comparers: major → major pentatonic
 * (subset), and the same five keys re-homed as the minor pentatonic three
 * keys down.
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

// C is the classroom key: C major pentatonic is five white keys, and its
// relative minor pentatonic is A — the root the minor-pentatonic page uses.
const DEFAULT_ROOT_PC = 0;

const PENTATONIC = degreesOf("pentatonicMajor");
const MAJOR = degreesOf("major");
const MINOR_PENTATONIC = degreesOf("pentatonicMinor");
const PENTATONIC_OFFSETS = PENTATONIC.map((d) => d.offset);

const MAJOR_THIRD = 4;
const FOURTH = 5;
const FIFTH = 7;
const MAJOR_SEVENTH = 11;
/** The relative minor pentatonic's root sits a major sixth above the page root. */
const RELATIVE_MINOR_OFFSET = 9;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 4, label: "3", role: "major third — bright" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "sixth" },
];

export function MajorPentatonicLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={PENTATONIC}>
      <section className="mt-8" aria-label="Major pentatonic lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it: five notes, all sunshine</H2>
        <P>
          The keyboard below is locked to <RootName /> major pentatonic. Keys
          with a green number are in the <Term id="scale">scale</Term> and play;
          keys with a red dot stay silent. Press <Mono>Play</Mono>, then press
          the green keys in any order. Nothing you do will sound wrong. Country
          intros, gospel choruses, Scottish and Chinese folk tunes, and the
          &ldquo;Amazing Grace&rdquo; melody all live in these five notes.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={PENTATONIC_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={PENTATONIC} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: five plain numbers</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>. Count keys to the right,
          black and white alike; each key is one{" "}
          <Term id="steps">half step</Term>. The plain numbers 1 to 7 belong to
          the <LessonLink href="/scales/major-scale">major scale</LessonLink>.
        </P>
        <DegreeTable rows={DEGREE_ROWS} />
        <P>
          No flats, no sharps — just five of the major scale&rsquo;s seven
          numbers, with the <Mono>4</Mono> and <Mono>7</Mono> missing. Click a
          chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip degrees={PENTATONIC} className="mt-4" />

        {/* ---------------------------------------------------------------- */}
        <H2 id="drop-two">3. Take two notes away: major becomes pentatonic</H2>
        <P>
          Take the major scale in <RootName /> and switch off its <Mono>4</Mono>{" "}
          (<NoteAt offset={FOURTH} degrees={MAJOR} />) and <Mono>7</Mono> (
          <NoteAt offset={MAJOR_SEVENTH} degrees={MAJOR} />
          ). Flip the toggle and watch two keys go dark. Play both runs: major
          is a stair of seven steps; the pentatonic is five steps with two of
          them wider, and it seems to float a little.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "pentatonicMajor",
            name: "Major pentatonic",
            degrees: PENTATONIC,
          }}
          defaultSide="b"
        />
        <P>
          Why those two? Look at where they sit in the major scale. The{" "}
          <Mono>4</Mono> is one key above the <Mono>3</Mono>; the <Mono>7</Mono>{" "}
          is one key below the root. They are the only two notes in the major
          scale that have a neighbour a single half step away — and a half step
          is the one distance that grinds when two notes sound together. Remove
          them and every note in the scale is at least a whole step from every
          other.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="no-half-steps">4. Why nothing clashes</H2>
        <P>
          Hear it directly. First the major scale&rsquo;s <Mono>3 → 4</Mono> — a
          half step, two keys touching, a little sour when held together. Then
          the pentatonic&rsquo;s <Mono>3 → 5</Mono>, which skips the sour note
          entirely. Any two green keys on this keyboard can be held at once
          without that grind, which is why beginners can improvise on the
          pentatonic on day one and why a choir can hum it in parallel.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Major: hear 3 → 4"
              offsets={[MAJOR_THIRD, FOURTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Pentatonic: hear 3 → 5"
              offsets={[MAJOR_THIRD, FIFTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          The{" "}
          <LessonLink href="/scales/minor-pentatonic">
            minor pentatonic
          </LessonLink>{" "}
          has the same property for the same reason, and the two are the only
          five-note scales in common Western use. The{" "}
          <Term id="pentatonic">pentatonic</Term> idea itself is far older and
          wider than either: five-note scales without half steps turn up in
          Chinese, West African, Andean, and Celtic music independently.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="relative">
          5. Same keys, different home: the minor pentatonic
        </H2>
        <P>
          Take the five keys of <RootName /> major pentatonic and, without
          turning any on or off, call the <Mono>6</Mono> home instead. You are
          now playing the minor pentatonic on{" "}
          <NoteAt offset={RELATIVE_MINOR_OFFSET} />. In <Mono>C</Mono> that is{" "}
          <Mono>A</Mono> minor pentatonic — the guitarist&rsquo;s first solo
          scale, on exactly these keys. Flip the toggle and only the green{" "}
          <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "pentatonicMajor",
            name: "Major pentatonic",
            degrees: PENTATONIC,
          }}
          b={{
            id: "pentatonicMinor",
            name: "Minor pentatonic",
            degrees: MINOR_PENTATONIC,
            rootOffset: RELATIVE_MINOR_OFFSET,
          }}
        />
        <P>
          This is the same relationship the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> has
          with its{" "}
          <LessonLink href="/scales/natural-minor">relative minor</LessonLink>,
          shrunk to five notes. A blues or country player uses it constantly:
          the same hand shape is &ldquo;major&rdquo; when the band is on the
          bright chord and &ldquo;minor&rdquo; when it is not, and the ear
          decides which by where the phrase lands.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">6. What to do with it</H2>
        <P>
          Keep the lock on and play. Land on <Mono>1</Mono>, <Mono>3</Mono>, or{" "}
          <Mono>5</Mono> for a settled note; <Mono>6 → 5</Mono> and{" "}
          <Mono>2 → 1</Mono> are the two endings that most country and gospel
          melodies use. Try leaping — <Mono>1</Mono> to <Mono>5</Mono>,{" "}
          <Mono>3</Mono> to <Mono>6</Mono> — since a scale with no half steps
          forgives wide moves that would sound reckless in the major scale. Then
          go to the{" "}
          <LessonLink href="/scales/minor-pentatonic">
            minor pentatonic
          </LessonLink>{" "}
          page and hear the same five keys turn dark.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play major pentatonic"
              offsets={PENTATONIC_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
