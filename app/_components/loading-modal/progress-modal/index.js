'use client';

import { Flex, Icon, Image, Separator, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import useTimeout from '@/hooks/useTimeout';
import useWebVitalsHandler from '@/hooks/useWebVitalsHandler';

import CustomModal from '../custom-modal';

import useProgressAnimation from './_hooks/useProgressAnimation';
import logoLoadingGif from './assets/cola-logo-loading.gif';
import IconPlane from './assets/plane.svg';

// Progress Configuration
const INITIAL_PROGRESS = 0.3;
const RESET_PROGRESS = 0.05;
const DOCUMENT_COMPLETE_READY_STATE = 'complete';

// Animation Timing (in milliseconds)
const PROGRESS_TRANSITION = 300;
const MODAL_CLOSE = PROGRESS_TRANSITION + 100; // Must be longer than progress transition
const FCP_FALLBACK_TIMEOUT = 700; // 200ms after CSS animation (500ms)
const SHOW_LONG_LOADING_MESSAGE_TIMEOUT = 15000; // 15 seconds

const ICON_SIZES = { base: '30px', xl: '40px' };

// CSS Keyframe Animations
const progressKeyframes = keyframes`
  0% { left: 0% }
  100% { left: 30% }
`;

const shrinkKeyframes = keyframes`
  0% { width: calc(100% - 20px) }
  100% { width: calc(70% - 20px) }
`;

// Calculate progress bar and icon positioning
const calculateProgressPosition = (fcpReceived, progress) => {
  if (!fcpReceived) {
    return { progressIconLeft: '0%', progressBarWidth: '90%' };
  }

  const { base: baseIconSize, xl: xlIconSize } = ICON_SIZES;

  const minPosition = (progress < INITIAL_PROGRESS ? RESET_PROGRESS : INITIAL_PROGRESS) * 100;
  const iconLeftCalc = (size) =>
    `clamp(${minPosition}%, calc(${progress * 100}% - ${size}), calc(100% - ${size}))`;

  const iconLeft = {
    base: iconLeftCalc(baseIconSize),
    xl: iconLeftCalc(xlIconSize),
  };
  const maxWidthConstraint =
    progress < 0.3 ? `${100 - minPosition}%` : `calc(${100 - minPosition}% - 20px)`;
  const barWidth = `min(calc(100% -  ${progress * 100}%), ${maxWidthConstraint})`;

  return {
    progressIconLeft: iconLeft,
    progressBarWidth: barWidth,
  };
};

// Render modal content section
const renderContent = (status, details, disclaimer, isLongLoading) => (
  <Flex
    w="100%"
    px={{ base: '24px', xl: '40px' }}
    gap="8px"
    textAlign="center"
    flexDir="column"
    alignItems="center"
  >
    <Image src={logoLoadingGif.src} alt="logo-loading-gif" w={{ base: '100px', xl: '200px' }} />
    <Text
      color="#454545"
      fontSize={{ base: '16px', xl: '24px' }}
      fontWeight={700}
      lineHeight={1.2}
      whiteSpace="pre-line"
    >
      {status}
    </Text>

    {!!details && (
      <>
        <Text
          color="#3d3d3d"
          fontSize={{ base: '12px', xl: '14px' }}
          fontWeight={400}
          whiteSpace="pre-line"
          lineHeight={1.2}
        >
          {details}
        </Text>

        <Separator w="100%" h="1px" bg="#e7e7e7" my={{ base: '8px', xl: '16px' }} />
      </>
    )}

    {!!disclaimer && (
      <Text color="#3d3d3d" fontSize={{ base: '12px', xl: '14px' }} fontWeight={400}>
        {disclaimer}
      </Text>
    )}

    {!!isLongLoading && (
      <Text color="#3d3d3d" fontSize={{ base: '12px', xl: '14px' }} fontWeight={400}>
        系統正在進行作業中，可能需要1-3分鐘，請勿關閉頁面。
      </Text>
    )}
  </Flex>
);

// Render progress bar section
const renderProgressBar = (progressBarWidth, progressIconLeft, fcpReceived) => (
  <Flex w="100%" h={{ base: '20px', xl: '40px' }} pos="relative" alignItems="center">
    <Flex
      w="100%"
      h="4px"
      bg="linear-gradient(to right, #edd7f7, #cc3bff)"
      rounded="99px"
      zIndex={1}
    />

    <Flex
      h="4px"
      bg="linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.80) 100%), #1A1A1A;"
      rounded="99px"
      bgBlendMode="normal, plus-lighter"
      boxShadow="0.407px 0.407px 0.407px -24.536px #45ABDB inset, 0.407px 0.407px 0.407px -14.021px #FFF inset, -0.407px -0.407px 0.407px -14.021px #1A3845 inset, 0 0 0 7.01px #999 inset, 0 0 154.227px 0 rgba(242, 242, 242, 0.50) inset"
      backdropFilter="blur(6.215058326721191px)"
      pos="absolute"
      top="50%"
      right="0%"
      transform="translate(0%, -50%)"
      transition={`all ${PROGRESS_TRANSITION}ms cubic-bezier(0.4, 0, 0.2, 1)`}
      zIndex={1}
      w={progressBarWidth}
      animation={
        fcpReceived ? undefined : `${shrinkKeyframes} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
      }
    />

    <Icon
      w={ICON_SIZES}
      h="auto"
      viewBox="0 0 40 48"
      pos="absolute"
      top="50%"
      transform="translate(0%, -50%)"
      transition={`all ${PROGRESS_TRANSITION}ms cubic-bezier(0.4, 0, 0.2, 1)`}
      zIndex={3}
      left={progressIconLeft}
      animation={
        fcpReceived ? undefined : `${progressKeyframes} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
      }
    >
      <IconPlane />
    </Icon>
  </Flex>
);

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
export default function ProgressModal({
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

  const [fcpReceived, setFcpReceived] = useState(false);
  const [isLongLoading, setIsLongLoading] = useState(false);

  const { setTimeoutSafe, clearTimeoutSafe } = useTimeout();

  const handleNoopClose = useCallback(() => {
    // Modal should not be closed by user interaction
  }, []);

  const handleCloseModal = useCallback(() => {
    clearTimeoutSafe();
    setTimeoutSafe(() => setInternalOpen(false), MODAL_CLOSE);
  }, [clearTimeoutSafe, setTimeoutSafe]);

  const { progress, isAnimating, handleStart, handleReset, handleComplete } = useProgressAnimation({
    autoStart: shouldAutoStart,
    isComplete,
    onComplete: handleCloseModal,
    initialProgress: INITIAL_PROGRESS,
  });

  const shouldListen = useMemo(
    () =>
      !(
        ((typeof document !== 'undefined' &&
          document.readyState === DOCUMENT_COMPLETE_READY_STATE) ||
          fcpReceived) &&
        progress >= 1
      ),
    [fcpReceived, progress],
  );

  const handleFCP = useCallback(() => {
    if (!fcpReceived) {
      setFcpReceived(true);
    }
  }, [fcpReceived]);

  const handleHydration = useCallback(() => {
    handleComplete();
    handleCloseModal();
  }, [handleCloseModal, handleComplete]);

  useWebVitalsHandler({
    shouldListen,
    onFCP: handleFCP,
    onHydration: isComplete === undefined ? handleHydration : undefined,
  });

  const { progressIconLeft, progressBarWidth } = useMemo(
    () => calculateProgressPosition(fcpReceived, progress),
    [fcpReceived, progress],
  );

  // Fallback: Force fcpReceived after CSS animation completes
  useEffect(() => {
    if (!fcpReceived) {
      const fallbackTimer = setTimeout(() => {
        setFcpReceived(true);
      }, FCP_FALLBACK_TIMEOUT);

      return () => {
        clearTimeout(fallbackTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <CustomModal
      modal
      open={open}
      onClose={handleNoopClose}
      headerProps={{ display: 'none' }}
      closeTriggerProps={{ display: 'none' }}
      contentProps={{
        w: { base: '280px', xl: '500px' },
        bg: '#fff',
        rounded: '8px',
      }}
      bodyProps={{
        px: '0px',
        pt: { base: '16px', xl: '32px' },
        pb: { base: '16px', xl: '40px' },
        gap: { base: '16px', xl: '24px' },
        display: 'flex',
        flexDir: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Noto Sans TC',
      }}
      backdropProps={{ bg: 'rgba(0, 0, 0, 0.5)' }}
    >
      {renderContent(status, details, disclaimer, isLongLoading)}
      {renderProgressBar(progressBarWidth, progressIconLeft, fcpReceived)}
    </CustomModal>
  );
}
