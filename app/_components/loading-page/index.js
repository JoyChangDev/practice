"use client";
import { useState } from "react";

import LoadingModal from "@/components/loading-modal";

export default function LoadingPage({ children }) {
  const [open, setOpen] = useState(true);

  if (!open) return children;

  return (
    <LoadingModal
      open={open}
      complete={undefined}
      onClose={() => setOpen(false)}
      status="頁面載入中"
      details="正在模擬頁面初次渲染，完成後燈箱會自動關閉。"
      disclaimer="請稍候，不需要手動關閉此視窗"
    />
  );
}
