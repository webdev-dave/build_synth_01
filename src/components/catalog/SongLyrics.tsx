import { ExternalLink } from "lucide-react";

import type { LyricLine, SongLyrics as SongLyricsVersion } from "@/lib/catalog/songs";
import { NativeScript } from "@/components/words/NativeScript";

interface SongLyricsProps {
  versions: SongLyricsVersion[];
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

/**
 * Sourced lyric versions on a song spoke. Non-English lines show the original
 * (native script, isolated so English glosses stay LTR), optional romanization,
 * then a line-by-line English gloss.
 */
export function SongLyrics({ versions }: SongLyricsProps) {
  if (versions.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="lyrics-heading">
      <h2
        id="lyrics-heading"
        className="text-sm font-medium text-muted-foreground"
      >
        Lyrics
      </h2>

      <div className="mt-4 space-y-10">
        {versions.map((version) => (
          <article key={version.id} aria-labelledby={`lyrics-${version.id}`}>
            <h3
              id={`lyrics-${version.id}`}
              className="text-base font-semibold tracking-tight text-foreground"
            >
              {version.label}
            </h3>
            {version.credit && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {version.credit}
              </p>
            )}
            {version.note && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {version.note}
              </p>
            )}

            <div className="mt-4 space-y-6">
              {stanzasOf(version.lines).map((stanza) => (
                <div key={stanza.key}>
                  {stanza.role === "refrain" && (
                    <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      Refrain
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

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
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
          </article>
        ))}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
        Lyrics are reproduced briefly for commentary and teaching, with
        attribution and a link to the source. They are not a substitute for the
        publisher&rsquo;s edition.
      </p>
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
        <p className="text-sm leading-relaxed text-foreground" lang={lang}>
          {line.text}
        </p>
      ) : native ? (
        <p className="font-mono text-sm leading-relaxed text-foreground">
          <NativeScript spelling={line.text} lang={lang} />
        </p>
      ) : (
        <p
          className="font-mono text-sm leading-relaxed text-foreground"
          lang={lang}
          dir="ltr"
        >
          {line.text}
        </p>
      )}
      {line.latin && (
        <p className="mt-0.5 font-mono text-xs leading-relaxed text-muted-foreground">
          {line.latin}
        </p>
      )}
      {line.en && !originalIsEnglish && (
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {line.en}
        </p>
      )}
    </div>
  );
}
