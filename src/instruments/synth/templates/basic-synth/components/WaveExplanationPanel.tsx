import React from "react";
import { OscillatorType } from "../hooks/useAudioSynthesis";

interface WaveExplanationPanelProps {
  waveType: OscillatorType;
}

interface WaveInfo {
  name: string;
  description: string;
  characteristics: string;
  harmonics: string;
  commonUses: string[];
  visualDescription: string;
  timbreDescription: string;
}

const WaveExplanationPanel: React.FC<WaveExplanationPanelProps> = ({
  waveType,
}) => {
  const getWaveInfo = (): WaveInfo => {
    const waveInfoMap: Record<OscillatorType, WaveInfo> = {
      sine: {
        name: "SINE",
        description: "Pure tone with no harmonics",
        characteristics: "Clean • Smooth • Pure",
        harmonics: "FUNDAMENTAL ONLY",
        commonUses: ["Sub-bass", "Test tones", "Flutes"],
        visualDescription: "~~~~~",
        timbreDescription: "Bell-like, very clean",
      },
      square: {
        name: "SQUARE",
        description: "Digital wave with odd harmonics",
        characteristics: "Buzzy • Hollow • Digital",
        harmonics: "ODD HARMONICS (1,3,5,7...)",
        commonUses: ["Retro games", "Synth leads", "Chiptune"],
        visualDescription: "⎺⎽⎺⎽⎺",
        timbreDescription: "Classic video game sound",
      },
      sawtooth: {
        name: "SAWTOOTH",
        description: "Bright wave with all harmonics",
        characteristics: "Bright • Rich • Cutting",
        harmonics: "ALL HARMONICS (1,2,3,4...)",
        commonUses: ["Bass synth", "String pads", "Leads"],
        visualDescription: "/|/|/|",
        timbreDescription: "Buzzy, rich texture",
      },
      triangle: {
        name: "TRIANGLE",
        description: "Soft wave with weak harmonics",
        characteristics: "Warm • Mellow • Soft",
        harmonics: "WEAK ODD HARMONICS",
        commonUses: ["Soft pads", "Mellow leads", "Ambient"],
        visualDescription: "/\\/\\/\\",
        timbreDescription: "Warmer than sine, softer than square",
      },
    };

    return waveInfoMap[waveType];
  };

  const waveInfo = getWaveInfo();

  return (
    <div className="h-[200px] overflow-y-auto">
      <div className="px-4 pb-4 space-y-4">
        {/* Retro Computer Display */}
        <div className="bg-black border-2 border-green-500 p-4 font-mono text-green-400 text-sm">
          <div className="border-b border-green-500 pb-2 mb-3">
            <span className="text-green-300">WAVE_TYPE:</span> {waveInfo.name}
          </div>

          {/* Waveform Visual */}
          <div className="bg-gray-900 p-3 rounded border border-green-600">
            <div className="text-center mb-2 text-green-300">WAVEFORM</div>
            <div className="text-center text-2xl font-bold text-green-400 tracking-widest">
              {waveInfo.visualDescription}
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
            <div>
              <span className="text-green-300">TYPE:</span>
              <br />
              <span className="text-white">{waveInfo.description}</span>
            </div>
            <div>
              <span className="text-green-300">SOUND:</span>
              <br />
              <span className="text-white">{waveInfo.timbreDescription}</span>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-gray-900 border border-cyan-500 p-3 font-mono text-cyan-300 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span>HARMONIC_CONTENT</span>
            <span className="text-cyan-400">●●●</span>
          </div>
          <div className="text-white text-xs mb-3">{waveInfo.harmonics}</div>

          <div className="flex justify-between items-center mb-2">
            <span>CHARACTERISTICS</span>
            <span className="text-cyan-400">●●●</span>
          </div>
          <div className="text-white text-xs">{waveInfo.characteristics}</div>
        </div>

        {/* Common Uses */}
        <div className="bg-gray-800 border border-yellow-500 p-3">
          <div className="text-yellow-400 font-mono text-sm mb-2">
            COMMON_APPLICATIONS
          </div>
          <div className="flex flex-wrap gap-2">
            {waveInfo.commonUses.map((use, index) => (
              <span
                key={use}
                className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs font-mono border border-yellow-600"
              >
                {String(index + 1).padStart(2, "0")}.{use}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-blue-900 border-l-4 border-blue-400 p-3">
          <div className="text-blue-300 font-mono text-xs mb-1">TIP:</div>
          <div className="text-blue-100 text-sm">
            Try changing wave types while playing the same note to hear the
            difference in character.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveExplanationPanel;
