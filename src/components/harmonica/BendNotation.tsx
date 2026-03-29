"use client";

export default function BendNotation() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-3 mb-4">
      <h3 className="text-xs font-bold text-[#e8e6e1] uppercase tracking-wide mb-2">
        Reading the Bend Notation
      </h3>
      <div className="text-xs leading-relaxed text-[#b0aaa4]">
        <NotationExample code="Db'↓" description="draw bend, 1 semitone down (single bend)" />
        <NotationExample code="F''↓" description="draw bend, 2 semitones down (double bend)" />
        <NotationExample code="Ab'''↓" description="draw bend, 3 semitones down (triple — hole 3 only)" />
        <NotationExample code="Eb'↑" description="blow bend, 1 semitone down (holes 8–10)" />
        <p className="mt-2 text-[11px] text-[#8a8680] italic">
          In the upper register (holes 7–10), the blow note is higher than the
          draw note — so bends go on the blow side. Deeper bends = harder
          technique.
        </p>
      </div>
    </div>
  );
}

function NotationExample({
  code,
  description,
}: {
  code: string;
  description: string;
}) {
  return (
    <div className="mb-1">
      <code className="bg-[#1e1e28] py-px px-1.5 rounded text-[11px] text-[#ccc]">
        {code}
      </code>{" "}
      = {description}
    </div>
  );
}
