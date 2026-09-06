/**
 * "History & versions of Over the Rainbow" — the body of
 * /cousins/over-the-rainbow.
 *
 * Two catalog songs hold the players. This article is the travel note:
 * an English film ballad, then a Yiddish life. Server-rendered so quotes
 * and footnotes ship in the static HTML. No lyric blocks here.
 */
import Link from "next/link";

import { cousinQuestion, getCousin } from "@/lib/cousins/registry";
import { Cite, SourceList } from "@/components/history/citations";
import { SongJumpNav } from "@/components/history/SongJumpNav";
import { SongLink } from "@/components/history/SongLink";
import { ArtistLink } from "@/components/catalog/ArtistLink";
import { Word } from "@/components/words/Word";
import { CousinFamilyList } from "@/components/cousins/CousinFamilyList";

const ARTICLE = getCousin("over-the-rainbow");
const SOURCES = ARTICLE?.sources ?? [];
const SONG_IDS = ["over-the-rainbow", "iber-dem-regnboygn"];

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

export function OverTheRainbowCousins() {
  return (
    <article className="mt-8">
      <SongJumpNav ids={SONG_IDS} />

      <H2 id="kansas">A rainbow over Kansas</H2>
      <P>
        <ArtistLink id="harold-arlen">Harold Arlen</ArtistLink> wrote the
        melody and{" "}
        <ArtistLink id="yip-harburg">Yip Harburg</ArtistLink> the words for
        MGM’s <em>The Wizard of Oz</em> (1939).{" "}
        <ArtistLink id="judy-garland">Judy Garland</ArtistLink> sings it as
        Dorothy, a few minutes into the film, after Aunt Em tells her to find
        a place where she won’t get into any trouble.
        <Ref id="wikipedia-over-the-rainbow" /> The published title is “Over
        the Rainbow”; English speakers also call it “Somewhere Over the
        Rainbow.” Garland recorded the film take on October 7, 1938, and a
        Decca side in 1939. The studio nearly cut the slow ballad; it stayed,
        won the Academy Award for Best Original Song, and became the number
        she was asked for for the rest of her life.
        <Ref id="loc-nrr-rainbow" />
        <Ref id="loc-rimler" />
      </P>
      <P>
        Hear{" "}
        <SongLink id="over-the-rainbow">Over the Rainbow</SongLink> — the
        1939 film clip this site plays.
      </P>

      <H2 id="yiddish-authors">Yiddish in the writers, English in the song</H2>
      <P>
        Harburg was born Isidore Hochberg on the Lower East Side. His parents
        were Yiddish-speaking Orthodox Jews who had emigrated from Russia; he
        later said his love of theater began in boyhood visits to{" "}
        <Word id="yiddish-theater">Yiddish theater</Word> and vaudeville with
        his father.<Ref id="wikipedia-harburg" /> Arlen was born Hyman Arluck
        in Buffalo, the son of Cantor Samuel Arluck of the Pine Street Shul.
        <Ref id="wikipedia-arlen" />
        <Ref id="songhall-arlen" /> That is ancestry, not category. The lyric
        they wrote for Dorothy is English. A Yiddish life of the tune is a
        later translation, not a recovered original.
      </P>

      <H2 id="grand">A sheynem regnboygn</H2>
      <P>
        <ArtistLink id="al-grand">Al Grand</ArtistLink>, a retired New York
        City schoolteacher, is known for putting Gilbert and Sullivan into
        Yiddish — especially <em>Di Yam Gazlonim</em> (
        <em>The Pirates of Penzance</em>).
        <Ref id="nyt-grand-2006" /> In his spare time he also Yiddishized
        American popular songs. <em>The Forward</em> printed his “Over the
        Rainbow” on June 13, 2003, as “Iber a sheynem regnboygn,” and noted
        that he had copyrighted it and asked that it not be used without
        permission.<Ref id="forward-grand-2003" /> This article does not
        print the words. Grand later posted his own recording to his YouTube
        channel; the video’s description carries the full romanized lyric
        under that same 2003 copyright.<Ref id="yt-grand-rainbow" /> Other
        Yiddish settings of the same melody circulate; Grand’s is the one we
        can point at with a verified recording.
      </P>
      <P>
        <ArtistLink id="wolf-krakowski">Wolf Krakowski</ArtistLink> — born
        in a displaced-persons camp in 1947, a first-language Yiddish singer
        who recasts old songs in a blues-and-rock band — recorded Grand’s
        translation in Westhampton, Massachusetts, in 2016.
        <Ref id="wikipedia-krakowski" />
        <Ref id="kamea-krakowski" /> Hear{" "}
        <SongLink id="iber-dem-regnboygn">Iber dem regnboygn</SongLink> on
        his own Kame’a Media channel (he spells the title “Iber Dem
        Regenboygen”).
      </P>

      <H2 id="family">The family, as a list</H2>
      <P>
        Two catalog songs: the 1939 English original and one documented
        Yiddish life. Lyrics stay off this page — the English is still under
        copyright, and Grand asked for permission before reuse.
      </P>
      {ARTICLE && <CousinFamilyList article={ARTICLE} />}

      <P>
        For other tunes that crossed into Yiddish from somewhere else, see{" "}
        <Link
          href="/cousins/miserlou"
          className="text-foreground underline-offset-2 hover:underline"
        >
          {cousinQuestion("Misirlou")}
        </Link>
        .
      </P>

      <SourceList sources={SOURCES} />

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
        Quotations are reproduced briefly for commentary and criticism, with
        attribution and links to the originals. Where a source is public domain
        it is marked as such; other works are quoted under fair use. Click a
        song title to play a recording in place or open the song page.
      </p>
    </article>
  );
}
