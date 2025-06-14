// Synthesizer utility functions for key generation and calculations

export interface SynthKey {
  note: string;
  noteNumber: number;
  frequency: number;
  isBlack: boolean;
}

// Generate synthesizer keys for a given starting octave
export function createSynthKeys(startOctave: number): SynthKey[] {
  const keys: SynthKey[] = [];
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // Generate 2 octaves worth of keys (24 keys total)
  for (let octave = startOctave; octave < startOctave + 2; octave++) {
    for (let i = 0; i < noteNames.length; i++) {
      const noteName = noteNames[i];
      const noteNumber = octave * 12 + i;
      const frequency = 440 * Math.pow(2, (noteNumber - 69) / 12); // A4 = 440Hz
      const isBlack = noteName.includes("#");

      keys.push({
        note: `${noteName}${octave}`,
        noteNumber,
        frequency,
        isBlack,
      });
    }
  }

  return keys;
}

// Calculate frequency for a given MIDI note number
export function noteNumberToFrequency(noteNumber: number): number {
  return 440 * Math.pow(2, (noteNumber - 69) / 12);
}

// Convert note name to MIDI note number
export function noteNameToNumber(noteName: string): number {
  const noteMap: { [key: string]: number } = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };

  const match = noteName.match(/^([A-G]#?)(\d+)$/);
  if (!match) return 0;

  const [, note, octaveStr] = match;
  const octave = parseInt(octaveStr);

  return octave * 12 + (noteMap[note] || 0);
}

// Get the base note name without octave
export function getBaseNoteName(noteName: string): string {
  return noteName.replace(/\d+$/, "");
}
