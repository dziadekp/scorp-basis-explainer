"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { StepConfig } from "@/types";
import { computeSectionHeight, filterSections, formatDollars } from "@/lib/tower-math";
import AnimatedCounter from "./AnimatedCounter";

const SECTION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-500/90", border: "border-blue-400/60", text: "text-blue-100" },
  green: { bg: "bg-emerald-500/90", border: "border-emerald-400/60", text: "text-emerald-100" },
  red: { bg: "bg-red-500/90", border: "border-red-400/60", text: "text-red-100" },
  amber: { bg: "bg-amber-500/90", border: "border-amber-400/60", text: "text-amber-100" },
  purple: { bg: "bg-purple-500/90", border: "border-purple-400/60", text: "text-purple-100" },
};

interface ProportionalTowerProps {
  step: StepConfig;
  animationKey: number;
  interactiveExtra: { stockDelta: number; debtDelta: number };
}

export default function ProportionalTower({
  step,
  animationKey,
  interactiveExtra,
}: ProportionalTowerProps) {
  const stockRef = useRef<HTMLDivElement>(null);
  const debtRef = useRef<HTMLDivElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);
  const suspendedRef = useRef<HTMLDivElement>(null);
  const capitalGainRef = useRef<HTMLDivElement>(null);

  const stockSections = filterSections(step.sections, "stock");
  const debtSections = filterSections(step.sections, "debt");

  const effectiveStockTotal = Math.max(0, step.stockTotal + interactiveExtra.stockDelta);
  const effectiveDebtTotal = Math.max(0, step.debtTotal + interactiveExtra.debtDelta);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Animate stock sections
    const stockEls = stockRef.current?.querySelectorAll(".tower-section");
    if (stockEls) {
      stockEls.forEach((el, i) => {
        tl.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5 },
          i * 0.15
        );
      });
    }

    // Animate debt stack entrance
    if (step.showDebtStack && debtRef.current) {
      const debtEls = debtRef.current.querySelectorAll(".tower-section");
      tl.fromTo(
        debtRef.current,
        { x: 80, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
        0.3
      );
      debtEls.forEach((el, i) => {
        tl.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4 },
          0.5 + i * 0.15
        );
      });
    }

    // Flash zero
    if (step.flashZero && stockRef.current) {
      const zeroLabel = stockRef.current.querySelector(".zero-label");
      if (zeroLabel) {
        tl.fromTo(
          zeroLabel,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4 }
        );
        tl.to(zeroLabel, {
          textShadow: "0 0 20px rgba(239,68,68,0.8)",
          duration: 0.3,
          yoyo: true,
          repeat: 3,
        });
      }
    }

    // Below-ground block (excess distribution)
    if (belowRef.current) {
      tl.fromTo(
        belowRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5 },
        "-=0.2"
      );
    }

    // Suspended loss badge
    if (suspendedRef.current) {
      tl.fromTo(
        suspendedRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.1"
      );
    }

    // Capital gain badge
    if (capitalGainRef.current) {
      tl.fromTo(
        capitalGainRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.1"
      );
    }

    return () => { tl.kill(); };
  }, [animationKey, step.flashZero, step.showDebtStack]);

  const renderSection = (section: typeof stockSections[0]) => {
    const height = computeSectionHeight(section.amount);
    const colors = SECTION_COLORS[section.color] || SECTION_COLORS.blue;

    return (
      <div
        key={section.id}
        className={`tower-section ${colors.bg} ${colors.border} border-2 rounded-md flex items-center justify-between px-3 overflow-hidden`}
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        <span className={`text-xs font-semibold ${colors.text} truncate`}>
          {section.label}
        </span>
        <span className={`text-xs font-bold ${colors.text} tabular-nums ml-2 shrink-0`}>
          {formatDollars(section.amount)}
        </span>
      </div>
    );
  };

  const showStock = effectiveStockTotal > 0 || step.flashZero;
  const showDebt = step.showDebtStack;

  return (
    <div className="flex flex-col items-center justify-end h-full">
      {/* Towers */}
      <div className="flex items-end justify-center gap-10 mb-0 w-full">
        {/* Stock Basis Tower */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            Stock Basis
          </div>
          <div
            ref={stockRef}
            className="flex flex-col-reverse gap-1 min-w-[220px] relative"
          >
            {showStock && stockSections.length > 0 ? (
              stockSections.map(renderSection)
            ) : (
              <div className="zero-label flex items-center justify-center h-16 rounded-md border-2 border-dashed border-red-500/50 bg-red-950/30 min-w-[220px]">
                <span className="text-red-400 font-bold text-sm">ZERO BASIS</span>
              </div>
            )}
          </div>

          {/* Ground line under stock */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-slate-500 to-transparent mt-1" />

          {/* Below-ground block for excess distributions */}
          {step.belowGroundBlock && (
            <div
              ref={belowRef}
              className="mt-2 flex items-center justify-between px-3 py-2 rounded-md border-2 border-dashed border-red-500/60 bg-red-950/40 min-w-[220px]"
            >
              <span className="text-xs font-semibold text-red-300">
                {step.belowGroundBlock.label}
              </span>
              <span className="text-xs font-bold text-red-400 tabular-nums">
                {formatDollars(step.belowGroundBlock.amount)}
              </span>
            </div>
          )}

          <AnimatedCounter
            value={effectiveStockTotal}
            label="Stock Basis"
            colorClass={effectiveStockTotal === 0 ? "text-red-400" : "text-blue-400"}
            flashOnZero={step.flashZero}
          />
        </div>

        {/* Debt Basis Tower */}
        {showDebt && (
          <div ref={debtRef} className="flex flex-col items-center">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
              Debt Basis
            </div>
            <div className="flex flex-col-reverse gap-1 min-w-[220px]">
              {debtSections.length > 0 ? (
                debtSections.map(renderSection)
              ) : (
                <div className="flex items-center justify-center h-16 rounded-md border-2 border-dashed border-purple-500/30 bg-purple-950/20 min-w-[220px]">
                  <span className="text-purple-500/50 font-medium text-xs">No debt basis</span>
                </div>
              )}
            </div>

            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-slate-500 to-transparent mt-1" />

            <AnimatedCounter
              value={effectiveDebtTotal}
              label="Debt Basis"
              colorClass="text-purple-400"
            />
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex gap-4 mt-5 min-h-[44px]">
        {step.suspendedLoss !== undefined && step.suspendedLoss > 0 && (
          <div
            ref={suspendedRef}
            className="pulse-red flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/30 border border-red-500/40"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-[10px] text-red-300 font-semibold uppercase">Suspended Loss</div>
              <div className="text-sm font-bold text-red-400 tabular-nums">
                {formatDollars(step.suspendedLoss)}
              </div>
            </div>
          </div>
        )}

        {step.capitalGain !== undefined && step.capitalGain > 0 && (
          <div
            ref={capitalGainRef}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900/30 border border-amber-500/40"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-amber-400 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-[10px] text-amber-300 font-semibold uppercase">Capital Gain</div>
              <div className="text-sm font-bold text-amber-400 tabular-nums">
                {formatDollars(step.capitalGain)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
