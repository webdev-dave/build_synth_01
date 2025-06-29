"use client";
import { HelpCircle } from "lucide-react";
import { useTooltipConfig } from "./TooltipContext";
import Tooltip from "./Tooltip";

export default function TooltipToggleButton() {
  const { enabled, toggle } = useTooltipConfig();

  return (
    <div className="fixed bottom-3 right-3 z-[1001]">
      <Tooltip
        message={enabled ? "Disable helper tooltips" : "Enable helper tooltips"}
        placement="left"
        alignX="right"
        forceEnabled
      >
        <button
          onClick={toggle}
          className={`p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            enabled
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white`}
          aria-pressed={enabled}
          aria-label={enabled ? "Disable tooltips" : "Enable tooltips"}
        >
          <HelpCircle size={18} />
        </button>
      </Tooltip>
    </div>
  );
}
