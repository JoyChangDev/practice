import { ChakraProvider } from "@/components/config";
import { Box } from "@chakra-ui/react";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ChakraProvider>
          <Box m="20px">{children}</Box>
        </ChakraProvider>
      </body>
    </html>
  );
}
