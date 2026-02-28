"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedCounterProps {
  value: number;
  label: string;
  colorClass?: string;
  flashOnZero?: boolean;
}

export default function AnimatedCounter({
  value,
  label,
  colorClass = "text-blue-400",
  flashOnZero = false,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    if (!counterRef.current) return;

    const tl = gsap.timeline();
    tl.to(objRef.current, {
      val: value,
      duration: 0.8,
      ease: "power2.out",
      snap: { val: 1 },
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `$${Math.round(objRef.current.val).toLocaleString()}`;
        }
      },
    });

    if (flashOnZero && value === 0) {
      tl.to(counterRef.current, {
        color: "#f87171",
        textShadow: "0 0 20px rgba(239,68,68,0.6)",
        duration: 0.3,
        yoyo: true,
        repeat: 3,
      });
    }

    return () => { tl.kill(); };
  }, [value, flashOnZero]);

  return (
    <div className="flex flex-col items-center mt-3">
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </span>
      <span
        ref={counterRef}
        className={`text-2xl font-bold tabular-nums ${colorClass}`}
      >
        ${value.toLocaleString()}
      </span>
    </div>
  );
}
