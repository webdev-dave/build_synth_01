/**
 * Melodic minor, taught as the fix for harmonic minor's leap.
 *
 * Raise natural minor's 7th for a leading tone and you get harmonic minor
 * — and an augmented second between ♭6 and 7. Raise the 6th as well and the
 * leap closes: melodic minor. Three comparers: harmonic → melodic (swap,
 * the 6th), major → melodic (swap, only the 3rd differs), and the classical
 * up/down pair played as two runs. The static membership map is the
 * ascending (jazz) form; section 5 says so in words.
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

// A, the root the natural- and harmonic-minor pages open on, so the three
// minors line up key for key.
const DEFAULT_ROOT_PC = 9;

const MELODIC_MINOR = degreesOf("melodicMinor");
const HARMONIC_MINOR = degreesOf("harmonicMinor");
const NATURAL_MINOR = degreesOf("minor");
const MAJOR = degreesOf("major");
const MELODIC_OFFSETS = MELODIC_MINOR.map((d) => d.offset);
/** Natural minor from the octave down — the classical descending half. */
const NATURAL_MINOR_DESCENDING = [
  12,
  ...[...NATURAL_MINOR].reverse().map((d) => d.offset),
];

const FLAT_THIRD = 3;
const FLAT_SIXTH = 8;
const MAJOR_SIXTH = 9;
const MAJOR_SEVENTH = 11;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 3, label: "♭3", role: "lowered third — the only flat" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "major sixth — raised" },
  { offset: 11, label: "7", role: "major seventh — raised, the leading tone" },
];

export function MelodicMinorLesson() {
  return (
    <ScaleLessonProvider
      defaultRootPc={DEFAULT_ROOT_PC}
      degrees={MELODIC_MINOR}
    >
      <section className="mt-8" aria-label="Melodic minor lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> melodic minor. Keys with
          a green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono> and listen to
          where it changes character. The bottom half is minor — the third is
          low. The top half is the major scale, step for step. It is a scale
          that starts in one mood and climbs into another, and it does so
          smoothly, with no leap anywhere.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={MELODIC_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={MELODIC_MINOR} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: one flat</H2>
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
          One flat. Of the three minor scales this is the one closest to major —
          only the <Mono>♭3</Mono> separates them. Click a chip to hear each
          degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={MELODIC_MINOR}
          spotlightOffset={MAJOR_SIXTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="close-the-leap">
          3. Move one key: harmonic minor becomes melodic minor
        </H2>
        <P>
          The{" "}
          <LessonLink href="/scales/harmonic-minor">harmonic minor</LessonLink>{" "}
          raised natural minor&rsquo;s seventh to get a leading tone, and paid
          for it with a wide, dramatic step between <Mono>♭6</Mono> and{" "}
          <Mono>7</Mono> — an{" "}
          <Term id="augmented-second">augmented second</Term>, three keys in one
          stride. Melodic minor keeps the leading tone and closes the gap by
          raising the sixth as well:{" "}
          <NoteAt offset={FLAT_SIXTH} degrees={HARMONIC_MINOR} /> becomes{" "}
          <NoteAt offset={MAJOR_SIXTH} />. Flip the toggle and play both runs.
          The leap is gone; the top of the scale walks up in even steps.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "harmonicMinor",
            name: "Harmonic minor",
            degrees: HARMONIC_MINOR,
          }}
          b={{
            id: "melodicMinor",
            name: "Melodic minor",
            degrees: MELODIC_MINOR,
            spotlightOffset: MAJOR_SIXTH,
          }}
          defaultSide="b"
        />
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Harmonic: hear ♭6 → 7"
              offsets={[FLAT_SIXTH, MAJOR_SEVENTH]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Melodic: hear 6 → 7"
              offsets={[MAJOR_SIXTH, MAJOR_SEVENTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="one-flat-from-major">4. One key from major</H2>
        <P>
          Compare it with the major scale on the same root and only the third
          moves. Everything above the third — <Mono>4 5 6 7</Mono> — is major,
          unchanged; the scale is major with a minor floor. That is why it can
          sound so bright for a minor scale, and why jazz players, who use this
          form going both up and down, call it the <em>jazz minor</em>.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "melodicMinor",
            name: "Melodic minor",
            degrees: MELODIC_MINOR,
            spotlightOffset: FLAT_THIRD,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="up-and-down">5. Up one way, down another</H2>
        <P>
          Classical theory teaches melodic minor as two scales in one. Going{" "}
          <em>up</em>, the sixth and seventh are raised, so the melody leans
          into home. Coming <em>down</em>, there is nothing to lean toward, so
          both notes drop back and the scale descends as plain{" "}
          <LessonLink href="/scales/natural-minor">natural minor</LessonLink>.
          Press the two runs one after the other to hear the classical shape.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Up: melodic minor"
              offsets={MELODIC_OFFSETS}
              descend={false}
            />
            <PlayPatternButton
              label="Down: natural minor"
              offsets={NATURAL_MINOR_DESCENDING}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          A keyboard lock cannot be direction-dependent — a key is either in the
          scale or out — so every keyboard and comparer on this page uses the{" "}
          <em>ascending</em> form, the one jazz treats as the whole scale. When
          you read &ldquo;melodic minor&rdquo; elsewhere on this site, that is
          the form it means. The descending half is the natural minor, which has
          its own page.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">6. What to do with it</H2>
        <P>
          Keep the lock on and play over a held root. Settle on <Mono>1</Mono>,{" "}
          <Mono>♭3</Mono>, or <Mono>5</Mono>; climb through{" "}
          <Mono>6 → 7 → 1</Mono> when you want the minor key to arrive as firmly
          as major does. Then compare the three minors side by side —{" "}
          <LessonLink href="/scales/natural-minor">natural</LessonLink>,{" "}
          <LessonLink href="/scales/harmonic-minor">harmonic</LessonLink>, and
          this one — all opening on the same root: the same floor, three
          different ceilings.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play melodic minor"
              offsets={MELODIC_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
