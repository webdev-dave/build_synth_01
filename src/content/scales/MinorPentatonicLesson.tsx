/**
 * The minor pentatonic, taught from zero.
 *
 * The blues page introduces this scale in passing as "the five notes under
 * the blue note"; this page gives it its own room. The idea to land is
 * *why nothing clashes* — no two notes a half step apart — and the two
 * comparisons that place it on the map: the same five keys re-homed give
 * the major pentatonic, and natural minor with two notes removed gives
 * this. It hands off to the blues page with one added key.
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
  Sources,
  type DegreeRow,
} from "@/components/scales/lessonPrimitives";
import { degreesOf } from "@/lib/music/scaleCatalog";
import { BLUE_NOTE_OFFSET } from "@/components/scales/notes";

// A is the guitar home key, and A minor pentatonic is all white keys — the
// same classroom key the blues page uses, so the two pages agree.
const DEFAULT_ROOT_PC = 9;

const PENTATONIC = degreesOf("pentatonicMinor");
const MAJOR_PENTATONIC = degreesOf("pentatonicMajor");
const NATURAL_MINOR = degreesOf("minor");
const BLUES = degreesOf("blues");
const PENTATONIC_OFFSETS = PENTATONIC.map((d) => d.offset);

const FLAT_THIRD = 3;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 3, label: "♭3", role: "lowered third — what makes it minor" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

const SOURCES = [
  {
    label:
      "Gerhard Kubik, “Africa and The Blues” (Afropop Worldwide interview) — pentatonic pitch systems carried from West Africa into the blues",
    url: "https://www.afropop.org/articles/africa-and-the-blues-an-interview-with-gerhard-kubik",
  },
  {
    label:
      "Smithsonian Folkways, “Before the Blues: From Africa to the United States” — the vocal traditions the scale travelled in",
    url: "https://folkways.si.edu/lesson/before-the-blues/from-africa-to-the-united-states",
  },
];

export function MinorPentatonicLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={PENTATONIC}>
      <section className="mt-8" aria-label="Minor pentatonic lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it: five notes</H2>
        <P>
          A <Term id="scale">scale</Term> is a short list of the twelve piano
          notes that a piece treats as home. Most scales pick seven. This one
          picks five — <em>penta</em> is Greek for five — and it is the scale
          more people have soloed on than any other. Almost every rock guitar
          lead, most blues licks, and a great deal of folk melody from several
          continents sits inside it.
        </P>
        <P>
          The keyboard below is locked to <RootName /> minor pentatonic. Keys
          with a green number are in the scale and play; keys with a red dot
          stay silent. Press <Mono>Play</Mono>, then press the green keys in any
          order you like, fast or slow. Notice that you cannot make it sound
          wrong. That is the whole point of the scale, and section 3 explains
          why.
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
        <H2 id="degrees">2. Counting from home: the five degrees</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>. Count keys to the right,
          black and white alike; each key is one{" "}
          <Term id="steps">half step</Term>. The plain numbers 1 to 7 belong to
          the <LessonLink href="/scales/major-scale">major scale</LessonLink>,
          the ruler everything else is measured with. A{" "}
          <Term id="flats-and-sharps">flat</Term> (<Mono>♭</Mono>) in front of a
          number means &ldquo;that note, one key lower.&rdquo;
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={FLAT_THIRD} />
        <P>
          Two of the five are lowered. The <Mono>♭3</Mono> is what makes the
          scale minor — in <RootName /> it is <NoteAt offset={FLAT_THIRD} />,
          one key below where the major scale would put its third. The{" "}
          <Mono>♭7</Mono> follows it. And two of the major scale&rsquo;s degrees
          are simply not here: no <Mono>2</Mono>, no <Mono>6</Mono>. Click a
          chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={PENTATONIC}
          spotlightOffset={FLAT_THIRD}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="no-clash">3. Why nothing clashes</H2>
        <P>
          Look at the gaps between neighbours. <Mono>1</Mono> to <Mono>♭3</Mono>{" "}
          is three keys. <Mono>♭3</Mono> to <Mono>4</Mono> is two.{" "}
          <Mono>4</Mono> to <Mono>5</Mono>, two. <Mono>5</Mono> to{" "}
          <Mono>♭7</Mono>, three. <Mono>♭7</Mono> back to the octave, two. Every
          gap is at least a whole step. There is not a single half step anywhere
          in the scale — no two notes sit on adjacent keys.
        </P>
        <P>
          Half steps are where friction lives. Two notes one key apart rub
          against each other; a melody that lands on one usually has to move to
          the other. The major scale has two such pairs and natural minor has
          two, and a beginner who lands on the wrong side of one hears a
          &ldquo;mistake.&rdquo; The minor pentatonic has none. Whatever note
          you land on, its neighbours are far enough away that it can sit there.
          Press the two runs below: the first is the scale, the second walks up
          all twelve keys in a row. Hear how much rougher the second is.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Five notes, no friction"
              offsets={PENTATONIC_OFFSETS}
              descend={false}
            />
            <PlayPatternButton
              label="Every key, for contrast"
              offsets={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="from-minor">
          4. Where the five come from: natural minor, two notes removed
        </H2>
        <P>
          Start from the seven-note natural minor scale in <RootName /> —{" "}
          <Mono>1 2 ♭3 4 5 ♭6 ♭7</Mono>. Now remove the two notes that create
          its half steps: the <Mono>2</Mono>, which sits one key below{" "}
          <Mono>♭3</Mono>, and the <Mono>♭6</Mono>, which sits one key above{" "}
          <Mono>5</Mono>. What is left is the minor pentatonic. Flip the toggle
          and watch two keys drop out; play both and hear the seven-note scale
          smooth into the five.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "natural", name: "Natural minor", degrees: NATURAL_MINOR }}
          b={{
            id: "pentatonic",
            name: "Minor pentatonic",
            degrees: PENTATONIC,
          }}
          defaultSide="b"
        />
        <P>
          That is a useful way to think about any pentatonic: a seven-note scale
          with its trouble spots taken out. It is also why the scale is so
          forgiving over a chord progression — the notes most likely to clash
          with a passing chord are exactly the ones that are not there.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="major-pentatonic">
          5. Same keys, different home: the major pentatonic
        </H2>
        <P>
          Now the map view. Take the five keys of <RootName /> minor pentatonic
          and, without turning any on or off, call the <Mono>♭3</Mono> home
          instead. You are now playing the{" "}
          <LessonLink href="/scales/major-pentatonic">
            major pentatonic
          </LessonLink>{" "}
          on <NoteAt offset={3} /> — <Mono>1 2 3 5 6</Mono>, bright and open,
          the scale of a great many folk tunes and country licks. In{" "}
          <Mono>A</Mono> that is <Mono>C</Mono> major pentatonic: the same five
          white keys, settling somewhere brighter. Flip the toggle and only the
          green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "minor-pent",
            name: "Minor pentatonic",
            degrees: PENTATONIC,
          }}
          b={{
            id: "major-pent",
            name: "Major pentatonic",
            degrees: MAJOR_PENTATONIC,
            rootOffset: 3,
          }}
        />
        <P>
          Guitarists lean on this constantly: the fingering they learned for{" "}
          <Mono>A</Mono> minor pentatonic is, unchanged, <Mono>C</Mono> major
          pentatonic — they just treat a different note as the place to land.
          The relationship is the same one that links the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> to its
          relative minor, three keys down.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="blue-note">6. Add one key: the blues scale</H2>
        <P>
          The pentatonic&rsquo;s one weakness is also its charm: with no
          friction anywhere, it can sound a little too safe. The blues fixes
          that by squeezing one extra key in between <Mono>4</Mono> and{" "}
          <Mono>5</Mono> — the <Mono>♭5</Mono>, in <RootName /> the key{" "}
          <NoteAt offset={BLUE_NOTE_OFFSET} />. Six keys apart from the root,
          wedged against two neighbours, it is the one note in the scale that
          cannot sit still. Flip the toggle and hear the five become the{" "}
          <LessonLink href="/scales/blues-scale">blues scale</LessonLink>.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "pentatonic",
            name: "Minor pentatonic",
            degrees: PENTATONIC,
          }}
          b={{
            id: "blues",
            name: "Blues scale",
            degrees: BLUES,
            spotlightOffset: BLUE_NOTE_OFFSET,
          }}
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="where-from">7. Where it comes from</H2>
        <P>
          Five-note scales are not owned by anyone. Versions of this shape turn
          up in Scottish and Irish tunes, in Chinese and Japanese music, in
          Andean flute melodies, and across West and Central Africa. The line
          that matters most for the music on this site runs through the last of
          those: the ethnomusicologist Gerhard Kubik traces the pentatonic
          habits of pitch in West African song into the work songs, field
          hollers, and spirituals of the American South, and from there into the
          blues. The blues scale — this scale plus its{" "}
          <Term id="blue-notes">blue note</Term> — is where that lineage is
          easiest to hear.{" "}
          <LessonLink href="/history/blues">
            Where did the blues come from?
          </LessonLink>{" "}
          tells the longer version.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">8. What to do with it</H2>
        <P>
          Keep the lock on and play. With the lock on there are no wrong notes,
          so stop thinking about which key and start thinking about rhythm and
          shape — short phrases, a rest, a reply. Land on <Mono>1</Mono> to
          finish a thought and on <Mono>5</Mono> to leave it open. Pick the root
          that matches your song; guitar blues and rock usually live in{" "}
          <Mono>A</Mono> or <Mono>E</Mono>. When the five start to feel too
          polite, go to{" "}
          <LessonLink href="/scales/blues-scale">
            What is the blues scale?
          </LessonLink>{" "}
          and add the sixth note.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play the minor pentatonic"
              offsets={PENTATONIC_OFFSETS}
            />
          </LessonToolbar>
        </div>

        <Sources items={SOURCES} />
      </section>
    </ScaleLessonProvider>
  );
}
