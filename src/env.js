import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_PORT: z.number(),
    S3_SCHEME: z.string(),
    S3_BUCKET: z.string(),
    S3_CDN_URL: z.string().url(),

    REDIS_URL: z.string().url().optional(),
    REDIS_PREFIX: z.string().optional(),

    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_FROM: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),

    NEXT_PUBLIC_EMGR_CDN: z.string().url().optional(),
    NEXT_PUBLIC_EMGR_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url(),

    NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,

    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_PORT: Number(process.env.S3_PORT),
    S3_SCHEME: process.env.S3_SCHEME,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_CDN_URL: process.env.S3_CDN_URL,

    REDIS_URL: process.env.REDIS_URL,
    REDIS_PREFIX: process.env.REDIS_PREFIX,

    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: Number(process.env.EMAIL_SERVER_PORT),
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,

    NEXT_PUBLIC_EMGR_CDN: process.env.NEXT_PUBLIC_EMGR_CDN,
    NEXT_PUBLIC_EMGR_APP_URL: process.env.NEXT_PUBLIC_EMGR_APP_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

    NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL:
      process.env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
