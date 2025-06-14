declare module "next-compose-plugins" {
  import type { NextConfig } from "next";
  import type { Awaitable } from "@auth/core/types";

  export default function withPlugins(
    plugins: ((config: NextConfig) => Awaitable<NextConfig>)[][],
    config: NextConfig,
  ): NextConfig;
}
