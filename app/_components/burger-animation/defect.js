"use client";
import { Center, Code, IconButton, Box, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";

export default function DefectButton({ baseStyles }) {
  const [open, setOpen] = useState(false);
  const onToggle = () => setOpen(!open);

  return (
    <Flex alignItems="center" gap="20px">
      <Flex w="70px" justifyContent="flex-end">
        <Code variant="subtle" colorPalette="orange">
          Defect
        </Code>
      </Flex>
      <IconButton variant="ghost" onClick={onToggle}>
        <BurgerIcon open={open} baseStyles={baseStyles} />
      </IconButton>
      <Text>click to {open ? "close" : "open"}</Text>
    </Flex>
  );
}

const BurgerIcon = ({ open, baseStyles }) => {
  const styles = {
    ...baseStyles,
    margin: "4px 0",
    transition: "all 0.3s ease-in-out",
  };
  return (
    <Box>
      <Box
        {...styles}
        transform={open ? "translateY(7px) rotate(45deg)" : "unset"}
      />
      <Box {...styles} opacity={open ? 0 : 1} />
      <Box
        {...styles}
        transform={open ? "translateY(-7px) rotate(-45deg)" : "unset"}
      />
    </Box>
  );
};
