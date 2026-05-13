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
 * @param {Object} options - Configuration options
 * @param {boolean} options.isComplete - External completion signal
 * @param {Object} options.config - Animation configuration (optional)
 * @param {Function} options.onComplete - Completion callback
 * @param {boolean} options.autoStart - Whether to start animation immediately
 * @param {number} options.initialProgress - Starting progress value
 * @returns {Object} { progress, isAnimating, handleStart, handleStop, handleReset, handleComplete }
 * @returns {number} progress - Current progress value (0-1)
 * @returns {boolean} isAnimating - Whether animation is currently running
 * @returns {Function} handleStart - Start the animation
 * @returns {Function} handleStop - Stop the animation
 * @returns {Function} handleReset - Reset progress (optionally to specific value)
 * @returns {Function} handleComplete - Complete animation immediately
 */
export default function useProgressAnimation({
  isComplete = false,
  config = PROGRESS_CONFIG,
  onComplete = null,
  autoStart,
  initialProgress = 0.05,
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [isAnimating, setIsAnimating] = useState(false);

  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Update callback ref when prop changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const tick = useCallback(() => {
    setProgress((prevProgress) => {
      if (prevProgress >= 1) return prevProgress;

      const { increment, target } = getPhaseConfig(prevProgress);

      const newProgress = Math.min(prevProgress + increment, target);

      if (newProgress >= 1) {
        requestAnimationFrame(() => {
          setIsAnimating(false);
          onCompleteRef.current?.();
        });
      }

      return newProgress;
    });
  }, []);

  const handleStart = useCallback(
    (progress) => {
      if (intervalRef.current) return; // Already running
      setProgress(progress);
      setIsAnimating(true);
      intervalRef.current = setInterval(tick, config.interval);
    },
    [tick, config.interval],
  );

  const handleStop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const handleReset = useCallback(
    (resetValue = initialProgress) => {
      handleStop();
      setProgress(resetValue);
    },
    [handleStop, initialProgress],
  );

  const handleComplete = useCallback(() => {
    handleStop();
    setProgress(1);
    requestAnimationFrame(() => onCompleteRef.current?.());
  }, [handleStop]);

  // Handle external completion
  useEffect(() => {
    if (isComplete && isAnimating) {
      const animationFrame = requestAnimationFrame(() => handleComplete());
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isComplete, isAnimating, handleComplete]);

  // Auto-start
  useEffect(() => {
    if (autoStart && progress < 1 && !isAnimating && !isComplete) {
      const animationFrame = requestAnimationFrame(() => handleStart());
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [autoStart, progress, isAnimating, isComplete, handleStart]);

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
