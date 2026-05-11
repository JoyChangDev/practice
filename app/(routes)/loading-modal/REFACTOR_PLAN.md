# LoadingModal 重構建議

## 核心問題分析

### 1. 目前 API 設計上的混亂點

- **雙重 open 狀態**：`externalOpen ?? internalOpen` 讓控制流不清楚，父層與元件各自管理，容易打架
- **`shouldStart` prop 語義不直觀**，且在 `index.js` 裡有複雜的三態判斷
- **`key` prop 的 hack**：父層靠 `key` 強制 reset 元件，代表元件本身沒有好的「重置能力」
- **bug**：`useProgressAnimation` 呼叫時有重複的 `onComplete` key，第一個被覆蓋

```js
// index.js:110-112
const { ... } = useProgressAnimation({
  onComplete: () => null,   // ← 這行完全無效，被下一行覆蓋
  onComplete: handleCloseModal,
});
```

---

## 建議的新 API

### 父層只需要管三件事

```jsx
<LoadingModal
  open={open}             // 父層控制開啟
  complete={isComplete}   // 父層通知「完成了」→ 元件接手動畫 + 關閉
  onClosed={handleClosed} // 元件關閉動畫結束後 callback，父層再 reset 狀態
  status="資料處理中"
  details="..."
  disclaimer="..."
/>
```

### 父層的使用流程（按鈕反覆開啟）

```jsx
function Page() {
  const [open, setOpen] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleOpen = () => {
    setComplete(false); // 確保 complete 是乾淨的
    setOpen(true);      // 開啟 modal
    // 模擬 API
    setTimeout(() => setComplete(true), 3000);
  };

  const handleClosed = () => {
    // 動畫結束後，父層再 reset open → 下次可以再開
    setOpen(false);
  };

  return (
    <LoadingModal
      open={open}
      complete={complete}
      onClosed={handleClosed}
      status="資料處理中"
    />
  );
}
```

**好處：**
- 不再需要 `key` prop
- `complete` 只要從 `false → true` 一次，元件接手
- `onClosed` 通知父層「現在可以 reset 了」
- 初次進入頁面就是 `open={true}, complete={false}` → 資料好了 `setComplete(true)` 即可

### 初次進入頁面的使用流程

```jsx
function Page() {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    fetchData().then(() => setComplete(true));
  }, []);

  return (
    <LoadingModal
      open={true}        // 進入即開啟
      complete={complete}
      onClosed={() => {}}
      status="頁面載入中"
    />
  );
}
```

---

## 建議的元件內部狀態機

用一個 `phase` 狀態取代現在分散的多個 `useEffect`：

```
open=true                → phase: "loading"    (進度條開始跑)
complete 變成 true        → phase: "completing"  (進度條衝到 100%)
進度條到 100%             → phase: "closing"    (播放關閉動畫)
關閉動畫結束              → 呼叫 onClosed
```

```jsx
// 用 useReducer 管理清楚的狀態轉換
const [phase, dispatch] = useReducer(phaseReducer, "idle");
// phase: "idle" | "loading" | "completing" | "closing"
```

### phase 狀態轉換邏輯範例

```js
function phaseReducer(state, action) {
  switch (action) {
    case "OPEN":          return "loading";
    case "COMPLETE":      return state === "loading" ? "completing" : state;
    case "PROGRESS_DONE": return "closing";
    case "CLOSE_DONE":    return "idle";
    default:              return state;
  }
}
```

---

## 建議的結構重組

```
loading-modal/
  index.js              ← 精簡，只負責組合
  custom-modal.js       ← 不動
  component.js          ← 不動 (Status, Details... 等)
  _hooks/
    useProgressAnimation.js   ← 不動
    useModalPhase.js          ← 新增：管理 phase 狀態機，取代 index.js 裡的複雜 effects
```

### `useModalPhase.js` 的職責

```jsx
// _hooks/useModalPhase.js
function useModalPhase({ open, complete, onClosed }) {
  const [phase, dispatch] = useReducer(phaseReducer, "idle");

  // open 變 true → 開始 loading
  useEffect(() => {
    if (open) dispatch("OPEN");
  }, [open]);

  // complete 變 true → 進入 completing
  useEffect(() => {
    if (complete) dispatch("COMPLETE");
  }, [complete]);

  // closing 結束後通知父層
  useEffect(() => {
    if (phase === "idle" && onClosed) onClosed();
  }, [phase, onClosed]);

  const isVisible = phase !== "idle";
  return { phase, isVisible, dispatch };
}
```

### `index.js` 簡化後的樣子

```jsx
// index.js（重構後）
export default function LoadingModal({ open, complete, onClosed, status, details, disclaimer }) {
  const { phase, isVisible, dispatch } = useModalPhase({ open, complete, onClosed });

  const { progress } = useProgressAnimation({
    active: phase === "loading",
    complete: phase === "completing",
    onComplete: () => dispatch("PROGRESS_DONE"),
  });

  const { progressIconLeft, progressBarWidth } = calculateProgressPosition(progress);

  return (
    <CustomModal open={isVisible} onCloseAnimationEnd={() => dispatch("CLOSE_DONE")}>
      <ModalBody status={status} details={details} disclaimer={disclaimer} />
      <ProgressBar barWidth={progressBarWidth} iconLeft={progressIconLeft} />
    </CustomModal>
  );
}
```

---

## 關於 Web Vitals / FCP 監聽

目前的 `useWebVitalsHandler` 跟 `fcpReceived` 邏輯是為了「初次頁面渲染」這個 use case 設計的，但這讓元件在「按鈕觸發」use case 時有多餘的監聽行為。

**建議**：保留此邏輯，但用 prop 明確控制是否啟用：

```jsx
<LoadingModal
  open={open}
  complete={complete}
  onClosed={handleClosed}
  trackFCP  // 僅初次渲染 use case 才加這個，啟用 FCP 監聽
/>
```

元件內部：

```jsx
// index.js
useWebVitalsHandler({
  shouldListen: trackFCP && phase === "loading",
  onFCP: handleFCP,
  onHydration: trackFCP ? handleHydration : undefined,
});
```

---

## 變更摘要對照表

| 項目 | 現在 | 建議 |
|---|---|---|
| 開啟控制 | `open` + `internalOpen` 雙重狀態 | 只有 `open` prop |
| 關閉觸發 | `isComplete` + `key` reset | `complete` prop + `onClosed` callback |
| 內部狀態 | 多個分散的 `useEffect` | 單一 `phase` 狀態機 |
| 重複開啟 | 靠 `key` prop 強制 remount | 直接 reset `open/complete` |
| FCP 監聽 | 永遠啟用 | 加 `trackFCP` prop 控制 |
| 程式位置 | 邏輯散落 `index.js` | 邏輯集中 `useModalPhase.js` |
