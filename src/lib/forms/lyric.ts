/**
 * The words in the call cells come from the catalog, never from the form
 * registry: `Form.lyric` names a public-domain `SongLyrics` version and
 * each chorus names its line indices. Resolving here keeps one source of
 * truth for the text and makes the form page a door into /songs/<slug>.
 */

import { getCatalogSong, type CatalogSong, type SongLyrics } from "@/lib/catalog/songs";
import { formChoruses, type Form, type FormChorus } from "./registry";

export interface FormLyric {
  song: CatalogSong;
  version: SongLyrics;
}

/** The catalog song and lyric version a form sings from, when both exist. */
export function formLyric(form: Form): FormLyric | undefined {
  if (!form.lyric) return undefined;
  const song = getCatalogSong(form.lyric.song);
  const version = song?.lyrics?.find((v) => v.id === form.lyric?.version);
  if (!song || !version) return undefined;
  return { song, version };
}

export interface ChorusLines {
  chorus: FormChorus;
  /** One entry per section, in section order; `undefined` where nothing is sung. */
  lines: (string | undefined)[];
}

/** Every chorus of the song with its sung lines laid against the sections. */
export function chorusLines(form: Form): ChorusLines[] {
  const lyric = formLyric(form);
  return formChoruses(form).map((chorus) => ({
    chorus,
    lines: form.sections.map((section) => {
      if (section.line === undefined || chorus.instrumental || !chorus.lines || !lyric) {
        return undefined;
      }
      const index = chorus.lines[section.line];
      return index === undefined ? undefined : lyric.version.lines[index]?.text;
    }),
  }));
}

/**
 * The first sung chorus as one crawlable line for panels and quick
 * references: “line one” · “line two” · “line three”.
 */
export function formLyricSample(form: Form): string | undefined {
  const first = chorusLines(form).find((c) => c.lines.some(Boolean));
  if (!first) return undefined;
  return first.lines
    .filter((l): l is string => Boolean(l))
    .map((l) => `“${l}”`)
    .join(" · ");
}
