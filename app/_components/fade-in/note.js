// Fade-in development notes (summary)
// - 問題：useEffect 內同步 setState 警告
//   原因：在 effect 本體直接改 state
//   選擇：改用 useInView 的 onChange 回呼更新
// - 問題：方向是否用 useState
//   原因：scroll 更新太頻繁，會造成大量 re-render
//   選擇：用 useRef 儲存方向，只有需要時讀取
// - 問題：100 個元件各自監聽 scroll
//   原因：每個元件各自 hook，效能差
//   選擇：改成共享方向（Context），只建立一份監聽
// - 問題：Context value 是否用 boolean
//   原因：boolean 會在 scroll 時頻繁更新，造成所有訂閱元件 re-render
//   選擇：Context 傳 isDown() 函式，避免高頻 re-render
// - 問題：淡入方向用上一次離開時的 scroll direction，反向滾回時可能相反
//   原因：離開方向不一定等於下一次進入畫面的方向
//   選擇：改用 IntersectionObserverEntry 的元素位置判斷 offset，並移除 scroll direction Context

import {
  Button,
  Popover,
  Portal,
  List,
  Text,
  Box,
  Code,
  Card,
} from "@chakra-ui/react";

export default function Note() {
  return (
    <Popover.Root positioning={{ placement: "bottom-end" }}>
      <Popover.Trigger asChild>
        <Button
          size="sm"
          variant="outline"
          position="fixed"
          top="10"
          right="10"
        >
          note
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content w="600px">
            <Popover.Body>
              <ContentOne />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

const sm = "12px";
const Small = ({ children }) => <Text fontSize={sm}>{children}</Text>;
const Bold = ({ children }) => (
  <Text fontSize="18px" fontWeight="600">
    {children}
  </Text>
);

const ContentOne = () => {
  return (
    <Box>
      <Card.Root p="10px" gap="10px">
        <Card.Header flexDir="row" p="0 20px" gap="5px">
          ① <Bold>triggerOnce</Bold>
          <Small>控制元素是否只在第一次進入視窗時觸發</Small>
        </Card.Header>
        <Card.Body p="0 20px">
          <Small>
            <Code>true</Code> 表示第一次進入後就維持已觸發狀態
          </Small>
          <Small>
            <Code>false</Code> 表示每次進出視窗都會重新判斷
          </Small>
        </Card.Body>
      </Card.Root>
      <List.Root lineHeight="2">
        <List.Item>
          <Text>
            問題：在
            <Code>triggerOnce: false</Code> 設定下，反覆滾動視窗時畫面出現抖動
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            原始設定: <Code>&#123;inView ? children : null&#125;</Code>
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            調整設定：<Code> opacity=&#123;inView ? 1 : 0&#125;</Code>
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            原因：原本設定使 DOM
            進出視窗時反覆渲染及移除、佈局高度改變，造成抖動
          </Text>
        </List.Item>
        <List.Item>
          調整說明：只在 DOM 離開可視範圍時更新 opacity，避免 inView 在臨界點因
          DOM 高度反覆渲染及移除，導致佈局高度不穩
        </List.Item>
      </List.Root>
    </Box>
  );
};
