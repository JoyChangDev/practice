"use client";
import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LazySection({
  children,
  threshold = 0.4,
  triggerOnce = false,
}) {
  const directionRef = useRef("down");
  const lastScrollY = useRef(0);
  const [enterOffset, setEnterOffset] = useState(30);

  const handleInViewChange = useCallback((nextInView) => {
    if (nextInView) return;
    setEnterOffset(directionRef.current === "down" ? 30 : -30);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce,
    threshold,
    onChange: handleInViewChange,
  });

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
