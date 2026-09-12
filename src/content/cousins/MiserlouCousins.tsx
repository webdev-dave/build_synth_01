/**
 * "History & versions of Misirlou" — the body of /cousins/miserlou.
 *
 * Server-rendered prose so quotes and footnotes ship in the static HTML.
 * Instances are catalog songs; this file only tells how they are related.
 */
import Link from "next/link";

import { getCousin } from "@/lib/cousins/registry";
import { Blockquote, Cite, SourceList } from "@/components/history/citations";
import { SongJumpNav } from "@/components/history/SongJumpNav";
import { SongLink } from "@/components/history/SongLink";
import { ArtistLink } from "@/components/catalog/ArtistLink";
import { Term } from "@/components/concepts/Term";
import { Word } from "@/components/words/Word";
import { CousinFamilyList } from "@/components/cousins/CousinFamilyList";

const ARTICLE = getCousin("miserlou");
const SOURCES = ARTICLE?.sources ?? [];
const SONG_IDS = [
  "misirlou-demetriades",
  "misirlou-patrinos",
  "misirlou-rexite",
  "misirlou-dale",
];

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

export function MiserlouCousins() {
  return (
    <article className="mt-8">
      <SongJumpNav ids={SONG_IDS} />

      <H2 id="the-name">An Egyptian girl with a Turkish name</H2>
      <P>
        <Word id="misirlou">Misirlou</Word> is Greek{" "}
        <em>Μισιρλού</em> — the feminine form of a borrowing from Turkish{" "}
        <Word id="misirli">
          <em>Mısırlı</em>
        </Word>
        , “Egyptian.” The Turkish word itself comes from
        Arabic{" "}
        <Word id="misr">
          <em>Miṣr</em>
        </Word>
        , Egypt. So the song is about an Egyptian woman,
        named in the language of the Ottoman street rather than in Greek{" "}
        <em>Αιγύπτια</em>.<Ref id="wikipedia-misirlou" />
      </P>
      <P>
        No one owns the composer credit in the folk sense. Arabic, Greek, and
        Jewish musicians were already playing the tune by the 1920s; the
        original author is unknown.<Ref id="wikipedia-misirlou" /> A later
        claim that it derives from Sayed Darwish’s “Bint Misr” is treated as
        doubtful.<Ref id="wikipedia-misirlou" /> Same neighborhood of modes is
        not the same kinship: the melody walks a <Word id="hijaz">Hijaz</Word> / double-harmonic
        pattern — the interval shape klezmer calls{" "}
        <Term id="freygish">freygish</Term> — and that scale is a street, not
        a family tree.
      </P>

      <H2 id="demetriades">The first record we can point at</H2>
      <P>
        The earliest known recording is{" "}
        <ArtistLink id="tetos-demetriades">
          Tetos Demetriades
        </ArtistLink>
        ’s <SongLink id="misirlou-demetriades" />, cut for Columbia in New
        York in July 1927 and issued for the Greek market as Columbia
        56073-F.<Ref id="dahr-demetriades" />
        <Ref id="sfdh-misirlou" /> Demetriades was an Ottoman Greek, born in
        Istanbul around the turn of the century, who left for the United
        States in 1921. He almost certainly knew the song as a folk tune
        before he named it on a disc.<Ref id="wikipedia-misirlou" />
        <Ref id="recording-pioneers-demetriades" />
      </P>
      <P>
        A few years later{" "}
        <ArtistLink id="michalis-patrinos">Michalis Patrinos</ArtistLink>{" "}
        recorded it in Athens as <SongLink id="misirlou-patrinos" /> — slower,
        a <Word id="rebetiko">rebetiko</Word> /{" "}
        <Word id="tsifteteli">tsifteteli</Word>, sometimes titled{" "}
        <em>Mousourlou</em>. A New York side followed in 1931.
        <Ref id="wikipedia-misirlou" />
        <Ref id="shira-misirlou" />
      </P>
      <P>
        Copyright is a later American story.{" "}
        <ArtistLink id="nick-roubanis">Nick Roubanis</ArtistLink>, a
        Greek-American music instructor, registered a jazz-exotica
        arrangement and is still often printed as the composer — unchallenged
        in most of the world, contested in Greece, where Patrinos is sometimes
        named instead.<Ref id="wikipedia-misirlou" /> English words were added
        by Chaim Tauber, Fred Wise, and Milton Leeds. Harry James put an
        instrumental on the U.S. chart in 1941. None of that invents an
        author for the folk contour.
      </P>

      <H2 id="yiddish">Yiddish words, a Jewish ambit</H2>
      <P>
        The tune entered the ambit of klezmer only in the late 1940s, Seth
        Rogovoy writes — a wedding-band and dance-repertoire life, not a
        Second Avenue premiere.<Ref id="forward-rogovoy" /> That is a cited
        contemporary account, not a 78 we can play here. What we{" "}
        <em>can</em> point at is a Yiddish lyric.
      </P>
      <P>
        <ArtistLink id="miriam-kressyn">Miriam Kressyn</ArtistLink> wrote
        Yiddish words in the 1940s; her husband{" "}
        <ArtistLink id="seymour-rexite">Seymour Rexite</ArtistLink> sang them.
        <Ref id="teruah-misirlou" /> The copy we can hear is Banner’s{" "}
        <SongLink id="misirlou-rexite" />, ca. 1948, Rexite with Abe Ellstein
        at the piano — held at the University of Wisconsin–Madison, not on
        YouTube.<Ref id="uw-rexite" /> We do not have a citable full Yiddish
        text to print; the recording is the instance.
      </P>
      <P>
        Ethnomusicologist Harry Smith recorded the Orthodox rabbi{" "}
        <ArtistLink id="naftali-abulafia">
          Naftali Zvi Margolies Abulafia
        </ArtistLink>{" "}
        singing the tune on Manhattan’s Lower East Side in the 1950s. A later
        write-up treats that performance as Hebrew. Either way it is another
        Jewish room, not a second composition — and we do not have a verified
        upload to catalog.<Ref id="forward-rogovoy" />
        <Ref id="teruah-misirlou" />
      </P>
      <Blockquote
        attribution="Seth Rogovoy, The Forward"
        cite="forward-rogovoy"
        sources={SOURCES}
      >
        “Misirlou” entered the ambit of klezmer only in the late 1940s, though
        musicologist and filmmaker Harry Smith recorded Naftali Zvi Margolies
        Abulafia, an Orthodox rabbi, singing it on Manhattan’s Lower East Side
        in the 1950s. Lord only knows where the good rabbi heard it.
      </Blockquote>

      <H2 id="dale">One string, much faster</H2>
      <P>
        <ArtistLink id="dick-dale">Dick Dale</ArtistLink> recast the melody as{" "}
        <SongLink id="misirlou-dale" /> in 1962 — a surf-guitar instrumental
        on Deltone, later the sound most of the English-speaking world thinks{" "}
        <em>is</em> Misirlou.<Ref id="wikipedia-misirlou" /> His father and
        uncles were Lebanese-American musicians. Dale said he had seen an
        uncle play the tune on one string of the <Word id="oud">oud</Word>, and he won a bet by
        doing the same on guitar, at rock-and-roll speed.
        <Ref id="npr-dale" />
        <Ref id="npr-misirlou" />
      </P>
      <P>
        Quentin Tarantino put Dale’s record over the opening of{" "}
        <em>Pulp Fiction</em> in 1994. That is a quotation, not a new cousin —
        the same rearrangement, a new room.<Ref id="wikipedia-misirlou" />{" "}
        Later rock and pop quotes (the Beach Boys, “Pump It”) sit in the same
        file: they point back at Dale, not at Demetriades.
      </P>

      <H2 id="family">The family, as a list</H2>
      <P>
        Four catalog lives we can name and, where a legal player exists, hear.
        The Jewish wedding-band life Rogovoy describes is real and cited; it
        is not a fifth row until we have a specific recording.
      </P>
      {ARTICLE && <CousinFamilyList article={ARTICLE} />}

      <P>
        To sit with the mode this contour lives in, see{" "}
        <Link
          href="/scales/freygish"
          className="text-foreground underline-offset-2 hover:underline"
        >
          What is freygish?
        </Link>
        . To follow klezmer’s own American crossings, see{" "}
        <Link
          href="/history/klezmer"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Where did klezmer come from?
        </Link>
        .
      </P>

      <SourceList sources={SOURCES} />

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
        Quotations are reproduced briefly for commentary and criticism, with
        attribution and links to the originals. Where a source is public domain
        it is marked as such; other works are quoted under fair use. Click a
        song title to play a recording in place, or to open the catalog page
        when we only have an archive link.
      </p>
    </article>
  );
}
