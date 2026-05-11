"use client";

import { useCallback, useEffect, useRef } from "react";

export default function useTimeout() {
  const timersRef = useRef(new Set());

  const clearTimeoutSafe = useCallback(() => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });
    timersRef.current.clear();
  }, []);

  const setTimeoutSafe = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);

    timersRef.current.add(timer);
    return timer;
  }, []);

  useEffect(() => clearTimeoutSafe, [clearTimeoutSafe]);

  return {
    setTimeoutSafe,
    clearTimeoutSafe,
  };
}
