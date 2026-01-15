"use client";
import {
  Code,
  IconButton,
  Box,
  Text,
  Flex,
  Stack,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ImproveButton({ baseStyles }) {
  const [open, setOpen] = useState(false);
  const onToggle = () => setOpen(!open);

  return (
    <Flex alignItems="center" gap="20px">
      <Flex w="70px" justifyContent="flex-end">
        <Code variant="subtle" colorPalette="pink">
          Improves
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
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
  };
  return (
    <Stack gap="4px">
      <Box
        {...styles}
        transform={open ? "translateY(7px) rotate(45deg)" : "unset"}
      />
      <Box
        {...styles}
        opacity={open ? 0 : 1}
        transform={open ? "scaleX(0)" : "scaleX(1)"}
      />
      <Box
        {...styles}
        transform={open ? "translateY(-7px) rotate(-45deg)" : "unset"}
      />
    </Stack>
  );
};
