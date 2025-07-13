"use client";
import React, { createContext, useContext, useState } from "react";

export type DetectionMode = "standard" | "highAccuracy";

interface DetectionModeContextValue {
  mode: DetectionMode;
  setMode: (mode: DetectionMode) => void;
}

const DetectionModeContext = createContext<DetectionModeContextValue>({
  mode: "standard",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: () => {},
});

export const DetectionModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<DetectionMode>("standard");

  return (
    <DetectionModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DetectionModeContext.Provider>
  );
};

export const useDetectionMode = () => useContext(DetectionModeContext);
