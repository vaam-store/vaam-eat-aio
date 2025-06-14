import { api } from "@app/trpc/react";
import type { Product, ProductImage, Prisma } from "@prisma/client";

type UseProducts = {
  take?: number;
};

export function useProducts({ take = 6 }: UseProducts = {}) {
  const [data, result] = api.zen.product.findMany.useSuspenseQuery({
    take,
    include: {
      thumbnail: true,
    },
  });

  return { ...result, data: data as unknown as Array<Product & { thumbnail: ProductImage }> };
}
