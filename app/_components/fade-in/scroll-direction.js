"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const ScrollDirectionContext = createContext(null);

const useScrollDirectionTracker = (initialDirection = "down") => {
  const directionRef = useRef(initialDirection);
  const prevScrollYRef = useRef(0);
  const frameIdRef = useRef(0);
  const queuedScrollYRef = useRef(0);

  const updateScroll = useCallback(() => {
    const current = queuedScrollYRef.current;
    directionRef.current = current >= prevScrollYRef.current ? "down" : "up";
    prevScrollYRef.current = current;
    frameIdRef.current = 0;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      queuedScrollYRef.current = window.scrollY;
      if (frameIdRef.current) return;
      frameIdRef.current = window.requestAnimationFrame(updateScroll);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameIdRef.current) {
        window.cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }
    };
  }, [updateScroll]);

  // Call isDown() only when needed to read the latest direction
  // without triggering frequent re-renders on scroll.
  return useCallback(() => directionRef.current === "down", []);
};

export function ScrollDirectionProvider({ children }) {
  const isDown = useScrollDirectionTracker();

  return (
    <ScrollDirectionContext.Provider value={isDown}>
      {children}
    </ScrollDirectionContext.Provider>
  );
}

export function useScrollDirection() {
  const isDown = useContext(ScrollDirectionContext);

  if (!isDown) {
    throw new Error(
      "useScrollDirection must be used within ScrollDirectionProvider.",
    );
  }
  return isDown;
}
