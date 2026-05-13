"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PROGRESS_CONFIG = {
  interval: 100,
  defaultIncrement: 0.0875,
  phases: {
    FAST_START: { target: 0.3, increment: 0.0875 },
    FAST_CONTINUE: { target: 0.55, increment: 0.0875 },
    SLOW_MOVE: { target: 0.65, increment: 0.001 },
    SLOW_FINISH: { target: 0.85, increment: 0.01 },
    VERY_SLOW_FINISH: { target: 0.95, increment: 0.003 },
  },
};

const getPhaseConfig = (progress) => {
  switch (true) {
    case progress < PROGRESS_CONFIG.phases.FAST_START.target:
      return PROGRESS_CONFIG.phases.FAST_START;
    case progress < PROGRESS_CONFIG.phases.FAST_CONTINUE.target:
      return PROGRESS_CONFIG.phases.FAST_CONTINUE;
    case progress < PROGRESS_CONFIG.phases.SLOW_MOVE.target:
      return PROGRESS_CONFIG.phases.SLOW_MOVE;
    case progress < PROGRESS_CONFIG.phases.SLOW_FINISH.target:
      return PROGRESS_CONFIG.phases.SLOW_FINISH;
    default:
      return PROGRESS_CONFIG.phases.VERY_SLOW_FINISH;
  }
};

/**
 * Progress animation hook - simple and focused
 * Extracts animation logic from ProgressModal component
 *
 * @returns {Object} { progress, isAnimating, handleStart, handleStop, handleReset, handleComplete }
 */
export default function useProgressAnimation() {
  const [progress, setProgress] = useState(0.05);
  const [isAnimating, setIsAnimating] = useState(false);

  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setProgress((prevProgress) => {
      if (prevProgress >= 1) return prevProgress;

      const { increment, target } = getPhaseConfig(prevProgress);

      return Math.min(prevProgress + increment, target);
    });
  }, []);

  const handleStart = useCallback(
    (progress) => {
      if (intervalRef.current) return; // Already running
      setProgress(progress);
      setIsAnimating(true);
      intervalRef.current = setInterval(tick, PROGRESS_CONFIG.interval);
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
