import { useCallback } from "react";

export type TabType = "synth" | "pitch-detector";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onTabCleanup?: (previousTab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
  onTabCleanup,
}: TabNavigationProps) {
  const handleTabClick = useCallback(
    (newTab: TabType) => {
      if (newTab === activeTab) return;

      // Trigger cleanup for the previous tab
      if (onTabCleanup) {
        onTabCleanup(activeTab);
      }

      onTabChange(newTab);
    },
    [activeTab, onTabChange, onTabCleanup]
  );

  const tabs = [
    { id: "synth" as const, label: "🎹 Play Synth", icon: "🎹" },
    { id: "pitch-detector" as const, label: "🎤 Key Detector", icon: "🎤" },
  ];

  return (
    <div className="flex justify-center mb-4">
      <div className="flex bg-synth-bg rounded-lg p-1 border-2 border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-6 py-3 rounded-md font-medium transition-all duration-200
              flex items-center gap-2
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-blue-800/50"
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label.replace(/^🎹 |^🎤 /, "")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
