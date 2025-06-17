import 'server-only';

import { env } from '@app/env';
import { Client } from 'minio';

const createS3Client = () => {
  if (
    env.SKIP_ENV_VALIDATION &&
    !(env.S3_ENDPOINT && env.S3_ACCESS_KEY && env.S3_SECRET_KEY)
  ) {
    return undefined as unknown as Client;
  }
  return new Client({
    endPoint: env.S3_ENDPOINT,
    accessKey: env.S3_ACCESS_KEY,
    secretKey: env.S3_SECRET_KEY,
    useSSL: env.S3_SCHEME === 'https',
    port: env.S3_PORT,
  });
};

const globalForS3 = globalThis as unknown as {
  s3: ReturnType<typeof createS3Client> | undefined;
};

export const client = globalForS3.s3 ?? createS3Client();

if (env.NODE_ENV !== 'production') globalForS3.s3 = client;
