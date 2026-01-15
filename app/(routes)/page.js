"use client";
import { Stack, Code } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Stack>
      <Link href="/propagation">
        <Code colorPalette="cyan">propagation</Code>
      </Link>
      <Link href="/multiple-select">
        <Code colorPalette="cyan">multiple-select</Code>
      </Link>
      <Link href="/burger-animation">
        <Code colorPalette="cyan">burger-animation</Code>
      </Link>
    </Stack>
  );
}
