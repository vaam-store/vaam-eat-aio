import { api } from '@app/trpc/react';
import type { Prisma } from '@zenstackhq/runtime/models';
import { useCallback } from 'react';

type UseProducts = {
  take?: number;
  where?: Prisma.ProductWhereInput;
};

export function useProducts({ take = 6, where }: UseProducts = {}) {
  const [products, result] = api.zen.product.findMany.useSuspenseQuery({
    take,
    include: {
      thumbnail: true,
    },
    where,
  });

  return {
    ...result,
    products: products as unknown as Array<
      Prisma.ProductGetPayload<{
        include: {
          thumbnail: true;
        };
      }>
    >,
  };
}

export function useCountProducts({ where }: UseProducts) {
  const [productCount] = api.zen.product.count.useSuspenseQuery({
    where,
  });

  return {
    productCount,
  };
}

type UseProduct = {
  id: string;
};

export type SimpleProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    tags: true;
    thumbnail: true;
    options: true;
    variations: true;
  };
}>;

export function useProduct({ id }: UseProduct) {
  const data = api.zen.product.findUnique.useQuery({
    where: {
      id,
    },
    include: {
      images: true,
      tags: true,
      thumbnail: true,
      options: true,
      variations: true,
    },
  });

  return {
    ...data,
    product: data.data as unknown as SimpleProduct,
  };
}

export function useUpdateProduct() {
  const { mutateAsync } = api.zen.product.update.useMutation();
  return {
    updateProduct: useCallback(
      (id: string, values: any) =>
        mutateAsync({
          where: { id },
          data: values,
        }),
      [mutateAsync],
    ),
  };
}
