import { Flex, Icon, Image, Separator, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import IconPlane from "./assets/plane.svg";

const Status = ({ children }) => {
  return (
    <Text
      color="#454545"
      fontSize={{ base: "16px", md: "24px" }}
      fontWeight={700}
      lineHeight={1.2}
      whiteSpace="pre-line"
    >
      {children}
    </Text>
  );
};

const Details = ({ children }) => {
  if (!children) return null;
  return (
    <>
      <Text
        color="#3d3d3d"
        fontSize={{ base: "12px", md: "14px" }}
        fontWeight={400}
        whiteSpace="pre-line"
        lineHeight={1.2}
      >
        {children}
      </Text>

      <Separator
        w="100%"
        h="1px"
        bg="#e7e7e7"
        my={{ base: "8px", md: "16px" }}
      />
    </>
  );
};

const Disclaimer = ({ children }) => {
  return (
    <Text
      color="#3d3d3d"
      fontSize={{ base: "12px", md: "14px" }}
      fontWeight={400}
    >
      {children}
    </Text>
  );
};

const LongLoading = () => {
  return (
    <Text
      color="#3d3d3d"
      fontSize={{ base: "12px", md: "14px" }}
      fontWeight={400}
    >
      系統正在進行作業中，可能需要1-3分鐘，請勿關閉頁面。
    </Text>
  );
};

// CSS Keyframe Animations
const progressKeyframes = keyframes`
  0% { left: 0% }
  100% { left: 30% }
`;

const shrinkKeyframes = keyframes`
  0% { width: calc(100% - 20px) }
  100% { width: calc(70% - 20px) }
`;

const ProgressBar = ({ barWidth, iconLeft, fcpReceived }) => {
  const PROGRESS_TRANSITION = 300;
  const barAnimation = fcpReceived
    ? undefined
    : `${shrinkKeyframes} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const iconAnimation = fcpReceived
    ? undefined
    : `${progressKeyframes} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  return (
    <Flex
      w="100%"
      h={{ base: "20px", md: "40px" }}
      my="30px"
      pos="relative"
      alignItems="center"
    >
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
        w={barWidth}
        animation={barAnimation}
      />

      <Icon
        w={{ base: "30px", md: "40px" }}
        h="auto"
        viewBox="0 0 40 48"
        pos="absolute"
        top="50%"
        transform="translate(0%, -50%)"
        transition={`all ${PROGRESS_TRANSITION}ms cubic-bezier(0.4, 0, 0.2, 1)`}
        zIndex={3}
        left={iconLeft}
        animation={iconAnimation}
      >
        <IconPlane />
      </Icon>
    </Flex>
  );
};

export { Status, Details, Disclaimer, LongLoading, ProgressBar };
