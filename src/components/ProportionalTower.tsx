"use client";

import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import type { TowerPhase, DepartingBlock } from "@/types";
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
  phase: TowerPhase;
  phaseIndex: number;
  animationKey: number;
}

export default function ProportionalTower({
  phase,
  phaseIndex,
  animationKey,
}: ProportionalTowerProps) {
  const stockRef = useRef<HTMLDivElement>(null);
  const debtRef = useRef<HTMLDivElement>(null);
  const debtContainerRef = useRef<HTMLDivElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);
  const suspendedRef = useRef<HTMLDivElement>(null);
  const capitalGainRef = useRef<HTMLDivElement>(null);
  const departingRef = useRef<HTMLDivElement>(null);

  const prevAnimKeyRef = useRef(-1);
  const prevPhaseRef = useRef(-1);
  // displayedPhase controls what's rendered in the tower.
  // During departing animations, it stays at the OLD phase so old sections remain visible.
  // After departure completes, it updates to the new phase.
  const [displayedPhase, setDisplayedPhase] = useState<TowerPhase>(phase);
  const [activeDeparting, setActiveDeparting] = useState<DepartingBlock[]>([]);

  // ── Phase queue: prevents race conditions when departing overlaps ──
  // If a new phase arrives while departing is active, we queue it and
  // process after the current departing finishes.
  const departingActiveRef = useRef(false);
  const phaseQueueRef = useRef<{ phase: TowerPhase; index: number } | null>(null);
  // Stores the target phase for the CURRENT departing animation.
  // Without this, the phase prop could advance to a FUTURE phase while
  // the current departing is still playing, causing skipped intermediate states.
  const departingTargetRef = useRef<TowerPhase | null>(null);

  const stockSections = filterSections(displayedPhase.sections, "stock");
  const debtSections = filterSections(displayedPhase.sections, "debt");

  const showStock = displayedPhase.stockTotal > 0 || displayedPhase.flashZero;
  const showDebt = displayedPhase.showDebtStack;

  // ── Process a phase transition (called directly or from queue) ──
  const processPhaseTransition = useCallback((targetPhase: TowerPhase, targetIndex: number) => {
    prevPhaseRef.current = targetIndex;
    const departing = targetPhase.departing || [];

    if (departing.length > 0) {
      departingActiveRef.current = true;
      departingTargetRef.current = targetPhase; // Store THIS departing's target
      setActiveDeparting(departing);
      // displayedPhase stays at old value — old sections remain visible
    } else {
      // No departing blocks — update sections directly
      setDisplayedPhase(targetPhase);
    }
  }, []);

  // ─── Step entrance animation (new step) ───
  useEffect(() => {
    if (animationKey === prevAnimKeyRef.current) return;
    prevAnimKeyRef.current = animationKey;
    prevPhaseRef.current = 0;
    departingActiveRef.current = false;
    phaseQueueRef.current = null;
    departingTargetRef.current = null;
    setActiveDeparting([]);
    setDisplayedPhase(phase);
  }, [animationKey, phase]);

  // Animate sections on step entrance (runs after displayedPhase updates from step change)
  useEffect(() => {
    // Only run full entrance on step change
    if (prevAnimKeyRef.current !== animationKey) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Stock sections entrance
    const stockEls = stockRef.current?.querySelectorAll(".tower-section");
    if (stockEls?.length) {
      tl.fromTo(
        stockEls,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.6, stagger: 0.2 },
        0
      );
    }

    // Zero basis flash
    if (displayedPhase.flashZero && displayedPhase.stockTotal === 0) {
      const zeroLabel = stockRef.current?.querySelector(".zero-label");
      if (zeroLabel) {
        tl.fromTo(
          zeroLabel,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5 }
        );
        tl.to(zeroLabel, {
          textShadow: "0 0 20px rgba(239,68,68,0.8)",
          duration: 0.3,
          yoyo: true,
          repeat: 3,
        });
      }
    }

    // Debt stack entrance
    if (displayedPhase.showDebtStack && debtContainerRef.current) {
      const debtEls = debtContainerRef.current.querySelectorAll(".tower-section");
      if (debtEls?.length) {
        tl.fromTo(
          debtContainerRef.current,
          { x: 80, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" },
          0.3
        );
        debtEls.forEach((el, i) => {
          tl.fromTo(
            el,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.5 },
            0.5 + i * 0.2
          );
        });
      }
    }

    // Suspended loss badge
    if (suspendedRef.current && displayedPhase.suspendedLoss) {
      tl.fromTo(
        suspendedRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.1"
      );
    }

    // Below ground block
    if (belowRef.current && displayedPhase.belowGroundBlock) {
      tl.fromTo(
        belowRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
        "-=0.2"
      );
    }

    // Capital gain badge
    if (capitalGainRef.current && displayedPhase.capitalGain) {
      tl.fromTo(
        capitalGainRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.1"
      );
    }

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey, displayedPhase]);

  // ─── Phase transition animation (within same step) ───
  useEffect(() => {
    // Skip if this is a step entrance (handled above)
    if (animationKey !== prevAnimKeyRef.current) return;
    // Skip if same phase
    if (phaseIndex === prevPhaseRef.current) return;

    // If departing is currently active, QUEUE this phase — don't interrupt
    if (departingActiveRef.current) {
      phaseQueueRef.current = { phase, index: phaseIndex };
      return;
    }

    // No active departing — process immediately
    processPhaseTransition(phase, phaseIndex);
  }, [phaseIndex, phase, animationKey, processPhaseTransition]);

  // ─── Departing blocks animation ───
  useEffect(() => {
    if (activeDeparting.length === 0 || !departingRef.current) return;

    const blocks = departingRef.current.querySelectorAll(".departing-item");
    if (!blocks.length) return;

    // Capture the target for THIS departing animation at creation time
    const myTarget = departingTargetRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        departingActiveRef.current = false;
        departingTargetRef.current = null;
        setActiveDeparting([]);

        // Update to THIS departing's target (not the latest prop, which may be a future phase)
        if (myTarget) {
          setDisplayedPhase(myTarget);
        }

        // Check if there's a queued phase waiting
        const queued = phaseQueueRef.current;
        if (queued) {
          phaseQueueRef.current = null;
          // Delay so the intermediate sections render before next departing starts
          setTimeout(() => {
            processPhaseTransition(queued.phase, queued.index);
          }, 800);
        }
      },
    });

    // 1. Appear — slide in from left
    tl.fromTo(
      blocks,
      { opacity: 0, x: -30, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(1.2)" }
    );

    // 2. Pause so user can read the departing label
    tl.to({}, { duration: 1.5 });

    // 3. Slide away to the right
    tl.to(blocks, {
      x: 120,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      stagger: 0.08,
    });

    return () => { tl.kill(); };
  }, [activeDeparting, processPhaseTransition]);

  // ─── Animate new sections after displayedPhase updates (phase transition) ───
  // We use a ref to track if this is a phase transition vs step entrance
  const isPhaseTransitionRef = useRef(false);

  // Detect phase transitions
  useLayoutEffect(() => {
    // After a departing animation completes and displayedPhase updates,
    // or after a non-departing phase transition, animate the new sections
    if (prevAnimKeyRef.current === animationKey && activeDeparting.length === 0) {
      isPhaseTransitionRef.current = true;
    }
  }, [displayedPhase, animationKey, activeDeparting.length]);

  useEffect(() => {
    if (!isPhaseTransitionRef.current) return;
    isPhaseTransitionRef.current = false;

    // Don't animate on initial mount
    if (prevPhaseRef.current <= 0 && animationKey === prevAnimKeyRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Animate stock sections
    const stockEls = stockRef.current?.querySelectorAll(".tower-section");
    if (stockEls?.length) {
      tl.fromTo(
        stockEls,
        { scaleY: 0, opacity: 0, transformOrigin: "bottom" },
        { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.12 },
        0
      );
    }

    // Zero basis flash
    if (displayedPhase.flashZero && displayedPhase.stockTotal === 0) {
      const zeroLabel = stockRef.current?.querySelector(".zero-label");
      if (zeroLabel) {
        tl.fromTo(
          zeroLabel,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5 }
        );
        tl.to(zeroLabel, {
          textShadow: "0 0 20px rgba(239,68,68,0.8)",
          duration: 0.3,
          yoyo: true,
          repeat: 2,
        });
      }
    }

    // Debt sections
    if (displayedPhase.showDebtStack) {
      const debtEls = debtContainerRef.current?.querySelectorAll(".tower-section");

      // If debt stack is newly appearing (wasn't in previous rendered state)
      if (debtContainerRef.current) {
        tl.fromTo(
          debtContainerRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.5 },
          0
        );
      }

      if (debtEls?.length) {
        tl.fromTo(
          debtEls,
          { scaleY: 0, opacity: 0, transformOrigin: "bottom" },
          { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.12 },
          0.1
        );
      }
    }

    // Suspended loss badge
    if (suspendedRef.current && displayedPhase.suspendedLoss) {
      tl.fromTo(
        suspendedRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.1"
      );
    }

    // Below ground block
    if (belowRef.current && displayedPhase.belowGroundBlock) {
      tl.fromTo(
        belowRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
        "-=0.2"
      );
    }

    // Capital gain badge
    if (capitalGainRef.current && displayedPhase.capitalGain) {
      tl.fromTo(
        capitalGainRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.1"
      );
    }

    return () => { tl.kill(); };
  }, [displayedPhase, animationKey]);

  // ─── Render helpers ───

  const renderSection = (section: (typeof stockSections)[0]) => {
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

  return (
    <div className="flex flex-col items-center justify-end h-full w-full">
      {/* Departing blocks overlay */}
      {activeDeparting.length > 0 && (
        <div
          ref={departingRef}
          className="flex flex-col gap-2 mb-4 w-full max-w-[460px]"
        >
          {activeDeparting.map((d, i) => (
            <div
              key={i}
              className="departing-item flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-950/60 border border-red-500/50 shadow-lg shadow-red-900/20"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-red-400 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 12H5m7-7l-7 7 7 7"
                />
              </svg>
              <span className="text-sm font-semibold text-red-300 flex-1">
                {d.label}
              </span>
              <span className="text-sm font-bold text-red-400 tabular-nums">
                &minus;{formatDollars(d.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

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
          {displayedPhase.belowGroundBlock && (
            <div
              ref={belowRef}
              className="mt-2 flex items-center justify-between px-3 py-2 rounded-md border-2 border-dashed border-red-500/60 bg-red-950/40 min-w-[220px]"
            >
              <span className="text-xs font-semibold text-red-300">
                {displayedPhase.belowGroundBlock.label}
              </span>
              <span className="text-xs font-bold text-red-400 tabular-nums">
                {formatDollars(displayedPhase.belowGroundBlock.amount)}
              </span>
            </div>
          )}

          <AnimatedCounter
            value={displayedPhase.stockTotal}
            label="Stock Basis"
            colorClass={displayedPhase.stockTotal === 0 ? "text-red-400" : "text-blue-400"}
            flashOnZero={displayedPhase.flashZero}
          />
        </div>

        {/* Debt Basis Tower */}
        {showDebt && (
          <div ref={debtContainerRef} className="flex flex-col items-center">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
              Debt Basis
            </div>
            <div
              ref={debtRef}
              className="flex flex-col-reverse gap-1 min-w-[220px]"
            >
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
              value={displayedPhase.debtTotal}
              label="Debt Basis"
              colorClass="text-purple-400"
            />
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex gap-4 mt-5 min-h-[44px]">
        {displayedPhase.suspendedLoss !== undefined && displayedPhase.suspendedLoss > 0 && (
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
                {formatDollars(displayedPhase.suspendedLoss)}
              </div>
            </div>
          </div>
        )}

        {displayedPhase.capitalGain !== undefined && displayedPhase.capitalGain > 0 && (
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
                {formatDollars(displayedPhase.capitalGain)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
