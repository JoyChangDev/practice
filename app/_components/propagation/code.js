"use client";
import { Text, Stack } from "@chakra-ui/react";

export default function Code() {
  return (
    <Stack
      w="max-content"
      minH="200px"
      border="1px solid #06b6d4"
      borderRadius="4px"
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      justifyItems="center"
      gap="10px"
      bgColor="cyan.50"
    >
      <Stack as="pre" m="20px 40px" gap="20px">
        <Text color="cyan.600">Capture</Text>
        <Text>
          addEventListener
          <br />
          (type, listener, <Mark tx="true" />)
        </Text>
        <Text>
          onClick
          <Mark tx="Capture" />
        </Text>
      </Stack>
      <Stack as="pre" m="20px 40px" gap="20px">
        <Text color="cyan.600">Bubble</Text>
        <Text>
          addEventListener
          <br />
          (type, listener, <Mark tx="false" />)
        </Text>
        <Text>onClick</Text>
      </Stack>
    </Stack>
  );
}

function Mark({ tx }) {
  return (
    <Text as="span" color="cyan.600">
      {tx}
    </Text>
  );
}
