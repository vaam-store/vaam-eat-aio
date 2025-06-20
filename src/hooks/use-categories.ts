'use client';

import { api } from '@app/trpc/react';

type UseCategories = {
  query?: string;
  take?: number;
};

export function useSearchCategories({ query = '', take = 6 }: UseCategories) {
  const [categories, result] =
    api.zen.productCategory.findMany.useSuspenseQuery({
      take,
      where: {
        OR: [
          {
            name: {
              search: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              search: query,
              mode: 'insensitive',
            },
          },
          {
            slug: {
              search: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

  return { ...result, categories };
}

export function useCategories() {
  const [categories, result] =
    api.zen.productCategory.findMany.useSuspenseQuery();

  return { ...result, categories };
}
