import React, { useState } from "react";
import { ScaleCombination } from "../hooks/useScaleLogic";
import ScaleTheoryPanel from "./ScaleTheoryPanel";
import ChordTheoryPanel from "./ChordTheoryPanel";

interface MusicTheoryPanelProps {
  selectedScale: ScaleCombination;
  activeKeys: Set<string>;
  identifyChord: (activeNotes: Set<string>) => string;
}

const MusicTheoryPanel: React.FC<MusicTheoryPanelProps> = ({
  selectedScale,
  activeKeys,
  identifyChord,
}) => {
  const [expandedPanels, setExpandedPanels] = useState({
    scale: false,
    chord: false,
  });

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  return (
    <div className="space-y-3">
      <ScaleTheoryPanel
        selectedScale={selectedScale}
        isExpanded={expandedPanels.scale}
        onToggle={() => togglePanel("scale")}
      />
      <ChordTheoryPanel
        activeKeys={activeKeys}
        identifyChord={identifyChord}
        isExpanded={expandedPanels.chord}
        onToggle={() => togglePanel("chord")}
      />
    </div>
  );
};

export default MusicTheoryPanel;
