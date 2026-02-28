"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number;
  lineDelay?: number;
}

export function useTypewriter(
  lines: string[],
  trigger: number,
  options: UseTypewriterOptions = {}
) {
  const { speed = 25, lineDelay = 400 } = options;
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the previous trigger to detect changes DURING render
  // (React's official pattern for "adjusting state based on props")
  const [prevTrigger, setPrevTrigger] = useState(trigger);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── SYNCHRONOUS RESET during render ──
  // When trigger changes, we must reset currentLineIdx to 0 BEFORE
  // the parent's useMemo computes activePhaseIdx. Using useEffect
  // would be too late (it runs after render).
  if (trigger !== prevTrigger) {
    clearTimer();
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
    setIsComplete(false);
    setPrevTrigger(trigger);
  }

  // Typewriter effect
  useEffect(() => {
    if (isComplete || !lines.length) return;

    const line = lines[currentLineIdx];
    if (!line) {
      setIsComplete(true);
      return;
    }

    if (currentCharIdx < line.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIdx] = line.slice(0, currentCharIdx + 1);
          return updated;
        });
        setCurrentCharIdx((c) => c + 1);
      }, speed);
    } else if (currentLineIdx < lines.length - 1) {
      // Move to next line after delay
      timerRef.current = setTimeout(() => {
        setCurrentLineIdx((l) => l + 1);
        setCurrentCharIdx(0);
      }, lineDelay);
    } else {
      setIsComplete(true);
    }

    return clearTimer;
  }, [lines, currentLineIdx, currentCharIdx, isComplete, speed, lineDelay, clearTimer]);

  const skip = useCallback(() => {
    clearTimer();
    setDisplayedLines([...lines]);
    setCurrentLineIdx(lines.length - 1);
    setCurrentCharIdx(lines[lines.length - 1]?.length ?? 0);
    setIsComplete(true);
  }, [lines, clearTimer]);

  return {
    displayedLines,
    isComplete,
    skip,
    currentLineIdx,
  };
}
