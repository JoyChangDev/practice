"use client";

import { useEffect } from "react";

export default function useWebVitalsHandler({ shouldListen = true, onFCP, onHydration } = {}) {
  useEffect(() => {
    if (!shouldListen) return;

    let observer;
    let hydrationFrame;

    const notifyHydration = () => {
      hydrationFrame = window.requestAnimationFrame(() => {
        onHydration?.();
      });
    };

    if (document.readyState === "complete") {
      notifyHydration();
    } else {
      window.addEventListener("load", notifyHydration, { once: true });
    }

    if (typeof PerformanceObserver !== "undefined") {
      observer = new PerformanceObserver((list) => {
        const hasFcp = list.getEntries().some((entry) => entry.name === "first-contentful-paint");

        if (hasFcp) {
          onFCP?.();
        }
      });

      observer.observe({ type: "paint", buffered: true });
    } else {
      onFCP?.();
    }

    return () => {
      window.removeEventListener("load", notifyHydration);
      window.cancelAnimationFrame(hydrationFrame);
      observer?.disconnect();
    };
  }, [shouldListen, onFCP, onHydration]);
}
