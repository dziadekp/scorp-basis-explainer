"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseVoiceOptions {
  isMuted: boolean;
}

export function useVoice({ isMuted }: UseVoiceOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speakStep = useCallback(
    async (stepId: number) => {
      stop();
      if (isMuted) return;

      const src = `/audio/step-${stepId}.mp3`;
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = src;
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => setIsSpeaking(false);
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        // Fallback: no audio file available, just skip
      };

      try {
        await audioRef.current.play();
      } catch {
        setIsSpeaking(false);
      }
    },
    [isMuted, stop]
  );

  const speakDynamic = useCallback(
    async (text: string) => {
      stop();
      if (isMuted) return;

      // Try the TTS API proxy first
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          if (!audioRef.current) audioRef.current = new Audio();
          audioRef.current.src = url;
          audioRef.current.onplay = () => setIsSpeaking(true);
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(url);
          };
          await audioRef.current.play();
          return;
        }
      } catch {
        // Fallback to browser TTS
      }

      // Browser SpeechSynthesis fallback
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isMuted, stop]
  );

  return { speakStep, speakDynamic, stop, isSpeaking };
}
