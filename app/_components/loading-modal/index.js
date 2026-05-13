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
 * Loading modal with animated progress bar.
 * Open/close state is fully controlled by the parent.
 * FCP detection and progress animation are managed internally.
 *
 * @param {Object} props
 * @param {string} props.status - Main loading message
 * @param {string} [props.details] - Optional detail text
 * @param {string} [props.disclaimer] - Optional disclaimer text
 * @param {boolean} props.open - Whether the modal is open
 * @param {boolean} [props.complete] - Signal that the operation is done; triggers animation completion and onClose
 * @param {Function} [props.onClose] - Called after the closing animation finishes
 */
export default function LoadingModal({
  status,
  details,
  disclaimer,
  open,
  complete,
  onClose,
}) {
  const [isLongLoading, setIsLongLoading] = useState(false);

  const { setTimeoutSafe, clearTimeoutSafe } = useTimeout();

  const closeModal = useCallback(() => {
    clearTimeoutSafe();
    setTimeoutSafe(() => onClose?.(), MODAL_CLOSE);
  }, [clearTimeoutSafe, setTimeoutSafe, onClose]);

  const { progress, handleStart, handleReset, handleComplete } =
    useProgressAnimation({
      autoStart: false,
      isComplete: complete,
      onComplete: closeModal,
      initialProgress: INITIAL_PROGRESS,
    });

  const { fcpReceived, isHydrated } = useFcpDetection();

  // Start animation when modal opens; reset when it closes so next open starts fresh
  useEffect(() => {
    if (open) handleStart();
    else handleReset(RESET_PROGRESS);
  }, [open, handleStart, handleReset]);

  // When hydration fires and complete is not externally controlled, close the modal
  useEffect(() => {
    if (!isHydrated || complete !== undefined) return;
    handleComplete();
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const { progressIconLeft, progressBarWidth } = useMemo(
    () => calculateProgressPosition(fcpReceived, progress),
    [fcpReceived, progress],
  );

  // Timer to show long loading message after 15 seconds
  useEffect(() => {
    if (!open) return setIsLongLoading(false);

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
