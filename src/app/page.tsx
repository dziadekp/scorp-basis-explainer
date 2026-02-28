"use client";

import { useState, useCallback, useEffect } from "react";
import { STEPS } from "@/components/steps";
import ProportionalTower from "@/components/ProportionalTower";
import BenjiNarrator from "@/components/BenjiNarrator";
import InteractivePanel from "@/components/InteractivePanel";
import StepControls from "@/components/StepControls";
import { useVoice } from "@/hooks/useVoice";
import type { InteractiveButton } from "@/types";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [interactiveExtra, setInteractiveExtra] = useState({ stockDelta: 0, debtDelta: 0 });
  const [reactionText, setReactionText] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const step = STEPS[currentStep];
  const { speakStep, speakDynamic, stop, isSpeaking } = useVoice({ isMuted });

  // Persist mute preference
  useEffect(() => {
    const saved = localStorage.getItem("benji-muted");
    if (saved === "true") setIsMuted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("benji-muted", String(isMuted));
  }, [isMuted]);

  const resetInteractive = useCallback(() => {
    setInteractiveExtra({ stockDelta: 0, debtDelta: 0 });
    setReactionText(null);
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      stop();
      setCurrentStep(index);
      setAnimationKey((k) => k + 1);
      resetInteractive();
      setReactionText(null);
      // Play voice for new step (slight delay for animation sync)
      setTimeout(() => speakStep(STEPS[index].id), 400);
    },
    [stop, resetInteractive, speakStep]
  );

  const goNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      goToStep(0);
    }
  }, [currentStep, goToStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleInteractive = useCallback(
    (button: InteractiveButton) => {
      setInteractiveExtra((prev) => ({
        stockDelta: prev.stockDelta + (button.stack === "stock" ? button.amountDelta : 0),
        debtDelta: prev.debtDelta + (button.stack === "debt" ? button.amountDelta : 0),
      }));
      setReactionText(button.benjiReaction);
      speakDynamic(button.benjiReaction);
    },
    [speakDynamic]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      if (!m) stop();
      return !m;
    });
  }, [stop]);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    speakStep(STEPS[0].id);
  }, [speakStep]);

  // Start screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            S-Corp Shareholder Basis
          </h1>
          <p className="text-slate-400 mb-2">
            An interactive visual guide to understanding stock basis and debt basis
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Benji will walk you through 8 key concepts with animations you can interact with.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/25"
          >
            Start the Tour
          </button>
          <p className="text-xs text-slate-600 mt-4">
            Sound will play. You can mute at any time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">S-Corp Basis</span>
          </div>

          {/* Step tabs */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={`w-7 h-7 text-xs rounded-md font-medium transition-all ${
                  i === currentStep
                    ? "bg-blue-600 text-white"
                    : i < currentStep
                      ? "bg-slate-700 text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-600 hidden sm:block">PTN Accounting</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[580px]">
          {/* Tower Canvas — 3 columns */}
          <div className="lg:col-span-3 flex items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-4 sm:p-6">
            <ProportionalTower
              step={step}
              animationKey={animationKey}
              interactiveExtra={interactiveExtra}
            />
          </div>

          {/* Benji + Controls — 2 columns */}
          <div className="lg:col-span-2 flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 p-4 sm:p-5">
            {/* Step title */}
            <div className="mb-4">
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{step.title}</h2>
            </div>

            {/* Benji */}
            <div className="flex-1 overflow-y-auto">
              <BenjiNarrator
                pose={step.benjiPose}
                narrationLines={step.narration}
                reactionText={reactionText}
                animationKey={animationKey}
                isSpeaking={isSpeaking}
              />

              {/* IRC Reference */}
              {step.highlightRule && (
                <div className="mt-4 px-3 py-2 rounded-lg bg-slate-800/60 border-l-3 border-blue-500">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {step.highlightRule}
                  </p>
                </div>
              )}

              {/* Interactive buttons */}
              <InteractivePanel
                buttons={step.interactiveButtons || []}
                onAction={handleInteractive}
                onReset={resetInteractive}
                hasChanges={interactiveExtra.stockDelta !== 0 || interactiveExtra.debtDelta !== 0}
              />
            </div>

            {/* Navigation */}
            <StepControls
              currentStep={currentStep}
              totalSteps={STEPS.length}
              isMuted={isMuted}
              onNext={goNext}
              onPrev={goPrev}
              onToggleMute={toggleMute}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <p className="text-[10px] text-slate-600">
            For educational purposes only. Consult your tax advisor.
          </p>
          <p className="text-[10px] text-slate-600">
            PTN Accounting
          </p>
        </div>
      </footer>
    </div>
  );
}
