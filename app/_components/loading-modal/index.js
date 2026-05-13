"use client";

import { Center, Image } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

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
  PROGRESS_TRANSITION,
} from "./component";

// Must match RESET_PROGRESS and INITIAL_PROGRESS in component.js calculateProgressPosition
const RESET_PROGRESS = 0.05;
const MODAL_CLOSE_BUFFER = 100; // ms after progress transition before onClose fires
const LONG_LOADING_TIMEOUT = 15000; // 15 seconds

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

  const { setSafeTimeout, clearSafeTimeout } = useTimeout();

  const { fcpReceived, isHydrated } = useFcpDetection();

  const { progress, isAnimating, handleStart, handleReset, handleComplete } =
    useProgressAnimation();

  const closeModal = useCallback(() => {
    clearSafeTimeout();
    setSafeTimeout(() => onClose?.(), PROGRESS_TRANSITION + MODAL_CLOSE_BUFFER);
  }, [clearSafeTimeout, setSafeTimeout, onClose]);

  // Start animation when modal opens; reset when it closes so next open starts fresh
  useEffect(() => {
    if (open) handleStart(RESET_PROGRESS);
    else handleReset(RESET_PROGRESS);
  }, [open, handleStart, handleReset]);

  // When complete signals done, finish animation then close
  useEffect(() => {
    if (!complete || !isAnimating) return;
    const frame = requestAnimationFrame(() => {
      handleComplete();
      closeModal();
    });
    return () => cancelAnimationFrame(frame);
  }, [complete, isAnimating, handleComplete, closeModal, setSafeTimeout]);

  // When hydration fires and complete is not externally controlled, close the modal
  useEffect(() => {
    if (!isHydrated || complete !== undefined) return;
    handleComplete();
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Timer to show long loading message after 15 seconds
  useEffect(() => {
    if (!open) return setIsLongLoading(false);

    const timer = setTimeout(
      () => setIsLongLoading(true),
      LONG_LOADING_TIMEOUT,
    );

    return () => clearTimeout(timer);
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
      <ProgressBar fcpReceived={fcpReceived} progress={progress} />
    </CustomModal>
  );
}
