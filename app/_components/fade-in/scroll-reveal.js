"use client";
import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const useScrollDirection = (initialDirection = "down") => {
  const directionRef = useRef(initialDirection);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      directionRef.current = current >= lastScrollY.current ? "down" : "up";
      lastScrollY.current = current;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDown = useCallback(() => directionRef.current === "down", []);

  // Call isDown() only when needed to read the latest direction
  // without triggering frequent re-renders on scroll.
  return isDown;
};

export default function ScrollReveal({
  children,
  initialDirection = "down",
  offset = 30,
  threshold = 0.4,
  triggerOnce = false,
}) {
  const isDown = useScrollDirection(initialDirection);
  const safeOffset = Number.isFinite(offset) ? Math.abs(offset) : 30;
  const [enterOffset, setEnterOffset] = useState(safeOffset);

  const handleInViewChange = useCallback(
    (nextInView) => {
      if (nextInView) return;
      setEnterOffset(isDown() ? safeOffset : -safeOffset);
    },
    [isDown, safeOffset],
  );

  const { ref, inView } = useInView({
    triggerOnce,
    threshold,
    onChange: handleInViewChange,
  });

  return (
    <Box
      ref={ref}
      opacity={inView ? 1 : 0}
      transform={inView ? "translateY(0px)" : `translateY(${enterOffset}px)`}
      transition="opacity 0.6s ease, transform 0.6s ease"
    >
      {children}
    </Box>
  );
}
