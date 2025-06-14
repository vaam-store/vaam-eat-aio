FROM node:24-alpine

LABEL maintainer="Stephane Segning <selastlambou@gmail.com>"
LABEL org.opencontainers.image.description="NextJS frontend for the VaamEAT"

WORKDIR /app

RUN yarn add prisma@6 zenstack@2 && \
    yarn cache clean

COPY companions/migrations/entrypoint.sh entrypoint.sh
COPY prisma .

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
