/**
 * Phrygian, taught as freygish's foil.
 *
 * Natural minor with the second lowered: the ♭2 one key above home is the
 * whole story, and the page plays it three ways — the note leaning down,
 * natural minor → Phrygian (swap), E Phrygian re-homed as C major (mode).
 * It closes by raising the third and handing off to /scales/freygish,
 * because Phrygian is close to "the Middle Eastern sound" and is not it.
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

// E is the classroom key: E Phrygian is all white keys (C major from E), and
// it is the root the freygish page also opens on, so the hand-off is
// key-for-key.
const DEFAULT_ROOT_PC = 4;

const PHRYGIAN = degreesOf("phrygian");
const NATURAL_MINOR = degreesOf("minor");
const MAJOR = degreesOf("major");
const FREYGISH = degreesOf("phrygianDominant");
const PHRYGIAN_OFFSETS = PHRYGIAN.map((d) => d.offset);

/** The lowered second — the one key this lesson is about. */
const FLAT_SECOND = 1;
const MAJOR_SECOND = 2;
const FLAT_THIRD = 3;
const MAJOR_THIRD = 4;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 1, label: "♭2", role: "lowered second — one key above home" },
  { offset: 3, label: "♭3", role: "lowered third — what makes it minor" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 8, label: "♭6", role: "lowered sixth" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

export function PhrygianLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={PHRYGIAN}>
      <section className="mt-8" aria-label="Phrygian lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> Phrygian. Keys with a
          green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono> and listen to the
          very first step. Every other scale on this site opens with a whole
          step or wider. Phrygian opens with a half step — the smallest move a
          piano can make — and that cramped first step colours everything after
          it.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={PHRYGIAN_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={PHRYGIAN} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: four flats</H2>
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
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={FLAT_SECOND} />
        <P>
          Four of the seven are lowered. Three of them — <Mono>♭3</Mono>,{" "}
          <Mono>♭6</Mono>, <Mono>♭7</Mono> — are the ones natural minor lowers
          too; they make the scale minor. The fourth is the one that makes it
          Phrygian: the <Mono>♭2</Mono>, in <RootName /> the key{" "}
          <NoteAt offset={FLAT_SECOND} />, sitting directly above home. Click a
          chip to hear each degree.
        </P>
        <DegreeStrip
          degrees={PHRYGIAN}
          spotlightOffset={FLAT_SECOND}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="flat-two">3. The ♭2: a note that leans on home</H2>
        <P>
          Play <NoteAt offset={FLAT_SECOND} /> and hold it. It cannot sit still.
          A note one key above the root is pulled down onto it the way the major
          scale&rsquo;s <Mono>7</Mono> is pulled up — Phrygian has a leading
          tone, but it leads from <em>above</em>. Press{" "}
          <Mono>Hear ♭2 fall</Mono>: that downward sigh is the sound most people
          mean when they call a scale &ldquo;Spanish.&rdquo;
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear ♭2 fall to 1"
              offsets={[FLAT_SECOND, 0]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          Compare it with natural minor, which has the same three minor flats
          but a plain <Mono>2</Mono>, two keys above home. Move that one note
          down — in <RootName />,{" "}
          <NoteAt offset={MAJOR_SECOND} degrees={NATURAL_MINOR} /> becomes{" "}
          <NoteAt offset={FLAT_SECOND} /> — and natural minor becomes Phrygian.
          Flip the toggle and play both. Natural minor opens with a step you can
          walk. Phrygian opens with a step you fall down.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "natural", name: "Natural minor", degrees: NATURAL_MINOR }}
          b={{
            id: "phrygian",
            name: "Phrygian",
            degrees: PHRYGIAN,
            spotlightOffset: FLAT_SECOND,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">
          4. Same keys, different home: a major scale from its third
        </H2>
        <P>
          Now the map view. Take the seven keys of <RootName /> Phrygian and,
          without turning any on or off, call the <Mono>♭6</Mono> home instead.
          You are now playing the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> on{" "}
          <NoteAt offset={8} />. In <Mono>E</Mono> that is <Mono>C</Mono> major
          — the same white keys, settling somewhere bright. Flip the toggle and
          only the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "phrygian", name: "Phrygian", degrees: PHRYGIAN }}
          b={{ id: "major", name: "Major", degrees: MAJOR, rootOffset: 8 }}
        />
        <P>
          Western theory calls Phrygian the third <Term id="mode">mode</Term> of
          the major scale — the major scale started from its third degree. The
          half step that opens Phrygian is the major scale&rsquo;s{" "}
          <Mono>3 → 4</Mono>, heard from a different home. Same two keys,
          entirely different job.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="fifth-position">5. On the harmonica: fifth position</H2>
        <P>
          A ten-hole diatonic harmonica is built around one major scale. A
          &ldquo;C harp&rdquo; played in E — the key a major third up — is
          playing E Phrygian, and harmonica players call that{" "}
          <em>fifth position</em>. It is far less common than the blues
          player&rsquo;s second position, and the reason is exactly the ♭2: most
          of the tunes a harp gets pulled out for do not want that note. When
          they do, the{" "}
          <LessonLink href="/harmonica-lab/v2?position=5">
            Harmonica Lab
          </LessonLink>{" "}
          shows which holes give the scale in fifth position for any harp.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="raise-the-third">
          6. Close, but not the sound: raise the third
        </H2>
        <P>
          Phrygian is often labelled &ldquo;Spanish&rdquo; or &ldquo;Middle
          Eastern,&rdquo; and the label is half right. The ♭2 is in the right
          place. But the scale most flamenco, klezmer, and Arabic-influenced
          music actually leans on has one more change: a <em>major</em> third
          instead of the minor one. Raise the <Mono>♭3</Mono> — in <RootName />,{" "}
          <NoteAt offset={FLAT_THIRD} /> becomes{" "}
          <NoteAt offset={MAJOR_THIRD} degrees={FREYGISH} /> — and Phrygian
          becomes <LessonLink href="/scales/freygish">freygish</LessonLink>,
          also called Phrygian dominant. Flip the toggle and listen to the
          second step of the run. Phrygian walks up gently. Freygish stretches —
          the gap from <Mono>♭2</Mono> to <Mono>3</Mono> is now an{" "}
          <Term id="augmented-second">augmented second</Term>, and that stretch
          is the sound.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "phrygian", name: "Phrygian", degrees: PHRYGIAN }}
          b={{
            id: "freygish",
            name: "Freygish",
            degrees: FREYGISH,
            spotlightOffset: MAJOR_THIRD,
          }}
        />
        <P>
          So think of Phrygian as the doorway. It has the leaning ♭2 and none of
          the stretch, which makes it darker and more even-tempered than
          freygish — good for a brooding metal riff or a slow modal vamp, less
          good for a wedding dance. When you want the leap,{" "}
          <LessonLink href="/scales/freygish">
            What is the freygish scale?
          </LessonLink>{" "}
          picks up exactly here, in the same key.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and play the green keys over a held root. End phrases
          on <Mono>1</Mono> and arrive from <Mono>♭2</Mono> above — that is the
          signature. Try holding <Mono>1</Mono> in the low octave while the
          right hand walks <Mono>♭2 1 ♭2 1</Mono>: the smallest possible
          two-note riff, and unmistakably this mode. Then decide whether you
          wanted the stretch after all, and go raise the third.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play Phrygian"
              offsets={PHRYGIAN_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
