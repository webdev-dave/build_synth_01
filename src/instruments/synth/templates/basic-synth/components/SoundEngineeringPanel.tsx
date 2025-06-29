import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { OscillatorType } from "../hooks/useAudioSynthesis";
import WaveExplanationPanel from "./WaveExplanationPanel";

interface SoundEngineeringPanelProps {
  waveType: OscillatorType;
}

const SoundEngineeringPanel: React.FC<SoundEngineeringPanelProps> = ({
  waveType,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const getWaveName = (type: OscillatorType): string => {
    const waveNames: Record<OscillatorType, string> = {
      sine: "SINE",
      square: "SQUARE",
      sawtooth: "SAWTOOTH",
      triangle: "TRIANGLE",
    };
    return waveNames[type];
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg border border-gray-700 text-white">
      <button
        onClick={togglePanel}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
      >
        <h3 className="text-lg font-semibold text-green-400 mx-auto">
          🔊 Sound Engineering &gt; Wave: {getWaveName(waveType)}
        </h3>
        {isExpanded ? (
          <ChevronUp
            className="text-green-400"
            size={20}
          />
        ) : (
          <ChevronDown
            className="text-green-400"
            size={20}
          />
        )}
      </button>
      {isExpanded && <WaveExplanationPanel waveType={waveType} />}
    </div>
  );
};

export default SoundEngineeringPanel;
