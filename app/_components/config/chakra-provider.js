"use client";

import {
  ChakraProvider as Provider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

import { listRecipe } from "./chakra-recipe";

const customConfig = defineConfig({
  theme: {
    slotRecipes: {
      list: listRecipe,
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

export default function ChakraProvider({ children }) {
  return <Provider value={system}>{children}</Provider>;
}
