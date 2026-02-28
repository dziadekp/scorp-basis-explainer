"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import type { BenjiPose } from "@/types";
import { POSE_MAP } from "@/types";

interface BenjiNarratorProps {
  pose: BenjiPose;
  displayedLines: string[];
  isComplete: boolean;
  onSkip: () => void;
  animationKey: number;
  isSpeaking: boolean;
}

export default function BenjiNarrator({
  pose,
  displayedLines,
  isComplete,
  onSkip,
  animationKey,
  isSpeaking,
}: BenjiNarratorProps) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Animate avatar entrance
  useEffect(() => {
    if (!avatarRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      avatarRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }
    );
    return () => { tl.kill(); };
  }, [animationKey]);

  // Animate bubble entrance
  useEffect(() => {
    if (!bubbleRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      bubbleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, delay: 0.2 }
    );
    return () => { tl.kill(); };
  }, [animationKey]);

  const poseSrc = POSE_MAP[pose];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar */}
      <div ref={avatarRef} className="relative">
        <div className={`w-28 h-28 rounded-full overflow-hidden bg-slate-800 border-2 ${isSpeaking ? "border-blue-400 shadow-lg shadow-blue-500/20" : "border-slate-700"} transition-all duration-300`}>
          <Image
            src={poseSrc}
            alt="Benji"
            width={112}
            height={112}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
        {isSpeaking && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>

      {/* Speech Bubble */}
      <div ref={bubbleRef} className="speech-bubble w-full" onClick={onSkip}>
        <div className="space-y-2 min-h-[80px]">
          {displayedLines.map((line, i) => (
            <p key={i} className="text-sm text-slate-200 leading-relaxed">
              {line}
              {i === displayedLines.length - 1 && !isComplete && (
                <span className="typewriter-cursor" />
              )}
            </p>
          ))}
          {displayedLines.length === 0 && (
            <p className="text-sm text-slate-200">
              <span className="typewriter-cursor" />
            </p>
          )}
        </div>

        {!isComplete && (
          <button
            onClick={onSkip}
            className="mt-2 text-[10px] text-slate-500 hover:text-slate-400 transition-colors"
          >
            Click to skip
          </button>
        )}
      </div>
    </div>
  );
}
