"use client";

import { useCallback, useEffect, useState } from "react";

const FCP_FALLBACK_TIMEOUT = 700; // 200ms after CSS animation (500ms)

export default function useFcpDetection() {
  const [fcpReceived, setFcpReceived] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const shouldListen = !(fcpReceived && isHydrated);

  const handleFCP = useCallback(() => setFcpReceived(true), []);

  const handleHydration = useCallback(() => setIsHydrated(true), []);

  useEffect(() => {
    if (!shouldListen) return;

    let observer;
    let hydrationFrame;
    let fcpFrame;

    const notifyHydration = () => {
      hydrationFrame = window.requestAnimationFrame(() => handleHydration());
    };

    if (document.readyState === "complete") {
      notifyHydration();
    } else {
      window.addEventListener("load", notifyHydration, { once: true });
    }

    if (typeof PerformanceObserver !== "undefined") {
      observer = new PerformanceObserver((list) => {
        const hasFcp = list
          .getEntries()
          .some((entry) => entry.name === "first-contentful-paint");
        if (hasFcp) handleFCP();
      });
      observer.observe({ type: "paint", buffered: true });
    } else {
      fcpFrame = window.requestAnimationFrame(() => handleFCP());
    }

    return () => {
      window.removeEventListener("load", notifyHydration);
      window.cancelAnimationFrame(hydrationFrame);
      window.cancelAnimationFrame(fcpFrame);
      observer?.disconnect();
    };
  }, [shouldListen, handleFCP, handleHydration]);

  useEffect(() => {
    const fallbackTimer = setTimeout(
      () => setFcpReceived(true),
      FCP_FALLBACK_TIMEOUT,
    );

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  return { fcpReceived, isHydrated };
}
