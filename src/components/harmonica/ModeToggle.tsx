"use client";

export type LookupMode = "songKey" | "harpKey";

interface ModeToggleProps {
  mode: LookupMode;
  onModeChange: (mode: LookupMode) => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const options: { key: LookupMode; label: string }[] = [
    { key: "songKey", label: "I know the song key" },
    { key: "harpKey", label: "I have a harp" },
  ];

  return (
    <div className="flex bg-[#16161e] rounded-xl p-[3px] mb-4 border border-[#2a2a35]">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onModeChange(opt.key)}
          className={`flex-1 py-2.5 px-2 border-none rounded-lg cursor-pointer text-[13px] font-semibold font-[inherit] transition-all duration-200 ${
            mode === opt.key
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
              : "bg-transparent text-[#8a8680] hover:text-[#a0a090]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
