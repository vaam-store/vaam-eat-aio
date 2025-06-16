import { env } from '@app/env';
import { db } from '@app/server/db';
import { VariationStatus } from '@prisma/client';
import type { MetadataRoute } from 'next';

const MAX_PER_SITEMAP = 50_000;

export async function generateSitemaps() {
  const result = await db.product.count({
    where: {
      status: VariationStatus.PUBLIC,
    },
  });
  const mod = result / MAX_PER_SITEMAP;
  return new Array(mod).map((_, idx) => ({ id: idx }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const start = id * MAX_PER_SITEMAP;
  const products = await db.product.findMany({
    take: MAX_PER_SITEMAP,
    skip: start,
    include: {
      images: true,
    },
  });

  return products.map((product) => ({
    url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/p/${product.id}`,
    lastModified: product.updatedAt,
    images: product.images.map(({ url }: any) => url as string),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
}
