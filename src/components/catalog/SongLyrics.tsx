import Link from "next/link";
import { ChevronRight, ExternalLink, Volume2, Youtube } from "lucide-react";
import type { ReactNode } from "react";

import { CollapsibleVideo } from "@/components/media/CollapsibleVideo";
import { HostedAudioPlayer } from "@/components/media/HostedAudioPlayer";
import { NativeScript } from "@/components/words/NativeScript";
import type {
  LyricLine,
  SongLyrics as SongLyricsVersion,
  SongRecording,
} from "@/lib/catalog/songs";
import { PROSE_LINK } from "@/components/content/prose";
import { makeTermLinker } from "@/components/concepts/autoTerm";

interface SongLyricsProps {
  /** Display title, used in the section heading. */
  title: string;
  versions: SongLyricsVersion[];
  /**
   * Every performance of this song. Each becomes a card, with the lyric
   * version it names (`recording.lyrics`) printed under the player.
   */
  recordings?: SongRecording[];
}

interface Stanza {
  key: string;
  role: LyricLine["role"];
  lines: LyricLine[];
}

function stanzasOf(lines: LyricLine[]): Stanza[] {
  const groups: Stanza[] = [];
  for (const line of lines) {
    const key = `${line.stanza ?? groups.length}:${line.role ?? "verse"}`;
    const last = groups[groups.length - 1];
    if (!last || last.key !== key) {
      groups.push({ key, role: line.role, lines: [line] });
    } else {
      last.lines.push(line);
    }
  }
  return groups;
}

function hasEnglishGloss(versions: SongLyricsVersion[]): boolean {
  return versions.some(
    (version) =>
      version.lang.split("-")[0] !== "en" &&
      version.lines.some((line) => line.en),
  );
}

/**
 * One card: a performance, the words it sings, or both.
 *
 * Built in `lyrics` order. A version pulls in every recording that names
 * it (`recording.lyrics === version.id`); the words print under each. A
 * version no recording sings is words only. A recording no version
 * claims comes last, audio only.
 */
interface Entry {
  key: string;
  /** In-page anchor. The first card of a version owns `lyrics-<id>`. */
  id: string;
  version?: SongLyricsVersion;
  recording?: SongRecording;
}

function recordingKey(recording: SongRecording): string {
  return recording.youtubeId ?? recording.src ?? recording.label;
}

function slugOf(text: string): string {
  return text.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function entriesOf(
  versions: SongLyricsVersion[],
  recordings: SongRecording[],
): Entry[] {
  const entries: Entry[] = [];
  const claimed = new Set<SongRecording>();
  for (const version of versions) {
    const sung = recordings.filter((r) => r.lyrics === version.id);
    if (sung.length === 0) {
      entries.push({ key: version.id, id: `lyrics-${version.id}`, version });
      continue;
    }
    sung.forEach((recording, i) => {
      claimed.add(recording);
      entries.push({
        key: `${version.id}:${recordingKey(recording)}`,
        id: i === 0 ? `lyrics-${version.id}` : `lyrics-${version.id}-${i + 1}`,
        version,
        recording,
      });
    });
  }
  for (const recording of recordings) {
    if (claimed.has(recording)) continue;
    const key = recordingKey(recording);
    entries.push({
      key: `audio:${key}`,
      id: `recording-${slugOf(key)}`,
      recording,
    });
  }
  return entries;
}

function sectionHeading(
  title: string,
  translated: boolean,
  hasRecordings: boolean,
): string {
  if (translated && hasRecordings) {
    return `Lyrics, translation, and recordings of “${title}”`;
  }
  if (hasRecordings) return `Lyrics and recordings of “${title}”`;
  if (translated) return `Lyrics and translation of “${title}”`;
  return `Lyrics of “${title}”`;
}

/**
 * Marks a closed card as having sound. YouTube red is how the mark reads
 * as "a video plays here"; the speaker is a file we host.
 */
function SoundMark({ recording }: { recording: SongRecording }) {
  if (recording.youtubeId) {
    return (
      <Youtube
        className="h-4 w-4 shrink-0 text-red-600"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }
  return (
    <Volume2
      className="h-4 w-4 shrink-0 text-muted-foreground"
      strokeWidth={1.75}
      aria-hidden
    />
  );
}

function Player({ recording }: { recording: SongRecording }) {
  if (recording.youtubeId) {
    return (
      <CollapsibleVideo
        videoId={recording.youtubeId}
        label={recording.label}
        className="my-0"
      />
    );
  }
  if (recording.src) {
    return <HostedAudioPlayer src={recording.src} label={recording.label} />;
  }
  return null;
}

/**
 * The lyrics-and-recordings section on a song page. One component.
 *
 * Each card is one version: the recording that sings it and the words
 * under it. The lines stay in the HTML even when a card is closed, so a
 * crawler can read them and an in-page link can open the card it names.
 * More than one card starts closed. A single card starts open.
 */
function CreditText({
  credit,
  link,
  linkTerms,
}: {
  credit: string;
  link?: { phrase: string; href: string };
  linkTerms: (text: string) => ReactNode;
}) {
  if (!link) return linkTerms(credit);
  const at = credit.indexOf(link.phrase);
  if (at < 0) return linkTerms(credit);
  return (
    <>
      {linkTerms(credit.slice(0, at))}
      <Link href={link.href} className={PROSE_LINK}>
        {link.phrase}
      </Link>
      {linkTerms(credit.slice(at + link.phrase.length))}
    </>
  );
}

export function SongLyrics({
  title,
  versions,
  recordings = [],
}: SongLyricsProps) {
  const entries = entriesOf(versions, recordings);
  if (entries.length === 0) return null;
  const translated = hasEnglishGloss(versions);
  const hasRecordings = entries.some((entry) => entry.recording);
  const hasWords = entries.some((entry) => entry.version);
  const choose = entries.length > 1;
  const linkTerms = makeTermLinker();

  return (
    <section
      className="mt-10 scroll-mt-24"
      id="lyrics"
      aria-labelledby="lyrics-heading"
    >
      <h2
        id="lyrics-heading"
        className="text-base font-medium text-foreground"
      >
        {hasWords
          ? sectionHeading(title, translated, hasRecordings)
          : `Recordings of “${title}”`}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        {hasWords
          ? translated
            ? `Song lyrics for “${title},” with an English translation under each line.`
            : `Song lyrics for “${title}.”`
          : `Recordings of “${title}.”`}
        {hasWords &&
          hasRecordings &&
          " Each version is one entry: the recording, and the words it sings."}
        {choose && " Open the one you want."}
      </p>

      <div className="mt-4 space-y-3">
        {entries.map((entry) => {
          const { version, recording } = entry;
          const heading = version?.label ?? recording?.label ?? title;
          return (
            <details
              key={entry.key}
              id={entry.id}
              className="scroll-mt-24 rounded-lg border border-border bg-muted/30 [&[open]>summary_.chevron]:rotate-90"
              {...(choose ? {} : { open: true })}
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                <h3 className="min-w-0 flex-1 text-base font-semibold tracking-tight text-foreground">
                  {heading}
                  {recording && (
                    <span className="sr-only">
                      {recording.youtubeId
                        ? " — with a YouTube recording"
                        : " — with audio"}
                    </span>
                  )}
                </h3>
                {recording && <SoundMark recording={recording} />}
                <ChevronRight
                  className="chevron h-4 w-4 shrink-0 text-muted-foreground transition-transform"
                  aria-hidden
                />
              </summary>

              <div className="border-t border-border px-3 py-3">
                {version?.credit && (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    <CreditText
                      credit={version.credit}
                      link={version.creditLink}
                      linkTerms={linkTerms}
                    />
                  </p>
                )}
                {version?.note && (
                  <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                    {linkTerms(version.note)}
                    {version.seeAlso && (
                      <>
                        {" "}
                        <a
                          href={`#lyrics-${version.seeAlso.versionId}`}
                          className={PROSE_LINK}
                        >
                          {version.seeAlso.label}
                        </a>
                      </>
                    )}
                  </p>
                )}

                {recording && (
                  <div className={version ? "mt-3" : ""}>
                    <Player recording={recording} />
                  </div>
                )}

                {version && (
                  <>
                    <div className="mt-4 space-y-6">
                      {stanzasOf(version.lines).map((stanza) => (
                        <div key={stanza.key}>
                          {stanza.role === "refrain" && (
                            <p className="mb-2 font-mono text-base uppercase tracking-wider text-muted-foreground">
                              Refrain
                            </p>
                          )}
                          {stanza.role === "repeat" && (
                            <p className="mb-2 font-mono text-base uppercase tracking-wider text-muted-foreground">
                              Sung again
                            </p>
                          )}
                          <div className="space-y-3">
                            {stanza.lines.map((line, i) => (
                              <LyricRow
                                key={`${stanza.key}-${i}`}
                                line={line}
                                lang={version.lang}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {version.source.url ? (
                        <a
                          href={version.source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 underline-offset-2 hover:text-foreground hover:underline"
                        >
                          Source: {version.source.label}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      ) : (
                        <>Source: {version.source.label}</>
                      )}
                    </p>
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {hasWords && (
        <p className="mt-8 text-base leading-relaxed text-muted-foreground/70">
          Lyrics are reproduced briefly for commentary and teaching, with
          attribution and a link to the source. They are not a substitute for
          the publisher&rsquo;s edition.
        </p>
      )}
    </section>
  );
}

function looksNativeScript(text: string) {
  return /[\u0590-\u05FF\u0370-\u03FF\u0600-\u06FF]/.test(text);
}

function LyricRow({ line, lang }: { line: LyricLine; lang: string }) {
  const originalIsEnglish = lang.split("-")[0] === "en";
  const native = !originalIsEnglish && looksNativeScript(line.text);

  return (
    <div>
      {originalIsEnglish ? (
        <p className="text-base leading-relaxed text-foreground" lang={lang}>
          {line.text}
        </p>
      ) : native ? (
        <p className="font-mono text-base leading-relaxed text-foreground">
          <NativeScript spelling={line.text} lang={lang} />
        </p>
      ) : (
        <p
          className="font-mono text-base leading-relaxed text-foreground"
          lang={lang}
          dir="ltr"
        >
          {line.text}
        </p>
      )}
      {line.latin && (
        <p className="mt-0.5 font-mono text-base leading-relaxed text-muted-foreground">
          {line.latin}
        </p>
      )}
      {line.en && !originalIsEnglish && (
        <p className="mt-0.5 text-base leading-relaxed text-muted-foreground">
          {line.en}
        </p>
      )}
    </div>
  );
}
