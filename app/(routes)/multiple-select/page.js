import {
  Center,
  Card as ChakraCard,
  Stack,
  Heading as ChakraHeading,
  Text,
  List,
} from "@chakra-ui/react";

import UseState from "@/components/multiple-select/useState";
import UseStateSecond from "@/components/multiple-select/useState-second";

const initialValues = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
].map((item) => ({ ...item, checked: false }));

export default function Page() {
  return (
    <Center>
      <Stack>
        <Heading>MULTIPLE SELECT</Heading>
        <Rules />
        <Card title="useState">
          <UseState initialValues={initialValues} />
          <UseStateSecond initialValues={initialValues} />
        </Card>
      </Stack>
    </Center>
  );
}

const Heading = ({ size = "xl", children, ...props }) => {
  return (
    <ChakraHeading size={size} fontWeight="300" {...props}>
      {children}
    </ChakraHeading>
  );
};

const Card = ({ title, children }) => {
  return (
    <ChakraCard.Root size="sm" shadow="sm">
      {title && (
        <ChakraCard.Header>
          <Heading>{title}</Heading>
        </ChakraCard.Header>
      )}
      <ChakraCard.Body color="fg.muted" gap="15px">
        {children}
      </ChakraCard.Body>
    </ChakraCard.Root>
  );
};

const Rules = () => {
  return (
    <Card>
      <Heading size="lg" fontWeight="400">
        規則說明
      </Heading>
      <Stack gap="6px" fontSize="14px">
        <Text>第一種</Text>
        <List.Root as="ol" pl="16px" gap="4px">
          <List.Item>
            當使用者點擊 all 時，根據 all
            打勾或沒打勾、全選或清空後面所有個別選項。
          </List.Item>
          <List.Item>當使用者進行部分選取時，自動清除 all 打勾。</List.Item>
        </List.Root>
      </Stack>
      <Stack gap="6px" fontSize="14px">
        <Text>第二種</Text>
        <List.Root as="ol" pl="16px" gap="4px">
          <List.Item>當使用者點擊打勾 all 時，清空後面所有個別選項。</List.Item>
          <List.Item>
            當使用者在個別選項全部選取或全部不選時，自動打勾
            all、並清空個別選項。
          </List.Item>
          <List.Item>當使用者進行部分選取時，自動清除 all 打勾。</List.Item>
        </List.Root>
      </Stack>
    </Card>
  );
};
