"use client";
import { Box } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";

const DEFAULT_OFFSET = 30;

export default function ScrollReveal({
  children,
  offset = DEFAULT_OFFSET,
  threshold = 0.4,
  triggerOnce = false,
}) {
  const safeOffset = Number.isFinite(offset)
    ? Math.abs(offset)
    : DEFAULT_OFFSET;
  const [enterOffset, setEnterOffset] = useState(safeOffset);

  const handleInViewChange = useCallback(
    (nextInView, entry) => {
      if (nextInView) return;

      const elementCenter =
        entry.boundingClientRect.top + entry.boundingClientRect.height / 2;
      const viewportCenter = window.innerHeight / 2;

      setEnterOffset(elementCenter < viewportCenter ? -safeOffset : safeOffset);
    },
    [safeOffset],
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
