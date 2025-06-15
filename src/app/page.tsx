"use client";
// import Oscillator from '@/components/Oscillator';
import { SynthKeyboard } from "../instruments";

export default function Home() {
  return (
    <main>
      <div className="bg-synth-bg p-6 rounded-md border-2 max-w-[1200px] min-h-[90vh] mx-auto">
        <h1 className="text-3xl pb-4 font-bold">Synth-v01</h1>
        <SynthKeyboard />
      </div>
    </main>
  );
}
