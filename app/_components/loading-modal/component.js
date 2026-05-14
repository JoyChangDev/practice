import { Flex, Icon, Separator, Text } from "@chakra-ui/react";
import { PiPaperPlaneTiltFill } from "react-icons/pi";

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

const LongLoading = ({ show }) => {
  return (
    <Text
      visibility={show ? "visible" : "hidden"}
      color="#3d3d3d"
      fontSize={{ base: "12px", md: "14px" }}
      fontWeight={400}
    >
      系統正在進行作業中，可能需要1-3分鐘，請勿關閉頁面。
    </Text>
  );
};

const ProgressBar = ({ progress, transitionMs }) => {
  const iconLeft = `clamp(3%, ${progress * 100}%, 97%)`; // Keep the icon within the left and right bounds of the progress bar
  const barWidth = `${Math.min((1 - progress) * 100, 97)}%`;

  const transition = `all ${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`;

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
        bg="linear-gradient( 90deg , #C3D825 , #25C5DA)"
        rounded="99px"
        zIndex={1}
      />

      <Flex
        w={barWidth}
        h="4px"
        bg="#e2ebf0"
        rounded="99px"
        pos="absolute"
        top="50%"
        right="0%"
        transform="translate(0%, -50%)"
        transition={transition}
        zIndex={1}
      />
      <Icon
        boxSize={{ base: "20px", md: "30px" }}
        color="#0F87FF"
        pos="absolute"
        top="50%"
        left={iconLeft}
        transform="translate(-50%, -50%)"
        transition={transition}
        zIndex={3}
      >
        <PiPaperPlaneTiltFill />
      </Icon>
    </Flex>
  );
};

export { Status, Details, Disclaimer, LongLoading, ProgressBar };
