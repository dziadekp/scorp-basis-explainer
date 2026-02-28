"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { StepConfig } from "./steps";

interface NarrationPanelProps {
  step: StepConfig;
  currentStep: number;
  totalSteps: number;
  animationKey: number;
}

export default function NarrationPanel({
  step,
  currentStep,
  totalSteps,
  animationKey,
}: NarrationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const narrationRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!panelRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Fade in the title
    const title = panelRef.current.querySelector(".step-title");
    if (title) {
      tl.fromTo(title, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 });
    }

    // Fade in subtitle
    const subtitle = panelRef.current.querySelector(".step-subtitle");
    if (subtitle) {
      tl.fromTo(subtitle, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 }, "-=0.2");
    }

    // Stagger narration paragraphs
    const narrationEls = panelRef.current.querySelectorAll(".narration-line");
    if (narrationEls.length > 0) {
      tl.fromTo(
        narrationEls,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 },
        "-=0.1"
      );
    }

    // Animate the IRC highlight
    const highlight = panelRef.current.querySelector(".irc-highlight");
    if (highlight) {
      tl.fromTo(
        highlight,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.1"
      );
    }

    return () => { tl.kill(); };
  }, [animationKey]);

  return (
    <div ref={panelRef} className="flex flex-col h-full">
      {/* Step counter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-8 bg-blue-500"
                  : i < currentStep
                  ? "w-4 bg-blue-400/40"
                  : "w-4 bg-slate-600"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 tabular-nums">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Title */}
      <h2 className="step-title text-2xl font-bold text-white mb-1">
        {step.title}
      </h2>
      <p className="step-subtitle text-sm font-medium text-blue-400 mb-6">
        {step.subtitle}
      </p>

      {/* Narration */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {step.narration.map((line, i) => (
          <p
            key={i}
            ref={(el) => { narrationRefs.current[i] = el; }}
            className="narration-line text-slate-300 text-sm leading-relaxed"
          >
            {line}
          </p>
        ))}
      </div>

      {/* IRC Reference */}
      {step.highlightRule && (
        <div className="irc-highlight mt-6 px-4 py-3 rounded-lg bg-slate-800/80 border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-blue-400 mt-0.5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-slate-400 leading-relaxed">
              {step.highlightRule}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
