declare module 'next-compose-plugins' {
  import type { Awaitable } from '@auth/core/types';
  import type { NextConfig } from 'next';

  export default function withPlugins(
    plugins: ((config: NextConfig) => Awaitable<NextConfig>)[][],
    config: NextConfig,
  ): NextConfig;
}
