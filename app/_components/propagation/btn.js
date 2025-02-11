"use client";
import { Box, Button, Center, Text } from "@chakra-ui/react";

export default function Btn() {
  return (
    <Box>
      <Text color="#0891b2">Container</Text>
      <Center
        boxSize="200px"
        border="1px solid #06b6d4"
        borderRadius="4px"
        flexDirection="column"
        onClick={() => console.log("4 container bubble ↑")}
        onClickCapture={() => console.log("1 container capture ↓")}
      >
        <Button
          colorPalette="cyan"
          variant="surface"
          color="#0891b2"
          onClick={() => console.log("3 button bubble ↑")}
          onClickCapture={() => console.log("2 button capture ↓")}
        >
          Button
        </Button>
        <Text color="gray.400">open console</Text>
      </Center>
    </Box>
  );
}
