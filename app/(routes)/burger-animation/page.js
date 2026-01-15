import { Center } from "@chakra-ui/react";
import ImproveButton from "@/components/burger-animation/improves";
import DefectButton from "@/components/burger-animation/defect";

const baseStyles = {
  w: "25px",
  h: "3px",
  bgColor: "#84329B",
};

export default function Page() {
  return (
    <Center flexDirection="column">
      <DefectButton baseStyles={baseStyles} />
      <ImproveButton baseStyles={baseStyles} />
    </Center>
  );
}
