"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { StepConfig, BasisBlock } from "./steps";

const COLOR_MAP = {
  green: { bg: "bg-emerald-500", border: "border-emerald-400", glow: "block-glow-green", text: "text-emerald-100" },
  blue: { bg: "bg-blue-500", border: "border-blue-400", glow: "block-glow-blue", text: "text-blue-100" },
  red: { bg: "bg-red-500", border: "border-red-400", glow: "block-glow-red", text: "text-red-100" },
  amber: { bg: "bg-amber-500", border: "border-amber-400", glow: "block-glow-amber", text: "text-amber-100" },
  purple: { bg: "bg-purple-500", border: "border-purple-400", glow: "block-glow-purple", text: "text-purple-100" },
};

function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const prefix = amount < 0 ? "-" : "+";
  if (amount === 0) return "$0";
  return `${prefix}$${abs.toLocaleString()}`;
}

function computeStacks(step: StepConfig) {
  const stockBlocks: BasisBlock[] = [];
  const debtBlocks: BasisBlock[] = [];

  for (const block of step.blocks) {
    if (block.stack === "stock") {
      stockBlocks.push(block);
    } else {
      debtBlocks.push(block);
    }
  }

  let stockTotal = 0;
  for (const b of stockBlocks) stockTotal += b.amount;
  stockTotal = Math.max(0, stockTotal);

  let debtTotal = 0;
  for (const b of debtBlocks) debtTotal += b.amount;
  debtTotal = Math.max(0, debtTotal);

  return { stockBlocks, debtBlocks, stockTotal, debtTotal };
}

interface BasisBlocksProps {
  step: StepConfig;
  animationKey: number;
}

export default function BasisBlocks({ step, animationKey }: BasisBlocksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stockStackRef = useRef<HTMLDivElement>(null);
  const debtStackRef = useRef<HTMLDivElement>(null);
  const suspendedRef = useRef<HTMLDivElement>(null);
  const capitalGainRef = useRef<HTMLDivElement>(null);
  const stockTotalRef = useRef<HTMLDivElement>(null);
  const debtTotalRef = useRef<HTMLDivElement>(null);

  const { stockBlocks, debtBlocks, stockTotal, debtTotal } = computeStacks(step);

  const runAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Animate stock blocks in sequence
    const stockEls = stockStackRef.current?.querySelectorAll(".basis-block");
    if (stockEls) {
      stockEls.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          i * 0.2
        );
      });
    }

    // Animate debt blocks
    const debtEls = debtStackRef.current?.querySelectorAll(".basis-block");
    if (debtEls && debtEls.length > 0) {
      debtEls.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          (stockEls?.length || 0) * 0.2 + i * 0.2
        );
      });
    }

    // Animate totals
    if (stockTotalRef.current) {
      tl.fromTo(
        stockTotalRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.3"
      );
    }
    if (debtTotalRef.current) {
      tl.fromTo(
        debtTotalRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.3"
      );
    }

    // Flash zero effect
    if (step.flashZero && stockStackRef.current) {
      tl.to(stockStackRef.current, {
        boxShadow: "0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)",
        duration: 0.3,
        yoyo: true,
        repeat: 3,
      });
    }

    // Suspended loss badge
    if (suspendedRef.current) {
      tl.fromTo(
        suspendedRef.current,
        { opacity: 0, scale: 0.5, x: 20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.5 },
        "-=0.2"
      );
    }

    // Capital gain badge
    if (capitalGainRef.current) {
      tl.fromTo(
        capitalGainRef.current,
        { opacity: 0, scale: 0.5, x: 20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.5 },
        "-=0.2"
      );
    }

    return () => { tl.kill(); };
  }, [step.flashZero]);

  useEffect(() => {
    const cleanup = runAnimation();
    return () => { cleanup?.(); };
  }, [animationKey, runAnimation]);

  const renderBlock = (block: BasisBlock, index: number) => {
    const colors = COLOR_MAP[block.color];
    const isNegative = block.amount < 0;
    const height = Math.max(48, Math.min(80, Math.abs(block.amount) / 800 + 48));

    return (
      <div
        key={block.id}
        className={`basis-block relative flex items-center justify-between px-4 rounded-lg border-2 ${colors.bg} ${colors.border} ${colors.glow} opacity-0`}
        style={{ height: `${height}px`, minWidth: "240px" }}
      >
        <span className={`text-sm font-semibold ${colors.text} drop-shadow-sm`}>
          {block.label}
        </span>
        <span className={`text-sm font-bold ${colors.text} tabular-nums drop-shadow-sm`}>
          {formatCurrency(block.amount)}
        </span>
        {isNegative && (
          <div className="absolute -right-2 -top-2">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-red-300">
              <path d="M10 2l8 14H2l8-14z" transform="rotate(180 10 10)" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-end h-full min-h-[480px] relative">
      {/* Main visualization area */}
      <div className="flex items-end justify-center gap-12 mb-8 w-full">
        {/* Stock Basis Stack */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
            Stock Basis
          </div>
          <div
            ref={stockStackRef}
            className="flex flex-col-reverse gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 min-h-[120px] min-w-[280px]"
          >
            {stockBlocks.map((block, i) => renderBlock(block, i))}
          </div>
          <div
            ref={stockTotalRef}
            className="mt-3 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 opacity-0"
          >
            <span className="text-xs text-slate-400">Total: </span>
            <span className={`text-lg font-bold tabular-nums ${stockTotal === 0 ? "text-red-400" : "text-blue-400"}`}>
              ${stockTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Debt Basis Stack */}
        {step.showDebtStack && (
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
              Debt Basis
            </div>
            <div
              ref={debtStackRef}
              className="flex flex-col-reverse gap-2 p-3 rounded-xl bg-slate-800/50 border border-purple-900/50 min-h-[120px] min-w-[280px]"
            >
              {debtBlocks.map((block, i) => renderBlock(block, i))}
            </div>
            <div
              ref={debtTotalRef}
              className="mt-3 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 opacity-0"
            >
              <span className="text-xs text-slate-400">Total: </span>
              <span className="text-lg font-bold tabular-nums text-purple-400">
                ${debtTotal.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ground line */}
      <div className="ground-line w-full max-w-2xl" />

      {/* Badges */}
      <div className="flex gap-4 mt-6 min-h-[50px]">
        {step.suspendedLoss !== undefined && step.suspendedLoss > 0 && (
          <div
            ref={suspendedRef}
            className="pulse-red flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/40 border border-red-500/50 opacity-0"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-xs text-red-300 font-semibold">Suspended Loss</div>
              <div className="text-sm font-bold text-red-400 tabular-nums">
                ${step.suspendedLoss.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {step.capitalGain !== undefined && step.capitalGain > 0 && (
          <div
            ref={capitalGainRef}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900/40 border border-amber-500/50 opacity-0"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-xs text-amber-300 font-semibold">Capital Gain Triggered</div>
              <div className="text-sm font-bold text-amber-400 tabular-nums">
                ${step.capitalGain.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
