/**
 * Ukrainian Dorian / Mi Sheberakh, taught as "Dorian with one key raised."
 *
 * Third page of the harmonic-minor family. It leans on two comparisons
 * the comparer can play: Dorian → Ukrainian Dorian (raise the 4th) and the
 * re-homings onto harmonic minor and freygish (same keys, home moves). It
 * is candid that in living klezmer the raised 4th is a tendency, not a law.
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

// D is the classroom key: D Dorian is all white keys, so the raised G♯ is
// the one black key — the one changed note is the one you can see.
const DEFAULT_ROOT_PC = 2;

const UKRAINIAN = degreesOf("ukrainianDorian");
const DORIAN = degreesOf("dorian");
const HARMONIC = degreesOf("harmonicMinor");
const FREYGISH = degreesOf("phrygianDominant");

const UKRAINIAN_OFFSETS = UKRAINIAN.map((d) => d.offset);

/** The raised fourth — the one key that makes this scale itself. */
const SHARP_FOURTH = 6;
const FLAT_THIRD = 3;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 3, label: "♭3", role: "lowered third — what makes it minor" },
  { offset: 6, label: "♯4", role: "raised fourth — the changed note" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "major sixth — Dorian's bright spot" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

const SOURCES = [
  {
    label:
      "Yonatan Malin et al., “Modes in Klezmer Music,” Music Theory Online 31.3 (2025) — “raised fourth / altered Dorian / mi sheberakh”; a stable mode in klezmer, an excursion in cantorial practice; counts in Beregovski’s freylekhs; comparison with makam nikriz",
    url: "https://www.mtosmt.org/issues/mto.25.31.3/mto.25.31.3.malin.html",
  },
  {
    label:
      "Josh Horowitz, “The Main Klezmer Modes” (KlezmerShack) — Mi Sheberakh / Av Horachamim; raised and natural 4th interchangeable; begun on its 2nd degree it shares pitches with Ahava Rabboh",
    url: "https://www.klezmershack.com/articles/horowitz/horowitz.klezmodes.html",
  },
  {
    label:
      "Wikipedia, “Ukrainian Dorian scale” — names across Jewish, Ukrainian (Hutsul), Romanian, and Greek music",
    url: "https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale",
  },
  {
    label: "Wikipedia, “Mi Shebeirach” — the prayer and its Hebrew spelling",
    url: "https://en.wikipedia.org/wiki/Mi_Shebeirach",
  },
];

export function UkrainianDorianLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={UKRAINIAN}>
      <section className="mt-8" aria-label="Ukrainian Dorian lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard is locked to <RootName /> Ukrainian Dorian. Green keys
          are in the <Term id="scale">scale</Term>; red dots stay silent. Press{" "}
          <Mono>Play</Mono>. It starts like an ordinary minor scale and then, on
          the fourth note, lifts higher than you expect — a stretch, and then
          the fifth lands as if nothing happened. That lift is the scale.
        </P>
        <P>
          The names. Western theory says <em>Ukrainian Dorian</em>, or Dorian
          ♯4, or Romanian minor. <Word id="klezmer">Klezmer</Word> musicians say{" "}
          <Word id="misheberakh">Mi Sheberakh</Word> — &ldquo;He who
          blessed&rdquo; — after a synagogue prayer sung in it, and it is the
          mode of the <Term id="doina">doina</Term>, the free-rhythm lament.
          Ukrainians call it the Hutsul mode, Greeks hear it as Nikriz. Same
          seven keys wherever the name comes from.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={UKRAINIAN_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={UKRAINIAN} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: the seven degrees</H2>
        <P>
          Notes are named by distance above the <Term id="root">root</Term> —
          their <Term id="scale-degree">scale degrees</Term>. Count keys to the
          right of <RootName />, black and white alike; each key is a{" "}
          <Term id="steps">half step</Term>. Plain numbers are the major
          scale&rsquo;s notes; a <Term id="flats-and-sharps">flat</Term> (
          <Mono>♭</Mono>) lowers one by a key and a sharp (<Mono>♯</Mono>)
          raises one. This scale has one of each kind of alteration that
          matters: flats on the third and seventh, and a sharp on the fourth.
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={SHARP_FOURTH} />
        <P>
          Why <Mono>♯4</Mono> and not <Mono>♭5</Mono>? They are the same key.
          The blues scale calls it <Mono>♭5</Mono> because it keeps the plain{" "}
          <Mono>5</Mono> right next door. Here there is no plain <Mono>4</Mono>{" "}
          at all — the fourth <em>moved</em> — so the key is spelled as the
          raised fourth, and the scale keeps one letter per degree:{" "}
          <NoteAt offset={SHARP_FOURTH} />, not the flat name for the same key.
          Click the chips to hear each degree.
        </P>
        <DegreeStrip
          degrees={UKRAINIAN}
          spotlightOffset={SHARP_FOURTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="from-dorian">3. Start from Dorian, raise one key</H2>
        <P>
          <strong>Dorian</strong> is a minor scale with a bright spot: its sixth
          is major, not lowered — <Mono>1 2 ♭3 4 5 6 ♭7</Mono>. In <RootName />{" "}
          it is the scale you get from{" "}
          <LessonLink href="/scales/dorian">
            the white keys started on D
          </LessonLink>
          . Take Dorian and push its fourth up one key: <NoteAt offset={5} />{" "}
          becomes <NoteAt offset={SHARP_FOURTH} />. Everything else stays. Flip
          the toggle and watch one key go dark while its neighbour lights; play
          both and listen to the fourth note of the run.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "dorian", name: "Dorian", degrees: DORIAN }}
          b={{
            id: "ukrainian",
            name: "Ukrainian Dorian",
            degrees: UKRAINIAN,
            spotlightOffset: SHARP_FOURTH,
          }}
          defaultSide="b"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="augmented-second">4. The stretch: an augmented second</H2>
        <P>
          Raising the fourth opens a gap below it. From <Mono>♭3</Mono> (
          <NoteAt offset={FLAT_THIRD} />) to <Mono>♯4</Mono> (
          <NoteAt offset={SHARP_FOURTH} />) is three half steps — wider than any
          step in the major scale. Because it still runs from one degree to the
          next, it counts as a second, a widened one: the{" "}
          <Term id="augmented-second">augmented second</Term>. Then{" "}
          <Mono>♯4</Mono> sits one key under the <Mono>5</Mono> and leans up
          into it, the way a leading tone leans into the root. The scale has a
          little pull toward its fifth built in.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear ♭3 → ♯4 → 5"
              offsets={[FLAT_THIRD, SHARP_FOURTH, 7]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          This is the same interval that freygish puts between its{" "}
          <Mono>♭2</Mono> and <Mono>3</Mono>, and harmonic minor between{" "}
          <Mono>♭6</Mono> and <Mono>7</Mono>. Three scales, one leap, in three
          different places — which is a clue.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">5. Same keys, different home</H2>
        <P>
          Take the seven keys of <RootName /> Ukrainian Dorian and, without
          turning any on or off, call the <Mono>5</Mono> home. You are now
          playing{" "}
          <LessonLink href="/scales/harmonic-minor">harmonic minor</LessonLink>{" "}
          from <NoteAt offset={7} />. Flip the toggle: nothing changes on the
          keyboard except which key wears the green <Mono>1</Mono>.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "ukrainian", name: "Ukrainian Dorian", degrees: UKRAINIAN }}
          b={{
            id: "harmonic",
            name: "Harmonic minor",
            degrees: HARMONIC,
            rootOffset: 7,
          }}
        />
        <P>
          Call the <Mono>2</Mono> home instead (<NoteAt offset={2} />) and you
          are in <LessonLink href="/scales/freygish">freygish</LessonLink>,
          klezmer&rsquo;s best-known mode. Josh Horowitz puts it plainly: start
          Mi Sheberakh on its second degree and you have{" "}
          <Word id="ahava-rabbah">Ahava Rabbah</Word>. In real tunes the two
          trade places constantly — a doina will sit in Mi Sheberakh and cadence
          in freygish a step below.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "ukrainian", name: "Ukrainian Dorian", degrees: UKRAINIAN }}
          b={{
            id: "freygish",
            name: "Freygish",
            degrees: FREYGISH,
            rootOffset: 2,
          }}
        />
        <P>
          Western theory calls this scale the fourth <Term id="mode">mode</Term>{" "}
          of harmonic minor. True of the notes, and handy on a keyboard. Klezmer
          does not derive it from anything: it is a prayer mode with its own
          name, its own repertoire, and its own habits.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="tendency">6. A tendency, not a law</H2>
        <P>
          Two honest notes. First, the raised fourth is less fixed in practice
          than the lock on this page makes it look. Horowitz observes that in
          klezmer the raised and natural fourth are often used interchangeably,
          or in alternating sections, and Romanian and Ukrainian players will
          even swap the minor third for a major one. The scale you are playing
          is the version you would write down; the version you would hear bends.
        </P>
        <P>
          Second, where it lives. In the synagogue, cantorial scholars describe
          Mi Sheberakh less as a home than as an excursion — a colour a chant
          passes through. In klezmer it is a stable home: in Moshe
          Beregovski&rsquo;s collection about one freylekhs in seven is in the
          raised-fourth mode from start to finish, and the doina makes it a
          whole world. Since the 1980s klezmer players have borrowed the
          prayer&rsquo;s name for it; the notes are older than the label.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and improvise. Aim phrases at <Mono>5</Mono> by way
          of <Mono>♯4</Mono> underneath, and let <Mono>♭3 → ♯4</Mono> be slow
          and wide. Then unlock the keyboard and try the plain fourth (
          <NoteAt offset={5} />) in the same phrase — that flicker between the
          two is how the mode actually behaves. When you are ready,{" "}
          <LessonLink href="/genres/klezmer">What is klezmer?</LessonLink> has
          the dances and the doina this scale was made for.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play Ukrainian Dorian"
              offsets={UKRAINIAN_OFFSETS}
            />
          </LessonToolbar>
        </div>

        <Sources items={SOURCES} />
      </section>
    </ScaleLessonProvider>
  );
}
