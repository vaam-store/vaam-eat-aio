import { api } from "@app/trpc/react";

type UseProducts = {
  take?: number;
};

export function useProducts({ take = 6 }: UseProducts = {}) {
  const [, result] = api.zen.product.findMany.useSuspenseQuery({
    take,
    select: {
      thumbnail: true,
    },
  });

  return result;
}
