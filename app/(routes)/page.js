'use client';
import { Stack, Text, Code } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Stack>
      <Link href="/propagation">
        <Code colorPalette="cyan">propagation</Code>
      </Link>
      <Link href="/multiple-select">
        <Code colorPalette="cyan">multiple-select</Code>
      </Link>
    </Stack>
  );
}
