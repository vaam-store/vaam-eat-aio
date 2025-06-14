FROM node:24-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  --mount=type=bind,source=.yarnrc.yml,target=/app/.yarnrc.yml \
  --mount=type=bind,source=yarn.lock,target=/app/yarn.lock \
  --mount=type=bind,source=package.json,target=/app/package.json \
  corepack enable && corepack prepare yarn@4.9.2 --activate


FROM base AS deps

RUN \
  --mount=type=bind,source=.yarnrc.yml,target=/app/.yarnrc.yml \
  --mount=type=bind,source=yarn.lock,target=/app/yarn.lock \
  --mount=type=bind,source=package.json,target=/app/package.json \
  --mount=type=cache,target=/app/node_modules \
  yarn install --immutable \
  && cp -R /app/node_modules /app/deps

# Rebuild the source code only when needed
FROM base AS builder


# This is mandatory and definitive
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# This is mandatory but not definitive
ENV S3_ENDPOINT="localhost"
ENV S3_PORT="19000"
ENV S3_SCHEME="https"
ENV S3_BUCKET="sschool"
ENV S3_CDN_URL="https://some.cdn.com"

ENV NEXT_PUBLIC_EMGR_CDN="https://emgr.ssegning.com/api/images/resize"
ENV NEXT_PUBLIC_EMGR_APP_URL="https://eat.vaam.store"

COPY --from=deps /app/deps ./node_modules

RUN \
  --mount=type=bind,source=./docs,target=/app/docs \
  --mount=type=bind,source=./public/favicon.ico,target=/app/public/favicon.ico \
  --mount=type=bind,source=./src,target=/app/src \
  --mount=type=bind,source=./.yarnrc.yml,target=/app/.yarnrc.yml \
  --mount=type=bind,source=./cache-handler.mjs,target=/app/cache-handler.mjs \
  --mount=type=bind,source=./image-loader.mjs,target=/app/image-loader.mjs \
  --mount=type=bind,source=./next.config.ts,target=/app/next.config.ts \
  --mount=type=bind,source=./package.json,target=/app/package.json \
  --mount=type=bind,source=./postcss.config.js,target=/app/postcss.config.js \
  --mount=type=bind,source=./tsconfig.json,target=/app/tsconfig.json \
  --mount=type=bind,source=./yarn.lock,target=/app/yarn.lock \
  --mount=type=cache,target=/app/.next \
  yarn build \
  && cp -R .next/standalone /app/final-standalone \
  && cp -R .next/static /app/final-static \
  && cp -R public /app/final-public

FROM node:24-alpine

LABEL maintainer="Stephane Segning <selastlambou@gmail.com>"
LABEL org.opencontainers.image.description="NextJS frontend for the SSchool"

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1
#
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup -S -g 1001 nodejs && adduser -S nextjs -G nodejs -u 1001

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/final-standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/final-static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/final-public ./public

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]