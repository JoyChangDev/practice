// Fade-in development notes (summary)
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
          <Popover.Content w="600px" h="700px" p="10px">
            <Popover.Body overflow="auto" overscrollBehaviorY="contain">
              <Box display="flex" flexDir="column" gap="16px">
                <ContentOne />
                <ContentTwo />
                <ContentThree />
              </Box>
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
            調整設定：
            <Code> opacity=&#123;inView ? 1 : 0&#125;</Code>
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

const ContentTwo = () => {
  return (
    <Box>
      <Card.Root p="10px" gap="10px">
        <Card.Header flexDir="row" p="0 20px" gap="5px">
          ② <Bold>useInView=&#123;&#123; onChange &#125;&#125;</Bold>
          <Small>避免在 useEffect 本體內直接同步更新 state</Small>
        </Card.Header>
        <Card.Body p="0 20px">
          <Small>
            <Code>useEffect</Code>
            適合處理副作用，不適合在依賴變動後立刻反覆同步
            <Code>setState</Code>
          </Small>
          <Small>
            <Code>onChange</Code>
            會在可視狀態改變時被觸發，能把更新集中在事件回呼中
          </Small>
        </Card.Body>
      </Card.Root>
      <List.Root lineHeight="2">
        <List.Item>
          <Text>
            問題：原在 <Code>useEffect</Code> 內根據 <Code>inView</Code> 呼叫
            <Code>setEnterOffset</Code>，用另一個 state 追著 inView 變化更新
          </Text>
        </List.Item>

        <List.Item>
          <Text>
            原始設定：
            <Code>useEffect(() =&gt; setEnterOffset(...), [inView])</Code>
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            調整設定：
            <Code>
              useInView(&#123; onChange: (inView, entry) =&gt;
              setEnterOffset(...) &#125;)
            </Code>
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            原因：effect 修改 state，state 更新會再次 render，
            容易產生額外更新或警告
          </Text>
        </List.Item>
        <List.Item>
          調整說明： <Code>inView</Code> 監測元素進出視窗時觸發
          <Code>onChange</Code> 時更新
          <Code>enterOffset</Code> 避免用 effect 追著 inView 再更新方向 state
        </List.Item>
      </List.Root>
    </Box>
  );
};

const ContentThree = () => {
  return (
    <Box>
      <Card.Root p="10px" gap="10px">
        <Card.Header flexDir="row" p="0 20px" gap="5px">
          ③ <Bold>entry</Bold>
          <Small>改用 IntersectionObserverEntry 判斷元素實際位置</Small>
        </Card.Header>
        <Card.Body p="0 20px">
          <Small>
            <Code>entry</Code>是 IntersectionObserver
            回傳的觀察資料，可取得元素進出 viewport 時的狀態
          </Small>
          <Small>
            其中 <Code>entry.boundingClientRect</Code>
            提供元素相對於 viewport
            的位置與尺寸，可用來計算目前元素在畫面上方或下方
          </Small>
        </Card.Body>
      </Card.Root>
      <List.Root lineHeight="2">
        <List.Item>
          <Text>
            歷史設定：曾經建立共用監聽滾動方向的函式，避免大量元件各自監聽、浪費效能
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            歷史調整：Context 不直接傳 state 狀態，而是傳
            <Code>isDown()</Code>
            函式，讓元件只有在觸發時才讀取目前方向，減少滾動時的 re-render
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            問題：使用 <Code>isDown()</Code>
            在觸發當下取得方向時，滑鼠上下快速滾動可能讓取得的方向和元素實際進入方向不同
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            原因：滾動方向不代表這個元素目前位在 viewport 的上方或下方
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            問題範例：當元素已從下方離開，但使用者又短暫往上滾動時，依
            <Code>isDown()</Code> 判斷出的
            <Code>enterOffset</Code> 可能會和期待的淡入方向相反
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            最終設定：
            <Code>
              entry.boundingClientRect.top + entry.boundingClientRect.height / 2
            </Code>
          </Text>
        </List.Item>
        <List.Item>
          調整說明：計算元素位置、和畫面中心點進行比較，根據元素在畫面的上/下半部，計算
          offset 從上/下方進行偏移，讓淡入方向跟元素實際位置一致
        </List.Item>
      </List.Root>
    </Box>
  );
};
