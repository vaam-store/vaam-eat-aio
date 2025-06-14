import type { MetadataRoute } from "next";
import { env } from "@app/env";
import { api } from "@app/trpc/server";
import { VariationStatus } from "@prisma/client";

const MAX_PER_SITEMAP = 50_000;

export async function generateSitemaps() {
  const result = await api.zen.product.count({
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
  const products = await api.zen.product.findMany({
    take: MAX_PER_SITEMAP,
    skip: start,
    include: {
      images: true,
    },
  });

  return products.map((product) => ({
    url: `${env.NEXT_PUBLIC_EMGR_APP_URL}/p/${product.id}`,
    lastModified: product.updatedAt,
    images: (product as any).images.map(({ url }: any) => url as string),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
}
