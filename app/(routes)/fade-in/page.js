import { Box, VStack, Center } from "@chakra-ui/react";
import ScrollReveal from "@/components/fade-in/scroll-reveal";
import { ScrollDirectionProvider } from "@/components/fade-in/scroll-direction";
import Note from "@/components/fade-in/note";

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
    <ScrollDirectionProvider>
      <Box px="6" py="10">
        <Note />
        <VStack gap="20px" alignItems="center">
          {ITEMS.map((index) => (
            <ScrollReveal key={`reveal${index}`}>
              <Center
                boxSize="40px"
                bg={COLORS[index % COLORS.length]}
                borderRadius="md"
                boxShadow="md"
              >
                {index + 1}
              </Center>
            </ScrollReveal>
          ))}
        </VStack>
      </Box>
    </ScrollDirectionProvider>
  );
}
