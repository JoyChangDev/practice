"use client";

import { Center, Image } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import useTimeout from "@/hooks/useTimeout";
import CustomModal from "./custom-modal";

import useProgressAnimation from "./_hooks/useProgressAnimation";
import useFcpDetection from "./_hooks/useFcpDetection";
import logoLoadingGif from "./assets/cola-logo-loading.gif";

import {
  Status,
  Details,
  Disclaimer,
  LongLoading,
  ProgressBar,
} from "./component";

// Progress Configuration
const INITIAL_PROGRESS = 0.3;
const RESET_PROGRESS = 0.05;
// Animation Timing (in milliseconds)
const PROGRESS_TRANSITION = 300;
const MODAL_CLOSE = PROGRESS_TRANSITION + 100; // Must be longer than progress transition
const SHOW_LONG_LOADING_MESSAGE_TIMEOUT = 15000; // 15 seconds

const ICON_SIZES = { base: "30px", md: "40px" };

// Calculate progress bar and icon positioning
const calculateProgressPosition = (fcpReceived, progress) => {
  if (!fcpReceived) {
    return { progressIconLeft: "0%", progressBarWidth: "90%" };
  }

  const { base: baseIconSize, md: xlIconSize } = ICON_SIZES;

  const minPosition =
    (progress < INITIAL_PROGRESS ? RESET_PROGRESS : INITIAL_PROGRESS) * 100;
  const iconLeftCalc = (size) =>
    `clamp(${minPosition}%, calc(${progress * 100}% - ${size}), calc(100% - ${size}))`;

  const iconLeft = {
    base: iconLeftCalc(baseIconSize),
    md: iconLeftCalc(xlIconSize),
  };
  const maxWidthConstraint =
    progress < 0.3
      ? `${100 - minPosition}%`
      : `calc(${100 - minPosition}% - 20px)`;
  const barWidth = `min(calc(100% -  ${progress * 100}%), ${maxWidthConstraint})`;

  return {
    progressIconLeft: iconLeft,
    progressBarWidth: barWidth,
  };
};

/**
 * Progress modal component that displays loading animation with customizable content
 * Automatically handles progress animation, web vitals monitoring, and modal lifecycle
 *
 * @param {Object} props - Component props
 * @param {string} props.status - Main loading message displayed prominently
 * @param {string} [props.details] - Optional additional details text
 * @param {string} [props.disclaimer] - Optional disclaimer text shown at bottom
 * @param {boolean} [props.isComplete] - External completion signal to close modal
 * @param {boolean} [props.open] - External control for modal open state (if undefined, uses internal state)
 * @param {boolean} [props.shouldStart] - Manual control to start progress animation
 *   - undefined: Auto-starts immediately (default behavior)
 *   - true: Waits for parent to set true, then starts
 *   - false: Waits for parent to set true
 * @returns {JSX.Element} Modal with animated progress bar and customizable content
 */
export default function LoadingModal({
  status,
  details,
  disclaimer,
  isComplete,
  open: externalOpen,
  shouldStart,
}) {
  const shouldAutoStart = shouldStart === undefined;
  const [internalOpen, setInternalOpen] = useState(shouldAutoStart);
  const open = externalOpen ?? internalOpen;

  const [isLongLoading, setIsLongLoading] = useState(false);

  const { setTimeoutSafe, clearTimeoutSafe } = useTimeout();

  const handleNoopClose = useCallback(() => {
    // Modal should not be closed by user interaction
  }, []);

  const handleCloseModal = useCallback(() => {
    clearTimeoutSafe();
    setTimeoutSafe(() => setInternalOpen(false), MODAL_CLOSE);
  }, [clearTimeoutSafe, setTimeoutSafe]);

  const { progress, isAnimating, handleStart, handleReset, handleComplete } =
    useProgressAnimation({
      autoStart: shouldAutoStart,
      isComplete,

      onComplete: handleCloseModal,
      initialProgress: INITIAL_PROGRESS,
    });

  const { fcpReceived, isHydrated } = useFcpDetection();

  useEffect(() => {
    if (!isHydrated || isComplete !== undefined) return;
    handleComplete();
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const { progressIconLeft, progressBarWidth } = useMemo(
    () => calculateProgressPosition(fcpReceived, progress),
    [fcpReceived, progress],
  );

  // Manually start progress animation when shouldStart prop becomes true
  useEffect(() => {
    if (shouldStart === undefined) return;

    if (shouldStart && !isComplete && !isAnimating) {
      setInternalOpen(true);
      handleStart();
    }
  }, [shouldStart, isComplete, isAnimating, handleStart]);

  // restart the loading after first load finished
  useEffect(() => {
    if (isComplete === undefined) return;

    if (shouldStart === undefined && !isComplete && !open && !isAnimating) {
      setInternalOpen(true);
      handleReset(RESET_PROGRESS);
    }
  }, [isAnimating, isComplete, open, handleReset, shouldStart]);

  // Timer to show long loading message after 15 seconds
  useEffect(() => {
    if (!open) {
      setIsLongLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLongLoading(true);
    }, SHOW_LONG_LOADING_MESSAGE_TIMEOUT);

    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  return (
    <CustomModal open={open} onOpenChange={null}>
      <Center w="100%" my="30px" px="20px" gap="8px" flexDir="column">
        <Image
          src={logoLoadingGif.src}
          alt="logo-loading-gif"
          w={{ base: "100px", md: "200px" }}
        />
        <Status>{status}</Status>
        <Details>{details}</Details>
        <Disclaimer>{disclaimer}</Disclaimer>
        {!!isLongLoading && <LongLoading />}
      </Center>
      <ProgressBar
        barWidth={progressBarWidth}
        iconLeft={progressIconLeft}
        fcpReceived={fcpReceived}
      />
    </CustomModal>
  );
}
