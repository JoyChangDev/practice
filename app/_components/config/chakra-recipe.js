"use client";

import { defineSlotRecipe } from "@chakra-ui/react";

// list
export const listRecipe = defineSlotRecipe({
  base: {
    root: { cursor: "default", listStylePosition: "outside" },
  },
  variants: {
    variant: {
      marker: {
        root: { ml: "15px" },
        item: {
          _marker: { color: "currentColor" },
        },
      },
    },
  },
});
