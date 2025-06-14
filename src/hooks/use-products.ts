import { api } from "@app/trpc/react";
import type { Prisma } from "@prisma/client";

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

  return {
    ...result,
    data: data as unknown as Array<
      Prisma.ProductGetPayload<{
        include: {
          thumbnail: true;
        };
      }>
    >,
  };
}
