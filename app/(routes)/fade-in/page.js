import { Box, VStack } from "@chakra-ui/react";
import LazySection from "@/components/fade-in/lazy-section";

const COLORS = [
  "red.300",
  "orange.300",
  "yellow.300",
  "green.300",
  "teal.300",
  "cyan.300",
  "blue.300",
  "purple.300",
  "pink.300",
];

const ITEMS = Array.from({ length: 100 }, (_, index) => index);

export default function Page() {
  return (
    <Box px="6" py="10">
      <VStack gap="20px" alignItems="center">
        {ITEMS.map((index) => (
          <LazySection key={index}>
            <Box
              boxSize="40px"
              bg={COLORS[index % COLORS.length]}
              borderRadius="md"
              boxShadow="md"
            />
          </LazySection>
        ))}
      </VStack>
    </Box>
  );
}
