/**
 * Loanwords — native-script spellings + (when we have one) how to say them.
 *
 * English pages write *krechtz* and *doina*; those words still have a home
 * spelling (Yiddish קרעכץ, Romanian doină). This registry is the source of
 * truth for that pairing, and for the listen-to-pronounce control.
 *
 * Pronunciation is a **real human recording only** — no synthetic
 * text-to-speech. A word gets a speaker button *only* when it has a verified,
 * openly-licensed `audio` clip of the matching word; otherwise we show the
 * spelling with no speaker. Never attach a synthetic voice or an unverified
 * file just to have a button.
 *
 * Looked up by id (usually the same slug as a concept/genre/scale) or by
 * any Latin phrase in `latin` / `alsoSpelled` / `aliases`. Only include a
 * native spelling we can stand behind: attested in a cited source, or the
 * standard orthography of an attested Latin form (YIVO for Yiddish, Romanian
 * diacritics, unpointed Hebrew for prayer names).
 */

export interface NativeForm {
  /** Spelling in the source language. */
  spelling: string;
  /** Language name shown to the reader ("Yiddish"). */
  language: string;
  /** BCP-47 tag, for the `lang` attribute + text direction. */
  lang: string;
}

export interface WordAudio {
  /** Local path under /public (we self-host for uptime + license clarity). */
  src: string;
  /** Human-readable source ("Jewish English Lexicon"). */
  source: string;
  /** Link to the source page (attribution). */
  sourceUrl?: string;
  /** License short name ("CC BY-SA 4.0"). */
  license?: string;
}

export interface SpokenWord {
  id: string;
  /** How we write it in English prose. */
  latin: string;
  /**
   * 1–2 common English spellings shown to the reader ("krechtz", "doyna").
   * Plurals and linker-only phrases stay in `aliases`.
   */
  alsoSpelled?: string[];
  /** Other Latin spellings an author or the auto-linker might use. */
  aliases?: string[];
  native: NativeForm;
  /**
   * A verified human recording of this word. Present ⇒ show the speaker.
   * Absent ⇒ spelling only, no button. See `public/audio/words/`.
   */
  audio?: WordAudio;
}

/** Shared attribution for the Jewish English Lexicon recordings. */
const JEL = (path: string, wordId: string): WordAudio => ({
  src: `/audio/words/${path}`,
  source: "Jewish English Lexicon",
  sourceUrl: `https://jel.jewish-languages.org/words/${wordId}`,
  license: "CC BY-SA 4.0",
});

export const WORDS: SpokenWord[] = [
  {
    id: "krechtz",
    latin: "krechtz",
    alsoSpelled: ["krekhts"],
    aliases: ["krekhts", "krechts", "krekhtsn", "krekhtz", "krekhtsen"],
    native: {
      // Wikipedia "Klezmer"; Jewish English Lexicon (קרעכצן, the verb).
      spelling: "קרעכץ",
      language: "Yiddish",
      lang: "yi",
    },
    audio: JEL("krechtz.mp3", "2481"),
  },
  {
    id: "doina",
    latin: "doina",
    alsoSpelled: ["doyna"],
    aliases: ["doyna", "doinas", "doine"],
    native: {
      spelling: "doină",
      language: "Romanian",
      lang: "ro-RO",
    },
  },
  {
    id: "freygish",
    latin: "freygish",
    aliases: ["freygish mode"],
    native: {
      // YIVO spelling of the attested Yiddish word (from German Phrygisch).
      spelling: "פֿרייגיש",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    id: "ahava-rabbah",
    latin: "Ahava Rabbah",
    alsoSpelled: ["Ahavah Rabbah", "Ahava Rabboh"],
    aliases: ["Ahavah Rabbah", "Ahava Rabboh", "Ahavah Rabboh"],
    native: {
      spelling: "אהבה רבה",
      language: "Hebrew",
      lang: "he-IL",
    },
  },
  {
    id: "misheberakh",
    latin: "Mi Sheberakh",
    alsoSpelled: ["Mi Shebeirach", "Misheberakh"],
    aliases: [
      "Mi Shebeirach",
      "Misheberakh",
      "Misheberach",
      "Mi Sheberach",
      "Mishebeyrekh",
      "Mi Sheberakh mode",
    ],
    native: {
      // The prayer incipit ("He who blessed"); unpointed, as JEL /words/372
      // and Wikipedia "Mi Shebeirach" give it. Yiddish form: מי־שברך.
      spelling: "מי שברך",
      language: "Hebrew",
      lang: "he-IL",
    },
    // JEL sense 1 is the prayer itself — the same spoken name the klezmer
    // mode carries, so word and sense match.
    audio: JEL("misheberakh.mp3", "372"),
  },
  {
    id: "klezmer",
    latin: "klezmer",
    native: {
      // Wikipedia lists כּלי־זמר and קלעזמער; the first is the Hebrew-origin form
      // our history article already teaches (kley zemer).
      spelling: "כּלי־זמר",
      language: "Yiddish",
      lang: "yi",
    },
    audio: JEL("klezmer.mp3", "272"),
  },
  {
    id: "klezmorim",
    latin: "klezmorim",
    native: {
      spelling: "כּלי־זמרים",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    id: "kley-zemer",
    latin: "kley zemer",
    alsoSpelled: ["kele zemer"],
    aliases: ["kele zemer"],
    native: {
      spelling: "כלי זמר",
      language: "Hebrew",
      lang: "he-IL",
    },
  },
  {
    id: "freylekhs",
    latin: "freylekhs",
    alsoSpelled: ["freilachs", "freylakhs"],
    aliases: ["freylekh", "freylakhs", "freilechs", "freilachs", "freilach"],
    native: {
      spelling: "פֿריילעכס",
      language: "Yiddish",
      lang: "yi",
    },
    // JEL headword "freilach" — same dance, singular spelling.
    audio: JEL("freylekhs.mp3", "169"),
  },
  {
    id: "sher",
    latin: "sher",
    aliases: ["shers", "sherele"],
    native: {
      // The dance is named for Yiddish שער, "scissors".
      spelling: "שער",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    id: "hora",
    latin: "hora",
    alsoSpelled: ["horah"],
    aliases: ["horă", "horah"],
    native: {
      spelling: "horă",
      language: "Romanian",
      lang: "ro-RO",
    },
    // JEL: Jewish circle dance originating in Romania — same dance, not "hour".
    audio: JEL("hora.mp3", "3678"),
  },
  {
    id: "sirba",
    latin: "sirba",
    aliases: ["sârbă"],
    native: {
      spelling: "sârbă",
      language: "Romanian",
      lang: "ro-RO",
    },
  },
  {
    id: "bulgar",
    latin: "bulgar",
    aliases: ["bulgars", "bulgarish"],
    native: {
      spelling: "bulgar",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    id: "shvesters",
    latin: "shvesters",
    alsoSpelled: ["shvester"],
    aliases: ["shvester", "the shvesters"],
    native: {
      // Standard Yiddish שוועסטער “sister”; the duo’s name is the English-Yiddish plural.
      spelling: "שוועסטערס",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    id: "misirlou",
    latin: "Misirlou",
    alsoSpelled: ["Miserlou"],
    aliases: ["Misirlou", "Miserlou", "Mısırlı", "Mousourlou"],
    native: {
      // Wikipedia “Misirlou”; Greek feminine of Turkish Mısırlı (“Egyptian”).
      spelling: "Μισιρλού",
      language: "Greek",
      lang: "el",
    },
  },
  {
    id: "dos-kelbl",
    latin: "Dos kelbl",
    aliases: ["dos kelbl", "Dos Kelbl"],
    native: {
      // Mlotek Yiddish Song Collection; Wikipedia “Dona, Dona”.
      spelling: "דאָס קעלבל",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    // The Dona Dona refrain vocable. Polish is Latin-script, so the value here
    // is the *speaker*, not a native parenthetical — the clip is a native
    // Polish "dana". Scoped to the full "oj, dana dana" phrase (never bare
    // "dana") so the auto-linker can't grab "Dana, Dana, Dana" in prose.
    id: "oj-dana",
    latin: "oj, dana dana",
    aliases: ["oj dana dana", "oj, dana dana, moja dana"],
    native: {
      spelling: "oj, dana dana",
      language: "Polish",
      lang: "pl",
    },
    audio: {
      src: "/audio/words/oj-dana.ogg",
      source: "Wikimedia Commons — Equadus",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pl-dana.ogg",
      license: "CC BY-SA 3.0",
    },
  },
  {
    id: "yidishe-muzik",
    latin: "yidishe muzik",
    native: {
      spelling: "ייִדישע מוזיק",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    id: "lautari",
    latin: "lautari",
    aliases: ["lautar", "lăutari", "lăutar"],
    native: {
      spelling: "lăutari",
      language: "Romanian",
      lang: "ro-RO",
    },
  },
  {
    id: "nigun",
    latin: "nigun",
    alsoSpelled: ["niggun"],
    aliases: ["nigunim", "niggun"],
    native: {
      spelling: "ניגון",
      language: "Hebrew",
      lang: "he-IL",
    },
    audio: JEL("nigun.mp3", "410"),
  },
  {
    id: "davening",
    latin: "davening",
    aliases: ["daven", "davens", "davenen"],
    native: {
      spelling: "דאַוונען",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    // Standard Yiddish for the institution; YIVO טעאַטער. Uriel Weinreich /
    // modern Yiddish dictionaries. Genre slug so the spoke gets a banner.
    id: "yiddish-theater",
    latin: "Yiddish theater",
    alsoSpelled: ["Yiddish theatre"],
    aliases: ["yiddish theater", "yiddish theatre"],
    native: {
      spelling: "ייִדיש טעאַטער",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    // YIVO פֿאָלקסליד “folk song.” Genre slug for the spoke banner.
    id: "yiddish-folk",
    latin: "folkslid",
    aliases: ["folks lid", "Yiddish folk song", "Yiddish folk songs"],
    native: {
      spelling: "פֿאָלקסליד",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    // JEL “badchen”; YIVO badkhn. Wedding jester.
    id: "badkhn",
    latin: "badkhn",
    alsoSpelled: ["badchen", "badchan"],
    aliases: ["badchen", "badchan", "badkhen"],
    native: {
      spelling: "באַדחן",
      language: "Yiddish",
      lang: "yi",
    },
    audio: JEL("badkhn.mp3", "2300"),
  },
  {
    // JEL etymology קאַפּעליע — a klezmer band.
    id: "kapelye",
    latin: "kapelye",
    aliases: ["kapelyeh", "kapelie"],
    native: {
      spelling: "קאַפּעליע",
      language: "Yiddish",
      lang: "yi",
    },
    audio: JEL("kapelye.mp3", "4285"),
  },
  {
    // YIVO צימבל; hammered dulcimer. YIVO Encyclopedia, “Traditional and
    // Instrumental Music.” No JEL clip as of 2026-09-06.
    id: "tsimbl",
    latin: "tsimbl",
    aliases: ["tsimbal", "cimbalom"],
    native: {
      spelling: "צימבל",
      language: "Yiddish",
      lang: "yi",
    },
  },
  {
    // JEL “khosidl” — Hasidic dance; Y חסידל.
    id: "khosidl",
    latin: "khosidl",
    alsoSpelled: ["khosidel"],
    aliases: ["khosidls", "hasidl", "chosidl"],
    native: {
      spelling: "חסידל",
      language: "Yiddish",
      lang: "yi",
    },
    audio: JEL("khosidl.mp3", "4540"),
  },

  /* --------------------------------------------------------------------
   * Scale and mode names across traditions (src/lib/scales/registry.ts
   * `aliases`). Standard orthographies: Devanagari for Hindustani thaats
   * and ragas, Arabic for maqamat, unpointed Hebrew for prayer modes,
   * Turkish diacritics for makams, Chinese for the pentatonic modes.
   * No recordings — spelling only. Carnatic melakarta names are left
   * Latin-only in the scale registry until a script we can stand behind
   * is attested (deliberate; see the scales plan).
   * ------------------------------------------------------------------ */
  // Hindustani thaats — Bhatkhande's ten; Devanagari as in the standard
  // theory texts and Wikipedia's raga articles.
  { id: "bilaval", latin: "Bilaval", alsoSpelled: ["Bilawal"], aliases: ["Bilawal thaat", "Bilaval thaat"], native: { spelling: "बिलावल", language: "Hindi", lang: "hi" } },
  { id: "asavari", latin: "Asavari", alsoSpelled: ["Asawari"], aliases: ["Asavari thaat"], native: { spelling: "आसावरी", language: "Hindi", lang: "hi" } },
  { id: "kafi", latin: "Kafi", aliases: ["Kafi thaat"], native: { spelling: "काफ़ी", language: "Hindi", lang: "hi" } },
  { id: "bhairavi", latin: "Bhairavi", aliases: ["Bhairavi thaat"], native: { spelling: "भैरवी", language: "Hindi", lang: "hi" } },
  { id: "kalyan", latin: "Kalyan", alsoSpelled: ["Kalyaan"], aliases: ["Kalyan thaat", "Yaman"], native: { spelling: "कल्याण", language: "Hindi", lang: "hi" } },
  { id: "khamaj", latin: "Khamaj", aliases: ["Khamaj thaat"], native: { spelling: "खमाज", language: "Hindi", lang: "hi" } },
  { id: "bhairav", latin: "Bhairav", aliases: ["Bhairav thaat"], native: { spelling: "भैरव", language: "Hindi", lang: "hi" } },
  // Hindustani ragas whose note set matches a page.
  { id: "bhupali", latin: "Bhupali", alsoSpelled: ["Bhoopali", "Bhoop"], aliases: ["Bhoopali", "Bhoop", "Bhup"], native: { spelling: "भूपाली", language: "Hindi", lang: "hi" } },
  { id: "dhani", latin: "Dhani", native: { spelling: "धानी", language: "Hindi", lang: "hi" } },
  { id: "patdeep", latin: "Patdeep", alsoSpelled: ["Patdip"], native: { spelling: "पटदीप", language: "Hindi", lang: "hi" } },
  { id: "kirwani", latin: "Kirwani", alsoSpelled: ["Keeravani", "Kiravani"], aliases: ["Keeravani", "Kiravani"], native: { spelling: "कीरवाणी", language: "Hindi", lang: "hi" } },
  // Arabic maqamat.
  { id: "ajam", latin: "Ajam", alsoSpelled: ["ʿAjam"], aliases: ["maqam ajam", "ʿAjam"], native: { spelling: "عجم", language: "Arabic", lang: "ar" } },
  { id: "nahawand", latin: "Nahawand", alsoSpelled: ["Nahwand"], aliases: ["maqam nahawand", "Nahwand"], native: { spelling: "نهاوند", language: "Arabic", lang: "ar" } },
  { id: "kurd", latin: "Kurd", aliases: ["maqam kurd"], native: { spelling: "كرد", language: "Arabic", lang: "ar" } },
  { id: "hijaz", latin: "Hijaz", alsoSpelled: ["Hejaz"], aliases: ["maqam hijaz", "Hejaz"], native: { spelling: "حجاز", language: "Arabic", lang: "ar" } },
  { id: "hijaz-kar", latin: "Hijaz Kar", alsoSpelled: ["Hijazkar"], aliases: ["Hijazkar", "maqam hijaz kar"], native: { spelling: "حجاز كار", language: "Arabic", lang: "ar" } },
  { id: "nikriz", latin: "Nikriz", aliases: ["maqam nikriz"], native: { spelling: "نكريز", language: "Arabic", lang: "ar" } },
  { id: "rast", latin: "Rast", aliases: ["maqam rast", "Maqam Rast"], native: { spelling: "راست", language: "Arabic", lang: "ar" } },
  // Jewish prayer modes not already registered above.
  { id: "adonai-malakh", latin: "Adonai Malakh", alsoSpelled: ["Adonoi Malach"], aliases: ["Adonoi Malach", "Adonai Malach"], native: { spelling: "אדני מלך", language: "Hebrew", lang: "he-IL" } },
  { id: "magen-avot", latin: "Magen Avot", alsoSpelled: ["Mogen Ovos"], aliases: ["Mogen Ovos", "Magein Avot"], native: { spelling: "מגן אבות", language: "Hebrew", lang: "he-IL" } },
  // Turkish makams — Turkish orthography is Latin with diacritics, so the
  // native form is the diacritic spelling.
  { id: "hicaz", latin: "Hicaz", aliases: ["Hicaz makamı"], native: { spelling: "Hicaz", language: "Turkish", lang: "tr" } },
  { id: "hicazkar", latin: "Hicazkâr", alsoSpelled: ["Hicazkar"], aliases: ["Hicazkar"], native: { spelling: "Hicazkâr", language: "Turkish", lang: "tr" } },
  { id: "kurdi", latin: "Kürdî", alsoSpelled: ["Kurdi"], aliases: ["Kurdi", "Kürdi"], native: { spelling: "Kürdî", language: "Turkish", lang: "tr" } },
  { id: "nikriz-tr", latin: "Nikrîz", native: { spelling: "Nikrîz", language: "Turkish", lang: "tr" } },
  { id: "rast-tr", latin: "Rast makamı", aliases: ["Turkish Rast"], native: { spelling: "Rast makamı", language: "Turkish", lang: "tr" } },
  { id: "buselik", latin: "Buselik", alsoSpelled: ["Bûselik"], native: { spelling: "Bûselik", language: "Turkish", lang: "tr" } },
  // Chinese pentatonic modes (宫 gōng, 羽 yǔ) and the Japanese min'yō scale.
  { id: "gong-mode", latin: "Gong mode", alsoSpelled: ["gōng"], aliases: ["gong", "gōng", "gong scale"], native: { spelling: "宫", language: "Chinese", lang: "zh-Hans" } },
  { id: "yu-mode", latin: "Yu mode", alsoSpelled: ["yǔ"], aliases: ["yu", "yǔ", "yu scale"], native: { spelling: "羽", language: "Chinese", lang: "zh-Hans" } },
  { id: "minyo", latin: "Min'yō scale", alsoSpelled: ["minyo"], aliases: ["minyo", "min'yo scale", "minyo scale"], native: { spelling: "民謡音階", language: "Japanese", lang: "ja" } },
];

/** Words that have a real human recording get a speaker button. */
export function hasAudio(word: SpokenWord | undefined): word is SpokenWord & {
  audio: WordAudio;
} {
  return Boolean(word?.audio);
}

const BY_ID = new Map(WORDS.map((w) => [w.id, w]));

function latinPhrases(word: SpokenWord): string[] {
  return [word.latin, ...(word.alsoSpelled ?? []), ...(word.aliases ?? [])];
}

const PHRASE_TO_ID = new Map<string, string>();
for (const word of WORDS) {
  for (const phrase of latinPhrases(word)) {
    PHRASE_TO_ID.set(phrase.toLowerCase(), word.id);
  }
}

/**
 * Up to two English spellings other than what's already on screen — the
 * canonical `latin` plus `alsoSpelled`, skipping the current mention.
 */
export function englishAlts(word: SpokenWord, mention?: string): string[] {
  const shown = (mention ?? word.latin).toLowerCase();
  const out: string[] = [];
  for (const candidate of [word.latin, ...(word.alsoSpelled ?? [])]) {
    if (candidate.toLowerCase() === shown) continue;
    if (out.some((x) => x.toLowerCase() === candidate.toLowerCase())) continue;
    out.push(candidate);
    if (out.length === 2) break;
  }
  return out;
}

export function getWord(id: string): SpokenWord | undefined {
  return BY_ID.get(id) ?? getWordByPhrase(id);
}

/** Resolve a Latin mention ("Ahava Rabbah", "krechtz") to a registry entry. */
export function getWordByPhrase(phrase: string): SpokenWord | undefined {
  const id = PHRASE_TO_ID.get(phrase.toLowerCase());
  return id ? BY_ID.get(id) : undefined;
}

/**
 * Word to show next to a concept mention: prefer a phrase match (so
 * "Ahava Rabbah" gets Hebrew, not the Yiddish for *freygish*), then the
 * concept slug.
 */
export function wordForMention(
  conceptSlug: string,
  mention?: string,
): SpokenWord | undefined {
  if (mention) {
    const byPhrase = getWordByPhrase(mention);
    if (byPhrase) return byPhrase;
  }
  return getWord(conceptSlug);
}

export function isRtlLang(lang: string): boolean {
  const base = lang.split("-")[0];
  return base === "yi" || base === "he" || base === "ar" || base === "fa";
}

/** True when the native spelling is visually the same as the Latin we already showed. */
export function spellingDiffers(latin: string, spelling: string): boolean {
  return latin.normalize("NFC") !== spelling.normalize("NFC");
}

/** Native script + English alts for search haystacks. */
export function nativeSpellingsOf(id: string): string[] {
  const word = getWord(id);
  if (!word) return [];
  return [word.native.spelling, ...(word.alsoSpelled ?? [])];
}
