/**
 * Natural minor, taught from both directions at once.
 *
 * The scale has two honest descriptions and beginners are usually given only
 * one. Parallel: the major scale on the same root with three notes lowered
 * (comparer, swap). Relative: the same seven keys as the major scale three
 * keys up, with a new home (comparer, re-home). The page shows both, then
 * points at the two minors that grow out of it (harmonic, melodic) and at
 * the harmonica's fourth position.
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

// A is the classroom key: A minor is all white keys — C major from A — and
// it is the root the harmonic- and melodic-minor pages open on too.
const DEFAULT_ROOT_PC = 9;

const MINOR = degreesOf("minor");
const MAJOR = degreesOf("major");
const MINOR_OFFSETS = MINOR.map((d) => d.offset);

const FLAT_THIRD = 3;
const MAJOR_THIRD = 4;
const FIFTH = 7;
/** The relative major's root sits a minor third above the page root. */
const RELATIVE_MAJOR_OFFSET = 3;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 3, label: "♭3", role: "lowered third — what makes it minor" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 8, label: "♭6", role: "lowered sixth" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

export function NaturalMinorLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={MINOR}>
      <section className="mt-8" aria-label="Natural minor lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> natural minor. Keys with
          a green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono>. If you know what
          &ldquo;minor&rdquo; sounds like — sadder, darker, more serious than
          major — this is where that word comes from. It is the second scale
          most people learn, and the one a great deal of folk, rock, and film
          music is written in.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton label="Play the scale" offsets={MINOR_OFFSETS} />
          </LessonToolbar>
          <ScaleKeyboard degrees={MINOR} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: three flats</H2>
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
          Three flats: the third, sixth, and seventh. The <Mono>♭3</Mono> does
          most of the work — it is the note that makes a scale or a chord sound
          minor at all. Click a chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={MINOR}
          spotlightOffset={FLAT_THIRD}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="parallel">
          3. Same home, three keys lower: major becomes minor
        </H2>
        <P>
          Start from the major scale on <RootName /> and lower its third, sixth,
          and seventh by one key each. Flip the toggle and watch three keys go
          dark while their lower neighbours light; play both runs. Same root,
          same shape of walk up the keyboard, and yet the mood has turned.
          Theory calls this pair <em>parallel</em>: two scales that share a
          home.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "minor",
            name: "Natural minor",
            degrees: MINOR,
            spotlightOffset: FLAT_THIRD,
          }}
          defaultSide="b"
        />
        <P>
          Most of the mood lives in one note. Build a chord on the root —{" "}
          <Mono>1 3 5</Mono>, a major <Term id="triad">triad</Term> — then lower
          only the middle note to <Mono>♭3</Mono>. Press both. The first is the
          sound of &ldquo;major&rdquo;; the second is the sound of
          &ldquo;minor,&rdquo; and the difference is one key.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Major chord: 1 3 5"
              offsets={[0, MAJOR_THIRD, FIFTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Minor chord: 1 ♭3 5"
              offsets={[0, FLAT_THIRD, FIFTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="relative">4. Same keys, different home: the relative major</H2>
        <P>
          Now the other description. Take the seven keys of <RootName /> minor
          and, without turning any on or off, call the <Mono>♭3</Mono> home
          instead. You are now playing the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> on{" "}
          <NoteAt offset={RELATIVE_MAJOR_OFFSET} />. In <Mono>A</Mono> that is{" "}
          <Mono>C</Mono> major: the same white keys, settling three keys higher.
          Flip the toggle and only the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "minor", name: "Natural minor", degrees: MINOR }}
          b={{
            id: "major",
            name: "Major",
            degrees: MAJOR,
            rootOffset: RELATIVE_MAJOR_OFFSET,
          }}
        />
        <P>
          Theory calls these two <em>relative</em>: they share every key and
          differ only in where home is. Natural minor is the sixth{" "}
          <Term id="mode">mode</Term> of the major scale — the major scale
          started from its sixth degree — which is why its other name is{" "}
          <em>Aeolian</em>. A song can drift between C major and A minor without
          a single new key appearing; only the note it keeps coming back to
          tells you which one you are in.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="family">5. The minor that grows two more</H2>
        <P>
          Play the scale once more and listen to the last step,{" "}
          <Mono>♭7 → 1</Mono>. It is two keys wide and does not lean toward
          home. Composers who wanted a stronger arrival raised the seventh one
          key, and got the{" "}
          <LessonLink href="/scales/harmonic-minor">harmonic minor</LessonLink>{" "}
          — with a wide, dramatic leap between its <Mono>♭6</Mono> and{" "}
          <Mono>7</Mono>. Raise the sixth as well to smooth that leap out and
          you have the{" "}
          <LessonLink href="/scales/melodic-minor">melodic minor</LessonLink>.
          Both pages open on this root; natural minor is the one the others are
          measured against.
        </P>
        <P>
          On a ten-hole harmonica, a C harp played in <Mono>A</Mono> is playing
          A natural minor with no bends needed for the scale itself —{" "}
          <em>fourth position</em>. The{" "}
          <LessonLink href="/harmonica-lab/v2?position=4">
            Harmonica Lab
          </LessonLink>{" "}
          shows which hole gives each note, for any key of harp.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">6. What to do with it</H2>
        <P>
          Keep the lock on and play the green keys over a held root. Land on{" "}
          <Mono>1</Mono>, <Mono>♭3</Mono>, or <Mono>5</Mono> for a settled note;
          use <Mono>♭6 → 5</Mono> for the classic minor sigh — one half step,
          falling. Then turn the root picker to a key with black keys in it and
          notice that the keyboard shape changes but the sound does not: the
          scale is the pattern of distances, not the keys.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play natural minor"
              offsets={MINOR_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
