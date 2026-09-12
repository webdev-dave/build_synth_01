/**
 * The major scale, taught from zero.
 *
 * This is the page every other scale page points back to: the plain
 * numbers 1–7 live here, and "♭3" or "♯4" elsewhere only mean anything
 * measured against this. It teaches the shape three ways — the white keys
 * in C, the step recipe (W W H W W W H), and the degree numbers — and then
 * uses the comparer twice: the same seven keys re-homed on the 6th give
 * natural minor (the map idea), and three keys lowered on the same root
 * give minor the other way (the recipe idea).
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

// C is the classroom key: C major is every white key and no black ones, so
// the scale and the piano's layout explain each other.
const DEFAULT_ROOT_PC = 0;

const MAJOR = degreesOf("major");
const MINOR = degreesOf("minor");
const MAJOR_OFFSETS = MAJOR.map((d) => d.offset);

/** The major third — the one degree that says "major" out loud. */
const MAJOR_THIRD = 4;
/** Where the two half steps fall: 3→4 and 7→octave. */
const THIRD = 4;
const FOURTH = 5;
const SEVENTH = 11;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home (do)" },
  { offset: 2, label: "2", role: "second (re)" },
  { offset: 4, label: "3", role: "major third — what makes it major (mi)" },
  { offset: 5, label: "4", role: "fourth (fa)" },
  { offset: 7, label: "5", role: "fifth (sol)" },
  { offset: 9, label: "6", role: "sixth (la)" },
  { offset: 11, label: "7", role: "seventh — one key below home (ti)" },
];

export function MajorScaleLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={MAJOR}>
      <section className="mt-8" aria-label="Major scale lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="white-keys">1. First, hear it: the white keys</H2>
        <P>
          A piano has only twelve different notes; after twelve keys the names
          start over. A <Term id="scale">scale</Term> is a short list of those
          twelve that a piece of music treats as home. The major scale is the
          list you already know even if you have never sat at a piano — it is
          do-re-mi, it is the tune of &ldquo;Twinkle, Twinkle,&rdquo; and in{" "}
          <Mono>C</Mono> it is every white key from one <Mono>C</Mono> to the
          next with no black keys at all.
        </P>
        <P>
          The keyboard below is locked to <RootName /> major. Keys with a green
          number are in the scale and play; keys with a red dot stay silent.
          Press <Mono>Play</Mono> to hear the whole run up and back. If you
          leave the root on <Mono>C</Mono>, notice that every red dot is a black
          key — that is not a coincidence, and section 3 explains it.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton label="Play the scale" offsets={MAJOR_OFFSETS} />
          </LessonToolbar>
          <ScaleKeyboard degrees={MAJOR} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: the seven degrees</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>, numbered 1 to 7. In the
          major scale those numbers come plain, with no{" "}
          <Term id="flats-and-sharps">flat or sharp</Term> in front of them.
          That is not because the major scale is simple. It is because the major
          scale is the <em>ruler</em>: every other scale on this site is
          described by how it differs from this one, so this is the one that
          gets to be plain.
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={MAJOR_THIRD} />
        <P>
          The middle column counts keys above the root, black and white alike;
          each key is one <Term id="steps">half step</Term>. Read it and the
          major scale is a list of distances: <Mono>0 2 4 5 7 9 11</Mono>.
          Change the root at the top and the letters in the third column all
          change, but that list does not — and that list <em>is</em> the scale.
          Click a chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={MAJOR}
          spotlightOffset={MAJOR_THIRD}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-recipe">3. The recipe: whole, whole, half</H2>
        <P>
          Look at the gaps between neighbours instead of the distance from home.
          From <Mono>1</Mono> to <Mono>2</Mono> is two keys — a{" "}
          <Term id="steps">whole step</Term>. <Mono>2</Mono> to <Mono>3</Mono>{" "}
          is two more. Then <Mono>3</Mono> to <Mono>4</Mono> is only one key: a
          half step. Three more whole steps, then one last half step back to the
          octave. Written out: <Mono>W W H W W W H</Mono>. That eight-word
          recipe is the whole major scale, in any key, on any instrument.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear the half step: 3 → 4"
              offsets={[THIRD, FOURTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Hear the other one: 7 → 1"
              offsets={[SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          Now the white keys make sense. In <Mono>C</Mono> the two half steps
          fall on <Mono>E–F</Mono> and <Mono>B–C</Mono> — exactly the two places
          on a piano where two white keys touch with no black key between them.
          The keyboard is not laid out that way by chance; it was built around
          this scale. Move the root to <Mono>G</Mono> and one black key joins
          the list (<Mono>F♯</Mono>); move it to <Mono>D</Mono> and two do. The
          recipe never changes. Only which keys happen to satisfy it.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="major-third">4. What &ldquo;major&rdquo; means: the third</H2>
        <P>
          Of the seven degrees, one carries the name. The <Mono>3</Mono> sits
          four keys above the root — in <RootName /> that is{" "}
          <NoteAt offset={MAJOR_THIRD} /> — and a third that wide is called a{" "}
          <em>major</em> third. It is the bright, open, settled sound in the
          scale. Lower it one key and the whole scale turns minor, whatever else
          you do. Press the pair below and listen to the character change on the
          second note.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear 1 → 3 (major)"
              offsets={[0, MAJOR_THIRD]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Hear 1 → ♭3 (minor)"
              offsets={[0, 3]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          The <Mono>7</Mono> matters nearly as much. It sits one key below the
          root and leans into it — play <NoteAt offset={SEVENTH} /> and your ear
          is already waiting for <RootName />. Musicians call it the{" "}
          <em>leading tone</em>; it is why a major-scale melody that ends on{" "}
          <Mono>7 → 1</Mono> sounds finished. Natural minor does not have one,
          which is half of why minor feels less resolved.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="relative-minor">
          5. Same keys, different home: the relative minor
        </H2>
        <P>
          Here is the map view. Take the seven keys of <RootName /> major and,
          without turning any on or off, call the <Mono>6</Mono> home instead.
          You are now playing <strong>natural minor</strong> starting on{" "}
          <NoteAt offset={9} /> — the <em>relative minor</em> of <RootName />{" "}
          major. In <Mono>C</Mono> that is <Mono>A</Mono> minor: still all white
          keys, but everything settles on <Mono>A</Mono> and the scale sounds
          dark instead of bright. Flip the toggle: nothing lights or dims, only
          the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "relative",
            name: "Natural minor",
            degrees: MINOR,
            rootOffset: 9,
          }}
        />
        <P>
          This is the first <Term id="mode">mode</Term> most people learn
          without knowing the word: one set of notes, two homes. Every degree of
          the major scale can be a home in the same way — start on{" "}
          <Mono>2</Mono> and you have{" "}
          <LessonLink href="/scales/dorian">Dorian</LessonLink>, on{" "}
          <Mono>5</Mono> and you have{" "}
          <LessonLink href="/scales/mixolydian">Mixolydian</LessonLink>. Those
          pages pick the story up from here.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="parallel-minor">
          6. Same home, three keys lowered: the parallel minor
        </H2>
        <P>
          The other way to reach minor is to keep <RootName /> as home and
          change the recipe. Lower the <Mono>3</Mono>, the <Mono>6</Mono>, and
          the <Mono>7</Mono> each by one key and you have <RootName /> natural
          minor — the <em>parallel</em> minor, same root, different notes. Flip
          the toggle and watch three keys go dark while their lower neighbours
          light. The lowered third is the one doing most of the work; the other
          two follow it.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "major",
            name: "Major",
            degrees: MAJOR,
            spotlightOffset: MAJOR_THIRD,
          }}
          b={{
            id: "parallel",
            name: "Natural minor",
            degrees: MINOR,
            spotlightOffset: 3,
          }}
        />
        <P>
          Two routes to the same kind of scale — re-home the keys, or lower some
          of them — and both are worth having in your hands. Relative thinking
          tells you which scales share a keyboard. Parallel thinking tells you
          which single notes make the difference between one character and
          another. Every scale page on this site uses one or the other, and
          usually both.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and play the green keys in any order. End phrases on{" "}
          <Mono>1</Mono>; arrive from <Mono>7</Mono> below or <Mono>2</Mono>{" "}
          above and feel how both lean home. Then take one note away at a time —
          drop the <Mono>4</Mono> and the <Mono>7</Mono> and you have the
          five-note{" "}
          <LessonLink href="/scales/major-pentatonic">
            major pentatonic
          </LessonLink>
          ; lower the third and go to{" "}
          <LessonLink href="/scales/minor-pentatonic">
            minor pentatonic
          </LessonLink>{" "}
          and from there to the{" "}
          <LessonLink href="/scales/blues-scale">blues scale</LessonLink>. Every
          one of them is this scale with a few decisions made.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play the major scale"
              offsets={MAJOR_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
