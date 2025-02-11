import { Center } from "@chakra-ui/react";
import { Btn, Code } from "@/components/propagation";

export default function Page() {
  return (
    <Center flexWrap="wrap" alignItems="flex-end" gap="15px">
      <Btn />
      <Code />
    </Center>
  );
}
