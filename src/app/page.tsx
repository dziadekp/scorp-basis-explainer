"use client";

import { useState, useCallback } from "react";
import BasisBlocks from "@/components/BasisBlocks";
import NarrationPanel from "@/components/NarrationPanel";
import { STEPS } from "@/components/steps";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const goNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      setAnimationKey((k) => k + 1);
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setAnimationKey((k) => k + 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    setCurrentStep(index);
    setAnimationKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">S-Corp Shareholder Basis</h1>
              <p className="text-xs text-slate-500">Interactive Visual Explainer</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  i === currentStep
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full min-h-[600px]">
          {/* Animation canvas — 3 columns */}
          <div className="lg:col-span-3 flex items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6">
            <BasisBlocks step={step} animationKey={animationKey} />
          </div>

          {/* Narration panel — 2 columns */}
          <div className="lg:col-span-2 flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
            <NarrationPanel
              step={step}
              currentStep={currentStep}
              totalSteps={STEPS.length}
              animationKey={animationKey}
            />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isFirst
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95"
                }`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <button
                onClick={isLast ? () => goToStep(0) : goNext}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                  isLast
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25"
                }`}
              >
                {isLast ? "Start Over" : "Next"}
                {!isLast && (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            For educational purposes only. Consult your tax advisor for specific guidance.
          </p>
          <p className="text-xs text-slate-600">
            Built by PTN Accounting
          </p>
        </div>
      </footer>
    </div>
  );
}
