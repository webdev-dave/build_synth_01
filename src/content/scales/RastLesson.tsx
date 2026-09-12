/**
 * Rast — the foundational Arabic maqam, on a piano that has been bent.
 *
 * Built the way Middle Eastern keyboardists actually play it: the same
 * white keys as C major, with every E and B retuned a quarter tone flat by
 * the tuning strip under the keyboard. The page opens with the switches
 * already pressed (ScaleLessonProvider does that for any scale with cents),
 * shows the "same keys, bent pitch" comparer against C major, puts the two
 * twelve-key stand-ins next to it, and is candid that −50 cents is a
 * keyboard setting, not a measurement.
 *
 * Server component: prose ships as static HTML; widgets are client leaves.
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

// C — the tonic Rast is taught on ("Rast" is also the old name of the note
// C), and the key where the two bent notes are E and B, the switches every
// Arabic-market keyboard preset presses first.
const DEFAULT_ROOT_PC = 0;

const RAST = degreesOf("rast");
const MAJOR = degreesOf("major");
const MIXOLYDIAN = degreesOf("mixolydian");
const RAST_OFFSETS = RAST.map((d) => d.offset);

const HALF_FLAT_THIRD = 4;
const FLAT_SEVENTH = 10;
const HALF_FLAT_SEVENTH = 11;

/** Jins Rast: the five-note cell the maqam is built from. */
const JINS_RAST = [0, 2, 4, 5, 7];
/** Jins Nahawand on the fifth — the upper cell Rast often descends through. */
const JINS_NAHAWAND_ON_5 = [7, 9, 10, 12, 14];

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  {
    offset: 4,
    label: "½♭3",
    role: "half-flat third — a quarter tone below the piano's 3",
    cents: -50,
  },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "sixth" },
  {
    offset: 11,
    label: "½♭7",
    role: "half-flat seventh — a quarter tone below the piano's 7",
    cents: -50,
  },
];

const SOURCES = [
  {
    label:
      "Maqam World (Farraj & Abu Shumays) — Maqam Rast: root jins Rast, then either upper Rast or Nahawand on the fifth",
    url: "https://maqamworld.com/en/maqam/rast.php",
  },
  {
    label:
      "Sami Abu Shumays, “Maqam Analysis: A Primer” — why half-flat is a category learned by ear, not a fixed 24-tone pitch",
    url: "https://maqamlessons.com/analysis/media/MaqamAnalysisAPrimer_2013WebFormat.pdf",
  },
  {
    label:
      "Scott Marcus, “The Interface between Theory and Practice: Intonation in Arab Music,” Asian Music 24/2 (1993)",
    url: "https://doi.org/10.2307/834466",
  },
];

export function RastLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={RAST}>
      <section className="mt-8" aria-label="Rast lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it — on a bent piano</H2>
        <P>
          Look under the keyboard before you press anything. There is a strip of
          twelve switches, one per note name, and two of them —{" "}
          <NoteAt offset={HALF_FLAT_THIRD} degrees={MAJOR} /> and{" "}
          <NoteAt offset={HALF_FLAT_SEVENTH} degrees={MAJOR} /> — are already
          lit green. Every key with those names has been pulled a quarter tone
          flat, and the key labels say so: <NoteAt offset={HALF_FLAT_THIRD} />,{" "}
          <NoteAt offset={HALF_FLAT_SEVENTH} />. Now press <Mono>Play</Mono>.
          The shape is a major scale. The sound is not. Two notes sit in the
          crack between the piano&rsquo;s keys, and those two notes are the
          sound of an entire tradition.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton label="Play the scale" offsets={RAST_OFFSETS} />
          </LessonToolbar>
          <ScaleKeyboard degrees={RAST} />
        </div>
        <P>
          This is not a trick of ours. It is what an Arabic-market keyboard
          does: Korg and Yamaha instruments sold across the Middle East carry a
          &ldquo;scale&rdquo; or &ldquo;quarter tone&rdquo; panel with exactly
          these switches, and Rast is the preset a player reaches for first.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: two half-flats</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it (and the switches move
          with it: Rast on <Mono>G</Mono> bends <Mono>B</Mono> and{" "}
          <Mono>F♯</Mono>). The other notes are named by how far above the root
          they sit: their <Term id="scale-degree">scale degrees</Term>. A{" "}
          <Term id="flats-and-sharps">flat</Term> lowers a note by one key — a{" "}
          <Term id="steps">half step</Term>. A <em>half-flat</em>, written{" "}
          <Mono>½♭</Mono>, lowers it by half of that: a quarter tone, a distance
          the piano has no key for.
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={HALF_FLAT_THIRD} />
        <P>
          Five plain numbers and two half-flats. Click a chip to hear each
          degree in <RootName /> — the <Mono>½♭3</Mono> and <Mono>½♭7</Mono>{" "}
          will sound slightly, deliberately &ldquo;off&rdquo; to an ear raised
          on pianos. Stay with them.
        </P>
        <DegreeStrip
          degrees={RAST}
          spotlightOffset={HALF_FLAT_THIRD}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys-bent">
          3. Same keys, bent pitch: major becomes Rast
        </H2>
        <P>
          This comparer does something the others on this site do not. Flip it
          and no key turns on or off — the two scales use the same seven keys.
          Instead, watch the tuning strip under the main keyboard above: two
          switches release, and the keys go back to the piano&rsquo;s own{" "}
          <NoteAt offset={HALF_FLAT_THIRD} degrees={MAJOR} /> and{" "}
          <NoteAt offset={HALF_FLAT_SEVENTH} degrees={MAJOR} />. Flip again and
          they press. Play both runs and listen only to the third and the
          seventh.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "rast",
            name: "Rast",
            degrees: RAST,
            spotlightOffset: HALF_FLAT_THIRD,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="stand-ins">4. What twelve keys get wrong</H2>
        <P>
          Without the switches, a piano has two ways to fake Rast, and both
          miss. The{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> puts
          the third and seventh a quarter tone too <em>high</em>.{" "}
          <LessonLink href="/scales/mixolydian">Mixolydian</LessonLink> fixes
          the seventh by lowering it a whole key — now a quarter tone too{" "}
          <em>low</em> — and leaves the third high. Rast sits exactly between
          the two. With the switches on, press the three sevenths in turn.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Mixolydian: ♭7 → 1"
              offsets={[FLAT_SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Rast: ½♭7 → 1"
              offsets={[HALF_FLAT_SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          Mixolydian is the nearest twelve-key shape when the piano cannot bend
          — a harmonica player&rsquo;s second position, a guitarist&rsquo;s
          dominant scale — and it is what most Western transcriptions of Rast
          melodies settle for. Its page opens on <Mono>G</Mono>; set this
          page&rsquo;s root to <Mono>G</Mono> and the two share every key but
          the bent <Mono>B</Mono>.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="how-flat">5. How flat is half-flat?</H2>
        <P>
          One honest sentence, then the detail.{" "}
          <em>
            The fifty cents on these switches is a keyboard setting, not a
            measurement; the real pitch is learned by ear and varies by region
            and by player.
          </em>{" "}
          Measured Rast thirds cluster a little below the exact quarter tone —
          roughly 345 to 355 cents above the root, against the piano&rsquo;s 400
          — with Egyptian playing generally a shade lower and Syrian a shade
          higher, and the Turkish <Word id="maqam">makam</Word> of the same name tuned closer to a major
          third. Practitioners describe not one E-half-flat but several, each
          belonging to a particular maqam. The switch gets you into the
          neighbourhood; your ear does the rest.
        </P>
        <P>
          Try it: hold <NoteAt offset={HALF_FLAT_THIRD} /> on the keyboard, then
          click its switch off and on while it rings. That quarter-tone drop is
          the whole distance between a piano playing a major scale and a piano
          playing Rast.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="more-than-a-scale">6. A maqam is more than a scale</H2>
        <P>
          What this page can show is Rast&rsquo;s <em>scale</em>. The maqam is
          bigger: it is built from small cells called{" "}
          <Word id="jins">
            <em>ajnas</em>
          </Word>
          , and it has
          a customary way of moving through them. The lower cell is{" "}
          <em>jins Rast</em> — <Mono>1 2 ½♭3 4 5</Mono>, five notes ending on
          the fifth. On top of that fifth sits a second cell, and here Rast has
          two habits: going up it is usually another Rast, which gives the{" "}
          <Mono>½♭7</Mono>; coming down it often becomes{" "}
          <Word id="nahawand">
            <em>Nahawand</em>
          </Word>{" "}
          —{" "}
          <Mono>5 6 ♭7 1 2</Mono> — so the seventh drops to a full flat,{" "}
          <NoteAt offset={FLAT_SEVENTH} degrees={MIXOLYDIAN} />, on the way
          home. A keyboard lock cannot be direction-dependent, so this page
          locks to the ascending form; press the two cells and hear the
          maqam&rsquo;s two sevenths.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Jins Rast: 1 → 5"
              offsets={JINS_RAST}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Jins Nahawand on 5: 5 → 2"
              offsets={JINS_NAHAWAND_ON_5}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock and the switches on, hold <RootName /> low, and play the
          green keys slowly, coming back to <Mono>1</Mono> and <Mono>5</Mono>.
          Let <Mono>½♭3</Mono> ring against the root until it stops sounding
          wrong and starts sounding like a colour. Then take the switches to the{" "}
          <LessonLink href="/synth/v2">synth</LessonLink>, where the same strip
          lives under every keyboard, and try the other presets —{" "}
          <Word id="bayati">Bayati</Word> bends
          the second instead of the third. The{" "}
          <LessonLink href="/scales/freygish">freygish</LessonLink> and{" "}
          <LessonLink href="/scales/double-harmonic">
            double harmonic
          </LessonLink>{" "}
          pages meet maqam from the other side: the{" "}
          <Word id="hijaz">Hijaz</Word> family, whose notes a
          piano <em>can</em> reach.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton label="Play Rast" offsets={RAST_OFFSETS} />
          </LessonToolbar>
        </div>

        <Sources items={SOURCES} />
      </section>
    </ScaleLessonProvider>
  );
}
