"use client";

import { Dialog, Portal } from "@chakra-ui/react";

export default function CustomModal({
  open,
  onOpenChange,
  children,
  ...props
}) {
  return (
    <Dialog.Root
      modal
      open={open}
      onOpenChange={onOpenChange}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      {...props}
    >
      <Portal>
        <Dialog.Backdrop bg="#00000080" />
        <Dialog.Positioner>
          <Dialog.Content
            w="fit-content"
            minW={{ base: "300px", md: "500px" }}
            minH={{ base: "150px", md: "300px" }}
            bg="#fff"
            rounded="8px"
          >
            <Dialog.Body p="0">{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
