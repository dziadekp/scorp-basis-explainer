"use client";

import type { InteractiveButton } from "@/types";

interface InteractivePanelProps {
  buttons: InteractiveButton[];
  onAction: (button: InteractiveButton) => void;
  onReset: () => void;
  hasChanges: boolean;
}

export default function InteractivePanel({
  buttons,
  onAction,
  onReset,
  hasChanges,
}: InteractivePanelProps) {
  if (!buttons.length) return null;

  const colorMap: Record<string, string> = {
    green: "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30",
    red: "bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30",
    amber: "bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30",
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Try it yourself
        </span>
        {hasChanges && (
          <button
            onClick={onReset}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors underline"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => onAction(btn)}
            className={`interactive-btn px-3 py-1.5 rounded-md border text-xs font-medium transition-all active:scale-95 ${colorMap[btn.color] || colorMap.green}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
