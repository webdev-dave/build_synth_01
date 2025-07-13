/*
  Simple key detection based on Krumhansl pitch-class profile correlation.
  Usage:
    const kd = new KeyDetector();
    kd.addPitchMidi(60); // C4
    const { key, confidence } = kd.getCurrentKey();
*/

export type KeyMode = "major" | "minor";

interface KeyEstimate {
  tonicPc: number; // 0-11, where 0 === C, 1 === C♯/D♭, etc.
  mode: KeyMode;
  confidence: number; // Pearson correlation coefficient 0-1
  name: string; // e.g. "G major"
}

const PITCH_CLASS_COUNT = 12;

// Krumhansl–Kessler key profiles (major/minor)
const KRUMHANSL_MAJOR = [
  6.35, // C
  2.23, // C#
  3.48, // D
  2.33, // D#
  4.38, // E
  4.09, // F
  2.52, // F#
  5.19, // G
  2.39, // G#
  3.66, // A
  2.29, // A#
  2.88, // B
];

const KRUMHANSL_MINOR = [
  6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
];

function rotateArray(arr: number[], semitones: number): number[] {
  const len = arr.length;
  return arr.map((_, i) => arr[(i - semitones + len) % len]);
}

function pearsonCorrelation(a: number[], b: number[]): number {
  const n = a.length;
  let sumA = 0,
    sumB = 0,
    sumA2 = 0,
    sumB2 = 0,
    sumAB = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i];
    const y = b[i];
    sumA += x;
    sumB += y;
    sumA2 += x * x;
    sumB2 += y * y;
    sumAB += x * y;
  }
  const numerator = n * sumAB - sumA * sumB;
  const denominator = Math.sqrt(
    (n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB)
  );
  return denominator === 0 ? 0 : numerator / denominator;
}

export class KeyDetector {
  private histogram: number[];
  private decayFactor: number;

  constructor(decayFactor = 0.97) {
    this.histogram = new Array(PITCH_CLASS_COUNT).fill(0);
    this.decayFactor = decayFactor;
  }

  /**
   * Decay existing histogram values.
   */
  private decay() {
    for (let i = 0; i < PITCH_CLASS_COUNT; i++) {
      if (this.decayFactor < 1) this.histogram[i] *= this.decayFactor;
    }
  }

  /**
   * Add a single MIDI pitch value (integer).
   */
  addPitchMidi(midi: number, weight = 1) {
    this.decay();
    const pc = ((Math.round(midi) % 12) + 12) % 12;
    this.histogram[pc] += weight;
  }

  /**
   * Add multiple notes (array of objects with pitchMidi) at once.
   */
  addNotes(notes: { pitchMidi: number }[]) {
    if (notes.length === 0) return;
    this.decay();
    for (const n of notes) {
      const pc = ((Math.round(n.pitchMidi) % 12) + 12) % 12;
      this.histogram[pc] += 1;
    }
  }

  /**
   * Get current key estimate.
   */
  getCurrentKey(): KeyEstimate {
    // Normalize histogram to sum=1 for correlation stability
    const sum = this.histogram.reduce((a, b) => a + b, 0) || 1;
    const normalized = this.histogram.map((v) => v / sum);

    let bestKey: KeyEstimate = {
      tonicPc: 0,
      mode: "major",
      confidence: 0,
      name: "C major",
    };

    for (let tonic = 0; tonic < 12; tonic++) {
      const majorProfile = rotateArray(KRUMHANSL_MAJOR, tonic);
      const minorProfile = rotateArray(KRUMHANSL_MINOR, tonic);

      const corrMaj = pearsonCorrelation(normalized, majorProfile);
      if (corrMaj > bestKey.confidence) {
        bestKey = {
          tonicPc: tonic,
          mode: "major",
          confidence: corrMaj,
          name: `${pcToName(tonic)} major`,
        };
      }
      const corrMin = pearsonCorrelation(normalized, minorProfile);
      if (corrMin > bestKey.confidence) {
        bestKey = {
          tonicPc: tonic,
          mode: "minor",
          confidence: corrMin,
          name: `${pcToName(tonic)} minor`,
        };
      }
    }

    return bestKey;
  }

  reset() {
    this.histogram.fill(0);
  }

  setDecayFactor(f: number) {
    this.decayFactor = f;
  }
}

function pcToName(pc: number): string {
  const names = [
    "C",
    "C♯/D♭",
    "D",
    "D♯/E♭",
    "E",
    "F",
    "F♯/G♭",
    "G",
    "G♯/A♭",
    "A",
    "A♯/B♭",
    "B",
  ];
  return names[pc] ?? "";
}
