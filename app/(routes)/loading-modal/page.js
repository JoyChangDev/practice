"use client";

import {
  Badge,
  Flex,
  Button,
  Center,
  Card,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import LoadingModal from "@/components/loading-modal";

const LOADING_DURATION = 3000;

export default function Page() {
  const [modalKey, setModalKey] = useState(0);

  const [modalOpen, setOpenModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const loadingTimerRef = useRef(null);

  const handleOpenLoading = () => {
    window.clearTimeout(loadingTimerRef.current);

    setModalKey((current) => current + 1);
    setIsComplete(false);
    setOpenModal(true);

    loadingTimerRef.current = window.setTimeout(() => {
      setIsComplete(true);
    }, LOADING_DURATION);
  };

  useEffect(() => () => window.clearTimeout(loadingTimerRef.current), []);

  return (
    <Center minH="100dvh" px="20px" bg="#f7fafc">
      <Card.Root
        w="100%"
        maxW="400px"
        variant="elevated"
        rounded="8px"
        bgColor="white"
      >
        <Card.Body p={{ base: "24px", md: "32px" }} gap="12px">
          <Flex gap="10px">
            <Heading as="h1" size="md">
              Loading Modal
            </Heading>
            <Badge
              w="fit-content"
              colorPalette={modalOpen ? "orange" : "green"}
            >
              {modalOpen ? "Loading" : "待機中"}
            </Badge>
          </Flex>

          <Box color="gray.600" fontSize="14px">
            <Text>點擊按鈕後會開啟 loading 燈箱</Text>
            <Text>模擬等待 3 秒，完成後自動關閉</Text>
          </Box>

          <Button
            w="fit-content"
            ml="auto"
            colorPalette="cyan"
            onClick={handleOpenLoading}
            disabled={modalOpen}
          >
            OPEN
          </Button>
        </Card.Body>
      </Card.Root>

      <LoadingModal
        key={modalKey}
        open={modalOpen}
        status="資料處理中"
        details="正在模擬 API 請求，完成後燈箱會自動關閉。"
        disclaimer="請稍候，不需要手動關閉此視窗"
        complete={isComplete}
        onClose={() => setOpenModal(false)}
      />
    </Center>
  );
}
