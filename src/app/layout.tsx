import "@app/styles/globals.scss";

import type { Metadata } from "next";

import {
  mainThemes,
  themeDataKey,
} from "@app/components/theme-toggle/constants";
import { TRPCReactProvider } from "@app/trpc/react";
import { HydrateClient } from "@app/trpc/server";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Vaam EAT",
  description: "Eat healthy from Anywhere",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <TRPCReactProvider>
        <body>
          <HydrateClient>
            <ThemeProvider themes={mainThemes} storageKey={themeDataKey}>
              <SessionProvider>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div id="app">{children}</div>
              </SessionProvider>
            </ThemeProvider>
          </HydrateClient>
        </body>
      </TRPCReactProvider>
    </html>
  );
}
