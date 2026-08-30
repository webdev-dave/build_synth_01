import type { TimeSignature } from "@/lib/music";
import { documentTotalBeats } from "@/lib/song/stats";

import type { SongEntry, SongId } from "./types";
import { yesterdayV1, yesterdayV2 } from "./yesterday";
import { yesterdayBeatles } from "./yesterday-beatles";
import { beiMirBistDuSchon } from "./bei-mir-bist-du-schon";
import { tumbalalaika } from "./tumbalalaika";
import { tumbalalaikaPanamarjov } from "./tumbalalaika-panamarjov";
import { hopakKatsatske } from "./hopak-katsatske";
import { havaNagila } from "./hava-nagila";
import { anniversaryWaltz } from "./anniversary-waltz";
import { sherele } from "./sherele";
import { adirHu } from "./adir-hu";
import { anniversaryWaltzChanesseValts } from "./anniversary-waltz-chanesse-valts";
import { atVaani } from "./at-vaani";
import { baymRebinsSudeAtTheRabbisTable } from "./baym-rebins-sude-at-the-rabbis-table";
import { laBelleCatherine } from "./la-belle-catherine";
import { epsteinBulgarV } from "./epstein-bulgar-v";
import { hasidicWaltz } from "./hasidic-waltz";
import { josefinsDopvals } from "./josefins-dopvals";
import { odYishoma } from "./od-yishoma";
import { khupaJig } from "./khupa-jig";
import { khupaTanz } from "./khupa-tanz";
import { keshJigKincoraJig } from "./kesh-jig-kincora-jig";
import { derHeyserJig } from "./der-heyser-jig";
import { jumpAtTheSun } from "./jump-at-the-sun";
import { bulgarCharlesCormans } from "./bulgar-charles-cormans";
import { bulgarHenryWeinsteins } from "./bulgar-henry-weinsteins";
import { russianFreilachBm } from "./russian-freilach-bm";
import { russianFreilachAm } from "./russian-freilach-am";
import { bulgarJoeKutchers } from "./bulgar-joe-kutchers";
import { derShtillerBulgarAndTheAngelsSing } from "./der-shtiller-bulgar-and-the-angels-sing";
import { simanTov } from "./siman-tov";
import { sherFromKhevrisa } from "./sher-from-khevrisa";
import { derBadchenFreylach } from "./der-badchen-freylach";
import { lmaAnAchai } from "./lma-an-achai";
import { lemaAnAchai } from "./lema-an-achai";
import { theRabbisHornpipe } from "./the-rabbis-hornpipe";
import { shalomAleichem } from "./shalom-aleichem";
import { baymRebinsSude } from "./baym-rebins-sude";
import { derShtillerBulgar } from "./der-shtiller-bulgar";
import { gypsyBulgar } from "./gypsy-bulgar";
import { flatbushWaltz } from "./flatbush-waltz";
import { russianFreilachDm } from "./russian-freilach-dm";
import { russianFreilachEm } from "./russian-freilach-em";
import { heyserBulgarDer } from "./heyser-bulgar-der";
import { andTheAngelsSingDerShtillerBulgar } from "./and-the-angels-sing-der-shtiller-bulgar";
import { bulgarFrailach } from "./bulgar-frailach";
import { aGlezeleLchaym } from "./a-glezele-lchaym";
import { aNachtInGanEydn } from "./a-nacht-in-gan-eydn";
import { aDreideleFarAlle } from "./a-dreidele-far-alle";
import { aGlezeleYash } from "./a-glezele-yash";
import { albukerke } from "./albukerke";
import { aleBrider } from "./ale-brider";
import { anushka } from "./anushka";
import { araberTanz } from "./araber-tanz";
import { arumDemFayer } from "./arum-dem-fayer";
import { ayliLyuli } from "./ayli-lyuli";
import { baymRebnsSude } from "./baym-rebns-sude";
import { beiMirBistuShein } from "./bei-mir-bistu-shein";
import { belz } from "./belz";
import { bbMinorBulgar } from "./bb-minor-bulgar";
import { bessarabyanke } from "./bessarabyanke";
import { bessarabyankeshalomAleichim } from "./bessarabyankeshalom-aleichim";
import { blok } from "./blok";
import { boboverWeddingMarch } from "./bobover-wedding-march";
import { branelesChasene } from "./braneles-chasene";
import { broygesTantz } from "./broyges-tantz";
import { buhusherChosidl } from "./buhusher-chosidl";
import { chaseneValtz } from "./chasene-valtz";
import { chava } from "./chava";
import { chosen } from "./chosen";
import { chupenTanz } from "./chupen-tanz";
import { dansFreilach } from "./dans-freilach";
import { demMilnersTrern } from "./dem-milners-trern";
import { demRebnsNign } from "./dem-rebns-nign";
import { derGasnNigun } from "./der-gasn-nigun";
import { derYidInYerusholayim } from "./der-yid-in-yerusholayim";
import { diGoldeneChasene } from "./di-goldene-chasene";
import { diGrineKusine } from "./di-grine-kusine";
import { diZilberneKasene } from "./di-zilberne-kasene";
import { donaDona } from "./dona-dona";
import { dreiDreidele } from "./drei-dreidele";
import { essenEsstZich } from "./essen-esst-zich";
import { freilag } from "./freilag";
import { freitogNokhnTsimes } from "./freitog-nokhn-tsimes";
import { freylekhsFunDerKhupe } from "./freylekhs-fun-der-khupe";
import { freylekheMekhutonim } from "./freylekhe-mekhutonim";
import { heyserBulgar } from "./heyser-bulgar";
import { hobIchMirAnAltnDajm } from "./hob-ich-mir-an-altn-dajm";
import { hopkele } from "./hopkele";
import { hora } from "./hora";
import { derHoyfzinger } from "./der-hoyfzinger";
import { itamarFreilach } from "./itamar-freilach";
import { itsikHotKhaseneGehat } from "./itsik-hot-khasene-gehat";
import { kamjenslFreilach } from "./kamjensl-freilach";
import { kesheneverBulgar } from "./keshenever-bulgar";
import { khosnKaleMazeltov } from "./khosn-kale-mazeltov";
import { klez } from "./klez";
import { lebedichUnFreilech } from "./lebedich-un-freilech";
import { longLiveTheNigun } from "./long-live-the-nigun";
import { maynRuePlatz } from "./mayn-rue-platz";
import { maynTayereOdessa } from "./mayn-tayere-odessa";
import { mazltov } from "./mazltov";
import { mechoetenesteMajne } from "./mechoeteneste-majne";
import { medyatsinerWalz } from "./medyatsiner-walz";
import { medyatsinerSerie } from "./medyatsiner-serie";
import { mekhutenesteMayne } from "./mekhuteneste-mayne";
import { mitzvaTants } from "./mitzva-tants";
import { naftuleShpilEsNokhAmol } from "./naftule-shpil-es-nokh-amol";
import { nigun } from "./nigun";
import { nignNo } from "./nign-no";
import { nyeZuritseChloptsi } from "./nye-zuritse-chloptsi";
import { odessaBulgarish } from "./odessa-bulgarish";
import { ohYosselYossel } from "./oh-yossel-yossel";
import { oifnPripetshok } from "./oifn-pripetshok";
import { ojfnVegStejtABojm } from "./ojfn-veg-stejt-a-bojm";
import { ojDortn } from "./oj-dortn";
import { ojTate } from "./oj-tate";
import { otAzoy } from "./ot-azoy";
import { papirossen } from "./papirossen";
import { patshTantz } from "./patsh-tantz";
import { regndl } from "./regndl";
import { reina } from "./reina";
import { rusisheSher } from "./rusishe-sher";
import { schwartzsSirba } from "./schwartzs-sirba";
import { shabesInVilna } from "./shabes-in-vilna";
import { shalomAleichim } from "./shalom-aleichim";
import { shiribim } from "./shiribim";
import { sholemZolZajn } from "./sholem-zol-zajn";
import { shpilZheMirALideleInYidish } from "./shpil-zhe-mir-a-lidele-in-yidish";
import { shpraizIchMir } from "./shpraiz-ich-mir";
import { shverUnShviger } from "./shver-un-shviger";
import { simchasToyre } from "./simchas-toyre";
import { sirba } from "./sirba";
import { sonya } from "./sonya";

/** Piano Roll default — the full MIDI arrangement, not the hero drafts. */
export const DEFAULT_SONG_ID: SongId = "yesterday-beatles";

/**
 * Append new tunes here. Order is display order; search is independent.
 */
export const SONGS: SongEntry[] = [
  yesterdayBeatles,
  yesterdayV2,
  yesterdayV1,
  beiMirBistDuSchon,
  tumbalalaika,
  tumbalalaikaPanamarjov,
  hopakKatsatske,
  havaNagila,
  anniversaryWaltz,
  sherele,
  adirHu,
  anniversaryWaltzChanesseValts,
  atVaani,
  baymRebinsSudeAtTheRabbisTable,
  laBelleCatherine,
  epsteinBulgarV,
  hasidicWaltz,
  josefinsDopvals,
  odYishoma,
  khupaJig,
  khupaTanz,
  keshJigKincoraJig,
  derHeyserJig,
  jumpAtTheSun,
  bulgarCharlesCormans,
  bulgarHenryWeinsteins,
  russianFreilachBm,
  russianFreilachAm,
  bulgarJoeKutchers,
  derShtillerBulgarAndTheAngelsSing,
  simanTov,
  sherFromKhevrisa,
  derBadchenFreylach,
  lmaAnAchai,
  lemaAnAchai,
  theRabbisHornpipe,
  shalomAleichem,
  baymRebinsSude,
  derShtillerBulgar,
  gypsyBulgar,
  flatbushWaltz,
  russianFreilachDm,
  russianFreilachEm,
  heyserBulgarDer,
  andTheAngelsSingDerShtillerBulgar,
  bulgarFrailach,
  aGlezeleLchaym,
  aNachtInGanEydn,
  aDreideleFarAlle,
  aGlezeleYash,
  albukerke,
  aleBrider,
  anushka,
  araberTanz,
  arumDemFayer,
  ayliLyuli,
  baymRebnsSude,
  beiMirBistuShein,
  belz,
  bbMinorBulgar,
  bessarabyanke,
  bessarabyankeshalomAleichim,
  blok,
  boboverWeddingMarch,
  branelesChasene,
  broygesTantz,
  buhusherChosidl,
  chaseneValtz,
  chava,
  chosen,
  chupenTanz,
  dansFreilach,
  demMilnersTrern,
  demRebnsNign,
  derGasnNigun,
  derYidInYerusholayim,
  diGoldeneChasene,
  diGrineKusine,
  diZilberneKasene,
  donaDona,
  dreiDreidele,
  essenEsstZich,
  freilag,
  freitogNokhnTsimes,
  freylekhsFunDerKhupe,
  freylekheMekhutonim,
  heyserBulgar,
  hobIchMirAnAltnDajm,
  hopkele,
  hora,
  derHoyfzinger,
  itamarFreilach,
  itsikHotKhaseneGehat,
  kamjenslFreilach,
  kesheneverBulgar,
  khosnKaleMazeltov,
  klez,
  lebedichUnFreilech,
  longLiveTheNigun,
  maynRuePlatz,
  maynTayereOdessa,
  mazltov,
  mechoetenesteMajne,
  medyatsinerWalz,
  medyatsinerSerie,
  mekhutenesteMayne,
  mitzvaTants,
  naftuleShpilEsNokhAmol,
  nigun,
  nignNo,
  nyeZuritseChloptsi,
  odessaBulgarish,
  ohYosselYossel,
  oifnPripetshok,
  ojfnVegStejtABojm,
  ojDortn,
  ojTate,
  otAzoy,
  papirossen,
  patshTantz,
  regndl,
  reina,
  rusisheSher,
  schwartzsSirba,
  shabesInVilna,
  shalomAleichim,
  shiribim,
  sholemZolZajn,
  shpilZheMirALideleInYidish,
  shpraizIchMir,
  shverUnShviger,
  simchasToyre,
  sirba,
  sonya,
];

export function getSong(id: SongId): SongEntry | undefined {
  return SONGS.find((song) => song.id === id);
}

export function getDefaultSong(): SongEntry {
  return getSong(DEFAULT_SONG_ID) ?? SONGS[0];
}

/** Case-insensitive match on id, title, subtitle, and labels. Empty query = all. */
export function searchSongs(
  query: string,
  catalog: SongEntry[] = SONGS,
): SongEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return catalog;
  return catalog.filter((song) => {
    const hay = [
      song.id,
      song.title,
      song.subtitle ?? "",
      ...(song.labels ?? []),
      song.source?.url ?? "",
      song.source?.filename ?? "",
      song.source?.fileUrl ?? "",
      song.source?.collection ?? "",
      song.source?.note ?? "",
      song.document?.meta.artist ?? "",
      song.document?.meta.key ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function songBeatsPerBar(song: SongEntry): number {
  return songTimeSignature(song)[0];
}

export function songTimeSignature(song: SongEntry): TimeSignature {
  const ts = song.document?.meta.timeSignature;
  if (ts && ts.length >= 2) return [ts[0], ts[1]];
  return [4, 4];
}

export function songBars(song: SongEntry): number {
  if (song.bars && song.bars > 0) return song.bars;
  if (song.document) {
    const beats = documentTotalBeats(song.document);
    const [num, den] = songTimeSignature(song);
    const quartersPerBar = num * (4 / den);
    return Math.max(1, Math.ceil(beats / quartersPerBar));
  }
  const beats = song.melody.reduce((sum, ev) => sum + ev.beats, 0);
  return Math.max(1, Math.ceil(beats / 4));
}
