// Fade-in development notes (summary)
// - 問題：triggerOnce: false 時滾動會抖動
//   原因：inView 在臨界點反覆切換 + 方向更新導致 transform 改變
//   補充：原本 {inView ? children : null} 會讓高度進出視窗時改變，造成 layout shift
//   選擇：改成只在離開視窗時更新 offset，並保留 rAF 合併更新
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

import { Button, Popover, Portal } from "@chakra-ui/react";

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
          <Popover.Content>
            <Popover.Body>
              <Content />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

const Content = () => {
  return <>Content</>;
};
