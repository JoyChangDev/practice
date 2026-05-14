"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL = 100;
const PHASE = [
  { target: 0.3, increment: 0.0875 }, // fast start
  { target: 0.55, increment: 0.0875 }, // fast continue
  { target: 0.65, increment: 0.0025 }, // slow continue
  { target: 0.85, increment: 0.01 }, // slow finish
  { target: 0.95, increment: 0.003 }, // very slow finish
];
const getPhase = (progress) => PHASE.find(({ target }) => progress < target);

/**
 * Progress animation hook - simple and focused
 * Extracts animation logic from ProgressModal component
 *
 * @returns {Object} { progress, isAnimating, handleStart, handleStop, handleReset, handleComplete }
 */
export default function useProgressAnimation(initialProgress) {
  const [progress, setProgress] = useState(initialProgress);
  const [isAnimating, setIsAnimating] = useState(false);

  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setProgress((prev) => {
      if (prev >= 1) return prev;

      const { increment, target } = getPhase(prev) ?? PHASE[PHASE.length - 1];

      return Math.min(prev + increment, target);
    });
  }, []);

  const handleStart = useCallback(
    (progress) => {
      if (intervalRef.current) return; // Already running
      setProgress(progress);
      setIsAnimating(true);
      intervalRef.current = setInterval(tick, INTERVAL);
    },
    [tick],
  );

  const handleStop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const handleReset = useCallback(
    (progress) => {
      handleStop();
      setProgress(progress);
    },
    [handleStop],
  );

  const handleComplete = useCallback(() => {
    handleStop();
    setProgress(1);
  }, [handleStop]);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [],
  );

  return {
    progress,
    isAnimating,
    handleStart,
    handleStop,
    handleReset,
    handleComplete,
  };
}
