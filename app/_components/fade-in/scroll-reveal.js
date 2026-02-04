"use client";
import { Box } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useScrollDirection } from "./scroll-direction";

const DEFAULT_OFFSET = 30;

export default function ScrollReveal({
  children,
  offset = DEFAULT_OFFSET,
  threshold = 0.4,
  triggerOnce = false,
}) {
  const isDown = useScrollDirection();
  const safeOffset = Number.isFinite(offset)
    ? Math.abs(offset)
    : DEFAULT_OFFSET;
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
