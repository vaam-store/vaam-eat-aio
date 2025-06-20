import { api } from '@app/trpc/react';

export function useTags() {
  const [tags, result] = api.zen.productTag.findMany.useSuspenseQuery();
  return { ...result, tags };
}
