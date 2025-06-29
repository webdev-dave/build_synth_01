"use client";
import React, { createContext, useContext, useState } from "react";

interface TooltipContextValue {
  enabled: boolean;
  toggle: () => void;
}

const TooltipContext = createContext<TooltipContextValue>({
  enabled: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggle: () => {},
});

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enabled, setEnabled] = useState(true);

  const toggle = () => setEnabled((prev) => !prev);

  return (
    <TooltipContext.Provider value={{ enabled, toggle }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltipConfig = () => useContext(TooltipContext);
