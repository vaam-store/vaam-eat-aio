import '@app/styles/globals.scss';

import type { Metadata } from 'next';

import { NetworkStatusHandler } from '@app/components/network-status/network-status-handler';
import {
  mainThemes,
  themeDataKey,
} from '@app/components/theme-toggle/constants';
import { env } from '@app/env';
import { TRPCReactProvider } from '@app/trpc/react';
import { HydrateClient } from '@app/trpc/server';
import { SessionProvider } from 'next-auth/react';
import { PublicEnvScript } from 'next-runtime-env';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(env.APP_URL),
    title: 'Vaam EAT',
    description: 'Eat healthy from Anywhere',
  };
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang='en' suppressHydrationWarning data-theme='light'>
      <head>
        <PublicEnvScript />
      </head>
      <TRPCReactProvider>
        <body>
          <HydrateClient>
            <ThemeProvider themes={mainThemes} storageKey={themeDataKey}>
              <SessionProvider>
                <Toaster position='bottom-right' reverseOrder={false} />
                <NetworkStatusHandler />
                <div id='app'>{children}</div>
              </SessionProvider>
            </ThemeProvider>
          </HydrateClient>
        </body>
      </TRPCReactProvider>
    </html>
  );
}
