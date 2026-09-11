/**
 * Harmonic minor, taught as "natural minor with one key moved."
 *
 * The page's job is twofold: teach the raised 7th on its own terms (the
 * pull toward home, the augmented second it opens), and set up the two
 * klezmer modes that share its notes — freygish and Ukrainian Dorian —
 * as "same keys, different home." Those pages take the story from here.
 *
 * Server component: prose in static HTML; widgets are client leaves.
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

// A minor is the all-white-key minor: the raised G♯ is the only black key,
// so the one changed note is the one black key on the keyboard.
const DEFAULT_ROOT_PC = 9;

const HARMONIC = degreesOf("harmonicMinor");
const NATURAL = degreesOf("minor");
const FREYGISH = degreesOf("phrygianDominant");
const UKRAINIAN = degreesOf("ukrainianDorian");

const HARMONIC_OFFSETS = HARMONIC.map((d) => d.offset);
const NATURAL_OFFSETS = NATURAL.map((d) => d.offset);

/** The raised seventh — the one key this lesson moves. */
const RAISED_SEVENTH = 11;
const FLAT_SIXTH = 8;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 3, label: "♭3", role: "lowered third — what makes it minor" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 8, label: "♭6", role: "lowered sixth" },
  { offset: 11, label: "7", role: "raised seventh — the changed note" },
];

const SOURCES = [
  {
    label:
      "Yonatan Malin et al., “Modes in Klezmer Music,” Music Theory Online 31.3 (2025) — the four klezmer modes and their frequencies in Beregovski’s collection",
    url: "https://www.mtosmt.org/issues/mto.25.31.3/mto.25.31.3.malin.html",
  },
  {
    label: "Josh Horowitz, “The Main Klezmer Modes” (KlezmerShack)",
    url: "https://www.klezmershack.com/articles/horowitz/horowitz.klezmodes.html",
  },
];

export function HarmonicMinorLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={HARMONIC}>
      <section className="mt-8" aria-label="Harmonic minor lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="natural-minor">1. Start from the scale you already know: natural minor</H2>
        <P>
          A <Term id="scale">scale</Term> is a short list of the twelve piano
          notes that a piece treats as home. The natural minor scale is the
          dark, settled one: in <RootName /> it runs{" "}
          <Mono>1 2 ♭3 4 5 ♭6 ♭7</Mono>. The flats mean &ldquo;one key lower
          than the major scale would have it&rdquo; — the lowered third is what
          makes any scale sound minor. Press <Mono>Play</Mono> and get the
          shape of it in your ear, because the next section changes exactly one
          of these notes.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave>
            <PlayPatternButton label="Play natural minor" offsets={NATURAL_OFFSETS} />
          </LessonToolbar>
          <ScaleKeyboard degrees={NATURAL} lockToScale />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="raise-the-seventh">2. Move one key: raise the seventh</H2>
        <P>
          Take the <Mono>♭7</Mono> — in <RootName /> that is{" "}
          <NoteAt offset={10} /> — and push it up one key to{" "}
          <NoteAt offset={RAISED_SEVENTH} />. Nothing else changes. That single
          move turns natural minor into <strong>harmonic minor</strong>:{" "}
          <Mono>1 2 ♭3 4 5 ♭6 7</Mono>. Flip the toggle and watch one key go dark
          while its neighbour lights up, then play both runs back to back. The
          top of the scale is where you will hear it.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "natural", name: "Natural minor", degrees: NATURAL }}
          b={{
            id: "harmonic",
            name: "Harmonic minor",
            degrees: HARMONIC,
            spotlightOffset: RAISED_SEVENTH,
          }}
        />
        <P>
          Why does it matter so much? The raised <Mono>7</Mono> now sits{" "}
          <em>one</em> key below the <Term id="root">root</Term>. A note that
          close to home leans into it — play <NoteAt offset={RAISED_SEVENTH} />{" "}
          and your ear is already waiting for <RootName />. Musicians call that
          note a <em>leading tone</em>. Natural minor has no leading tone (its{" "}
          <Mono>♭7</Mono> is two keys away); harmonic minor borrows one from
          the major scale.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear 7 lean into 1"
              offsets={[RAISED_SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="scale-degrees">3. Counting from home: the seven degrees</H2>
        <P>
          Every note in a scale is named by how far above the root it sits —
          its <Term id="scale-degree">scale degree</Term>. Count keys to the
          right of the root, black and white alike; each key is a{" "}
          <Term id="steps">half step</Term>. The table is live: change the root
          at the top and the third column follows.
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={RAISED_SEVENTH} />
        <P>
          Click a chip to hear each degree in <RootName />. The keyboard labels
          black keys with sharps and this page spells the scale one letter per
          degree, so the raised seventh reads <NoteAt offset={RAISED_SEVENTH} />{" "}
          even where a flat name would be the same key.
        </P>
        <DegreeStrip
          degrees={HARMONIC}
          spotlightOffset={RAISED_SEVENTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="augmented-second">4. The gap it opens: the augmented second</H2>
        <P>
          Moving the seventh up leaves a hole behind it. From{" "}
          <Mono>♭6</Mono> (<NoteAt offset={FLAT_SIXTH} />) to <Mono>7</Mono> (
          <NoteAt offset={RAISED_SEVENTH} />) is now three half steps — wider
          than any step in the major scale, which never goes past two. Because
          it is still written as one step from one degree to the next, it has a
          name of its own: the{" "}
          <Term id="augmented-second">augmented second</Term>. On the keyboard
          it covers the same distance as a minor third, but it behaves like a
          step — you walk it, you do not leap it.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear ♭6 → 7 → 1"
              offsets={[FLAT_SIXTH, RAISED_SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          This is the sound people describe as &ldquo;Eastern&rdquo; or
          &ldquo;exotic&rdquo; when they meet it in Western music. Classical
          composers treated it as something to avoid in a melody — the melodic
          minor scale exists to smooth it away by raising the sixth too.
          Eastern Ashkenazi prayer, <Word id="klezmer">klezmer</Word>,
          Romanian and Greek dance music, and flamenco went the other way and
          made the leap the point.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="why-harmonic">5. Why it is called &ldquo;harmonic&rdquo;</H2>
        <P>
          Build a three-note chord on the fifth degree — <Mono>5</Mono>,{" "}
          <Mono>7</Mono>, and the <Mono>2</Mono> above it. In natural minor that
          chord is minor. In harmonic minor the raised <Mono>7</Mono> makes it
          major, and a major chord on the fifth pulls hard toward the root.
          Western harmony wanted that pull in minor keys, and raised the
          seventh to get it. The scale is named after the chord it was built to
          supply: the <Term id="dominant">dominant</Term>.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear the 5 chord, then home"
              offsets={[7, RAISED_SEVENTH, 14, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="two-homes">6. Same keys, different home: freygish and Ukrainian Dorian</H2>
        <P>
          Here is the reason this page comes first. Take the seven keys of{" "}
          <RootName /> harmonic minor and, without adding or removing any,
          call the <Mono>5</Mono> home instead. You now have{" "}
          <LessonLink href="/scales/freygish">freygish</LessonLink> — the
          signature mode of klezmer, also called{" "}
          <Word id="ahava-rabbah">Ahava Rabbah</Word> — starting on{" "}
          <NoteAt offset={7} />. The augmented second is the same two keys;
          it now sits between the new scale&rsquo;s <Mono>♭2</Mono> and{" "}
          <Mono>3</Mono>. Flip the toggle: nothing turns on or off, only the
          green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "harmonic", name: "Harmonic minor", degrees: HARMONIC }}
          b={{ id: "freygish", name: "Freygish", degrees: FREYGISH, rootOffset: 7 }}
        />
        <P>
          Do it again with the <Mono>4</Mono> as home (<NoteAt offset={5} />) and
          you get{" "}
          <LessonLink href="/scales/ukrainian-dorian">Ukrainian Dorian</LessonLink>{" "}
          — <Word id="misheberakh">Mi Sheberakh</Word> to klezmer players, the
          mode of the <Term id="doina">doina</Term>. The leap now sits between{" "}
          <Mono>♭3</Mono> and <Mono>♯4</Mono>.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "harmonic", name: "Harmonic minor", degrees: HARMONIC }}
          b={{
            id: "ukrainian",
            name: "Ukrainian Dorian",
            degrees: UKRAINIAN,
            rootOffset: 5,
          }}
        />
        <P>
          One honesty note. Western theory files freygish and Ukrainian Dorian
          as the fifth and fourth <Term id="mode">modes</Term> of harmonic
          minor — that is the relationship these keyboards show, and it is
          true of the notes. Klezmer musicians do not think of them that way.
          They are prayer modes in their own right, named after the chants sung
          in them, and in the dance collections they are at least as common as
          plain minor. The harmonic-minor framing is a map, not the territory.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and improvise on the green keys. End phrases on{" "}
          <Mono>1</Mono>; approach it from <Mono>7</Mono> underneath and feel
          the pull. Walk <Mono>♭6 → 7</Mono> slowly and let the wide step be
          strange. Then go hear the same seven keys from their other two homes —{" "}
          <LessonLink href="/scales/freygish">What is the freygish scale?</LessonLink>{" "}
          and{" "}
          <LessonLink href="/scales/ukrainian-dorian">
            What is the Ukrainian Dorian scale?
          </LessonLink>{" "}
          — and{" "}
          <LessonLink href="/genres/klezmer">What is klezmer?</LessonLink> for
          the music that lives in them.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton label="Play harmonic minor" offsets={HARMONIC_OFFSETS} />
          </LessonToolbar>
        </div>

        <Sources items={SOURCES} />
      </section>
    </ScaleLessonProvider>
  );
}
