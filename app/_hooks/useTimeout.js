"use client";

import { useCallback, useEffect, useRef } from "react";

export default function useTimeout() {
  const timersRef = useRef(new Set());

  const setSafeTimeout = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);

    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearSafeTimeout = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  useEffect(() => clearSafeTimeout, [clearSafeTimeout]);

  return {
    setSafeTimeout,
    clearSafeTimeout,
  };
}
