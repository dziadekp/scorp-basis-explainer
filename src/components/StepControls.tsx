"use client";

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  isMuted: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggleMute: () => void;
}

export default function StepControls({
  currentStep,
  totalSteps,
  isMuted,
  onNext,
  onPrev,
  onToggleMute,
}: StepControlsProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
      {/* Back */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isFirst
            ? "text-slate-600 cursor-not-allowed"
            : "text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95"
        }`}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Progress + Mute */}
      <div className="flex items-center gap-3">
        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 h-1.5 bg-blue-500"
                  : i < currentStep
                    ? "w-3 h-1.5 bg-blue-400/40"
                    : "w-3 h-1.5 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
          isLast
            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
            : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
        }`}
      >
        {isLast ? "Start Over" : "Next"}
        {!isLast && (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
