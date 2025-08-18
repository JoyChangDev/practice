import {
  Center,
  Card as ChakraCard,
  Stack,
  Heading as ChakraHeading,
} from '@chakra-ui/react';

import UseState from '@/components/multiple-select/useState';
import UseStateSecond from '@/components/multiple-select/useState-secord';

const initialValues = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
].map((item) => ({ ...item, checked: false }));

export default function Page() {
  return (
    <Center>
      <Stack>
        <Heading>MULTIPLE SELECT</Heading>
        <Card title="useState">
          <UseState initialValues={initialValues} />
          <UseStateSecond initialValues={initialValues} />
        </Card>
      </Stack>
    </Center>
  );
}

const Heading = ({ size = 'xl', children, ...props }) => {
  return (
    <ChakraHeading
      size={size}
      fontWeight="300"
      {...props}
    >
      {children}
    </ChakraHeading>
  );
};

const Card = ({ title, children }) => {
  return (
    <ChakraCard.Root
      size="sm"
      shadow="sm"
    >
      <ChakraCard.Header>
        <Heading>{title}</Heading>
      </ChakraCard.Header>
      <ChakraCard.Body
        color="fg.muted"
        gap="15px"
      >
        {children}
      </ChakraCard.Body>
    </ChakraCard.Root>
  );
};
