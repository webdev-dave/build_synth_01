/**
 * "Where did klezmer come from?" — the body of the /history/klezmer article.
 *
 * Server-rendered prose (no "use client") so quotes and footnotes are in the
 * static HTML. Sources are the ones declared on the registry entry, so the
 * inline `[n]` footnotes and the bibliography stay in one numbering.
 *
 * Editorial stance (per the module plan): quote briefly, attribute, link out,
 * and don't launder legend as fact — the klezmer story is full of lore
 * (wandering fiddlers, single "kings" of the clarinet); where the record is
 * thinner than the legend, say so.
 */
import Link from "next/link";

import { getArticle } from "@/lib/history/registry";
import { Blockquote, Cite, SourceList } from "@/components/history/citations";
import { SongJumpNav } from "@/components/history/SongJumpNav";
import { SongLink } from "@/components/history/SongLink";
import { Term } from "@/components/concepts/Term";
import { ArtistLink } from "@/components/catalog/ArtistLink";
import { Word } from "@/components/words/Word";

const SOURCES = getArticle("klezmer")?.sources ?? [];

/**
 * Songs named in this article, in appearance order — the data lives in the
 * catalog (`src/lib/catalog/songs.ts`); we just list the slugs so the jump-nav
 * and the inline `<SongLink id>`s resolve to the same entries.
 */
const SONG_IDS = [
  "heyser-bulgar",
  "der-shtiler-bulgar",
  "bei-mir-bistu-shein",
];

/** Bind the shared footnote to this article's source ordering. */
function Ref({ id }: { id: string }) {
  return <Cite id={id} sources={SOURCES} />;
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-10 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function KlezmerHistory() {
  return (
    <article className="mt-8">
      <SongJumpNav ids={SONG_IDS} />

      <H2 id="the-word">A musician before it was a music</H2>
      <P>
        For most of its history, <em>klezmer</em> named a person, not a genre.
        The Yiddish word comes from the Hebrew{" "}
        <Word id="kley-zemer">
          <em>kley zemer</em>
        </Word>{" "}
        — &ldquo;vessels of song,&rdquo; the instruments themselves — and by
        extension the professional who played them (plural{" "}
        <em>klezmorim</em>).<Ref id="britannica-klezmer" /> From the later
        sixteenth century, Jewish musicians in Bohemia and the
        Polish&ndash;Lithuanian Commonwealth organized into guilds like other
        tradesmen, and the new word carried the new respectability.
        <Ref id="yivo-traditional" />
      </P>
      <Blockquote
        attribution="YIVO Encyclopedia of Jews in Eastern Europe"
        cite="yivo-traditional"
        sources={SOURCES}
      >
        &ldquo;The formation of guilds raised the social status of Jewish
        musicians, and led to the abandonment of the older term <em>leyts</em>{" "}
        (scoffer, clown) &hellip; in favor of the new, more respectable term{" "}
        <em>klezmer</em> (from <em>kele zemer</em>, musical instruments or
        vessels of song &hellip;), designating exclusively an
        instrumentalist.&rdquo;
      </Blockquote>
      <P>
        Calling the <em>music</em> &ldquo;klezmer&rdquo; is startlingly recent
        — Britannica dates the common usage to about 1980, when the revival
        needed a name for what it was reviving.<Ref id="britannica-klezmer" />{" "}
        The musicians themselves would have said they played{" "}
        <Word id="yidishe-muzik">
          <em>yidishe muzik</em>
        </Word>{" "}
        — <Word id="freylekhs">freylekhs</Word>,{" "}
        <Word id="bulgar">bulgars</Word>, and <Word id="sher">shers</Word> for
        weddings.
        What they meant by that is the story of this page.
      </P>

      <H2 id="predecessors">
        Predecessors: the synagogue, the nigun, and the neighbors&rsquo; dances
      </H2>
      <P>
        Klezmer did not spring from nowhere, and it was never sealed off from
        the music around it. Its oldest layer is sacred and vocal: the chant of
        the synagogue, whose prayer <Term id="mode">modes</Term> the wedding
        bands carried into instrumental music. The most famous of them is
        called <Term id="freygish">Ahava Rabbah</Term> after the prayer sung
        in it — the same scale klezmorim knew in Yiddish as{" "}
        <Term id="freygish">freygish</Term>.<Ref id="stroum-jewish" /> Next to
        the liturgy sat the Hasidic <Word id="nigun"><em>nigun</em></Word> —
        wordless, repeating melodies sung to reach ecstasy — a living
        reservoir of tunes that instrumentalists drew on freely.
        <Ref id="yivo-traditional" />
      </P>
      <P>
        The secular layer came from the neighbors. In the towns of Moldova,
        Ukraine, and Galicia, Jewish musicians worked alongside — often in the
        same bands as — the Rom <Word id="lautari"><em>lautari</em></Word>,
        and the dance repertoire shows it: the <Word id="hora"><em>hora</em></Word>,
        the <Word id="sirba"><em>sirba</em></Word>, the <em>bulgar</em>,
        and the free-time <Term id="doina">doina</Term> all came into klezmer
        from Romanian and Ottoman-era practice and were remade in a Jewish
        voice.<Ref id="feldman-shofar" />
      </P>
      <Blockquote
        attribution="Walter Zev Feldman, Shofar (2022)"
        cite="feldman-shofar"
        sources={SOURCES}
      >
        &ldquo;Uniquely within Europe&mdash;from the mid-seventeenth to the
        mid-twentieth centuries&mdash;in Ottoman and then post-Ottoman Moldova,
        Jewish klezmer and Gypsy (lautar) musicians had worked within a single
        professional structure.&rdquo;
      </Blockquote>
      <P>
        So the honest genealogy names several streams — cantorial voice,
        Hasidic song, and the dance music of Romanian, Ukrainian, Polish, and
        Greek-Ottoman neighbors — carried by professional musicians and remade,
        not imported whole. (The blues tells a structurally similar story of
        practices remade under new conditions; the two histories read well{" "}
        <Link
          href="/history/blues"
          className="text-foreground underline-offset-2 hover:underline"
        >
          side by side
        </Link>
        .) Still, the YIVO Encyclopedia is careful on what makes this music{" "}
        <em>its own</em>: a distinctive Jewish instrumental repertoire, style,
        and system of genres is documented only in Eastern Europe, with
        derivatives in America and Israel.<Ref id="yivo-traditional" />
      </P>

      <H2 id="world">The world it lived in: the Pale, the wedding, the badkhn</H2>
      <P>
        The heartland of this music was the Pale of Settlement — the western
        provinces of the Russian Empire where most Jews were required to live —
        plus Austro-Hungarian Galicia and the Romanian lands. Its stage was the
        wedding: a multi-day sequence of ritual moments, each with its own
        music — processionals to and from the ceremony, laments to seat the
        bride, listening tunes at the table, and dance after dance.
        <Ref id="yivo-traditional" /> The band (<em>kapelye</em>) worked
        alongside the <em>badkhn</em>, the wedding jester whose improvised
        rhymes could tip a room from laughter into tears — the emotional
        double-helix the instruments learned to imitate.
      </P>
      <P>
        The older bands were led by the fiddle, with the <em>tsimbl</em>{" "}
        (hammered dulcimer) at their heart; the clarinet is a relative
        latecomer that rose through the nineteenth century and conquered in
        America.<Ref id="rubin-nyklezmer" /> Klezmer families passed the trade
        down like any guild craft — both of the American era&rsquo;s great
        clarinetists, below, were born into multi-generation klezmer dynasties.
        <Ref id="wikipedia-brandwein" />
      </P>

      <H2 id="sound">The sound: freygish, the krechtz, and tunes that dance</H2>
      <P>
        Two things make a klezmer tune recognizable in a bar or two. The first
        is pitch: melodies built on modes like{" "}
        <Term id="freygish">freygish</Term>, whose flattened second and major
        third leave the dramatic leap of an{" "}
        <Term id="augmented-second">augmented second</Term> between them. The{" "}
        <Link
          href="/scales/freygish"
          className="text-foreground underline-offset-2 hover:underline"
        >
          freygish scale
        </Link>{" "}
        is what most ears mean by &ldquo;the Jewish scale,&rdquo; though the
        same notes serve flamenco and the Arabic maqam Hijaz — a scale is a
        meeting place, not a passport.<Ref id="stroum-jewish" />
      </P>
      <P>
        The second is the voice in the instrument. Klezmer playing imitates a
        singer — more precisely a cantor — with slides, bent notes, and above
        all the <Term id="krechtz">krechtz</Term>, the little sobbing catch on
        the tail of a note. In the <Term id="doina">doina</Term>, the beat
        stops entirely while a solo instrument laments over a drone, then
        breaks into a dance tune — weeping and dancing in a single breath. The
        dance forms themselves are a small vocabulary worth knowing: the{" "}
        <em>freylekhs</em> and <em>sher</em> of the old country, the{" "}
        <em>khosidl</em>, the slow-spinning <em>hora</em>, and the{" "}
        <em>bulgar</em>, the Bessarabian import that conquered America.
        <Ref id="feldman-shofar" /> Over a hundred of these tunes are playable
        in our{" "}
        <Link
          href="/piano-roll"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Piano Roll
        </Link>{" "}
        library.
      </P>

      <H2 id="america">Steerage to Second Avenue: klezmer in America</H2>
      <P>
        Between 1881 and 1924, some two million Jews left Eastern Europe for
        America, klezmorim among them. In New York the music found new rooms —
        catering halls, Second Avenue&rsquo;s Yiddish theaters — and a new
        machine: the record industry.<Ref id="rubin-nyklezmer" /> Columbia hired
        the Romanian-born violinist{" "}
        <ArtistLink id="abe-schwartz">Abe Schwartz</ArtistLink> around 1917 to
        lead its Jewish sessions and scout talent, and his house orchestras put
        the immigrant repertoire on 78rpm shellac largely as it was played —
        vernacular, spontaneous, without written arrangements.
      </P>
      <P>
        The era&rsquo;s two defining soloists were opposites.{" "}
        <ArtistLink id="naftule-brandwein">Naftule Brandwein</ArtistLink>, born
        into a Galician klezmer dynasty in 1884, played like a man possessed —
        a hot, ornament-drenched style the stories say he guarded by playing
        with his back to the audience so rivals couldn&rsquo;t copy his
        fingerings.<Ref id="wikipedia-brandwein" /> His 1923 recording of{" "}
        <SongLink id="heyser-bulgar" /> is still the reference version of one
        of the best-known tunes in the repertoire.{" "}
        <ArtistLink id="dave-tarras">Dave Tarras</ArtistLink>, from a Podolian
        klezmer family, was his temperamental opposite — poised, lyrical,
        impeccably in tune — and became the most recorded klezmer musician in
        America.<Ref id="rubin-nyklezmer" /> The National Endowment for the
        Arts, honoring Tarras decades later, caught the whole aesthetic in one
        sentence:
      </P>
      <Blockquote
        attribution="National Endowment for the Arts, on Dave Tarras"
        cite="nea-tarras"
        sources={SOURCES}
      >
        &ldquo;Klezmer, like the Yiddish language itself, is a creative
        combination of different cultural features and styles, combining the
        long, melismatic melodic line of cantorial phrasing with rhythms of
        Eastern European village dance tunes, the shepherd&rsquo;s clarinet
        with the gypsy violin, the instrumental techniques of art music with
        the free, improvisational style of Near Eastern folk music.&rdquo;
      </Blockquote>

      <H2 id="crossover">The crossover: Yiddish swing</H2>
      <P>
        In late 1937, the music jumped the fence. A Yiddish theater song that
        had flopped with its show in 1932 —{" "}
        <ArtistLink id="sholom-secunda">Sholom Secunda</ArtistLink>&rsquo;s{" "}
        <SongLink id="bei-mir-bistu-shein" /> — was rediscovered in Harlem, of
        all places:
      </P>
      <Blockquote
        attribution="Henry Sapoznik, “Yiddish Swing”"
        cite="sapoznik-swing"
        sources={SOURCES}
      >
        &ldquo;Lyricist Sammy Cahn and pianist Lou Levy were catching a show at
        the Apollo Theater in Harlem when two black performers called Johnnie
        and George took the stage singing &lsquo;Bei Mir Bist Du
        Schoen&rsquo; &mdash; in Yiddish. The crowd went wild.&rdquo;
      </Blockquote>
      <P>
        Cahn wrote English lyrics, the Andrews Sisters cut it as a B-side, and
        it became one of the biggest hits in the country — while Secunda, who
        had sold the rights for $30, watched from Second Avenue.
        <Ref id="milken-beimir" /> The klezmer instrumental repertoire crossed
        over too: trumpeter Ziggy Elman, a klezmer player inside Benny
        Goodman&rsquo;s band, took <SongLink id="der-shtiler-bulgar" /> — first
        recorded by Abe Schwartz&rsquo;s orchestra in 1918 — and swung it; with
        Johnny Mercer&rsquo;s lyrics it became the 1939 #1 hit &ldquo;And the
        Angels Sing.&rdquo;<Ref id="nmusa-shtetl" /> For a moment, a Bessarabian
        wedding dance sat on top of the American charts.
      </P>

      <H2 id="revival">Silence, and the revival</H2>
      <P>
        Then, for a generation, the music nearly vanished. In America the
        children of the immigrants wanted American music at their weddings; in
        Europe the Holocaust murdered the communities — and most of the
        musicians — that had carried the tradition.<Ref id="jta-feldman" /> By
        the 1960s Brandwein was dead and forgotten outside a circle of
        insiders, and Tarras was semi-retired in Brooklyn.
      </P>
      <P>
        The revival came from record collections. In Berkeley in 1975, Lev
        Liberman and David Skuse founded The Klezmorim after digging into a
        trove of 78s at the Judah Magnes Museum.<Ref id="klezmorim-krono" /> In
        New York, mandolinist Andy Statman and scholar Walter Zev Feldman
        sought out the elderly Dave Tarras, who agreed to teach; Feldman marks
        their 1978 concert with Tarras as the revival&rsquo;s true beginning.
        <Ref id="jta-feldman" /> Henry Sapoznik — a banjo player who realized
        his own tradition had a repertoire too — founded the band Kapelye in
        1979, reissued the old 78s from YIVO&rsquo;s collection, and in 1985
        started KlezKamp, the annual gathering that turned a rescue operation
        into a living scene.<Ref id="ybc-sapoznik" /> It was this generation
        that settled on &ldquo;klezmer&rdquo; as the music&rsquo;s name.
        <Ref id="britannica-klezmer" />
      </P>

      <H2 id="israel">The other homecoming: klezmer in Israel</H2>
      <P>
        Not every klezmer sailed for New York. Others went to Mandatory
        Palestine and, after 1948, to the new State of Israel, and the wedding
        repertoire went with them — into a culture set on forging a new Hebrew
        self. Yiddish, the language klezmorim had always named their music in,
        was widely felt to be the sound of the very exile the young state was
        trying to leave behind. The historian Rachel Rojanski cautions against
        the legend of an outright ban: there was never a single decree, and
        Yiddish culture in fact persisted — a vigorous center grew in Tel Aviv
        — but it lived under an official atmosphere that always put Hebrew
        first, and its fortunes rose and fell with the politics of the day.
        <Ref id="rojanski-yiddish" />
      </P>
      <P>
        As in America, the music returned as cherished heritage. The
        Argentine-born clarinetist{" "}
        <ArtistLink id="giora-feidman">Giora Feidman</ArtistLink> — a
        fourth-generation klezmer whose family had fled the pogroms of
        Bessarabian Chișinău — played nearly two decades in the Israel
        Philharmonic before leaving in the early 1970s to carry klezmer to
        concert halls the world over as the self-styled &ldquo;King of
        Klezmer.&rdquo;<Ref id="wikipedia-feidman" /> And since 1988 the
        Galilean hill town of Safed has given the music a yearly home: every
        summer its International Klezmer Festival fills the alleys of the Old
        City — the largest klezmer festival in Israel, and a standing sign that
        the sound the state once held at arm&rsquo;s length is now claimed as
        its own.<Ref id="wikipedia-safed-festival" />
      </P>

      <P>
        Today klezmer is played on every continent, fused with jazz, punk, and
        classical music, studied in conservatories — a music that outlived the
        world that made it and found new rooms to fill. To take its sound
        apart layer by layer — the modes, the ornaments, the dance grooves —
        see{" "}
        <Link
          href="/genres/klezmer"
          className="text-foreground underline-offset-2 hover:underline"
        >
          What is klezmer?
        </Link>
        .
      </P>

      <SourceList sources={SOURCES} />

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
        Quotations are reproduced briefly for commentary and criticism, with
        attribution and links to the originals. Where a source is public domain
        it is marked as such; other works are quoted under fair use. Click a
        song title to play a popular recording in place or open it in the Piano
        Roll.
      </p>
    </article>
  );
}
