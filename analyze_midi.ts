import fs from 'fs';
import { Midi } from '@tonejs/midi';

async function analyze() {
  const midiData = fs.readFileSync('C:/Users/elido/Downloads/beatles-yesterday.mid');
  const midi = new Midi(midiData);

  const chordTrack = midi.tracks[2];
  const bassTrack = midi.tracks[1];

  console.log("Chords from 12s to 18s (Yesterday... far away):");
  chordTrack.notes.filter(n => n.time >= 11.5 && n.time <= 18.5).forEach(n => {
    console.log(`time: ${n.time.toFixed(2)}, name: ${n.name}`);
  });

  console.log("\nChords from 23s to 28s (Oh I believe...):");
  chordTrack.notes.filter(n => n.time >= 23.0 && n.time <= 28.0).forEach(n => {
    console.log(`time: ${n.time.toFixed(2)}, name: ${n.name}`);
  });
}

analyze().catch(console.error);
