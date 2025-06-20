import { api } from '@app/trpc/react';
import type { Prisma } from '@zenstackhq/runtime/models';

type UseOrder = {
  id: string;
};

export function useOrder({ id }: UseOrder) {
  const [order, result] = api.zen.order.findUnique.useSuspenseQuery({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  return {
    ...result,
    order: order as unknown as Prisma.OrderGetPayload<{
      include: {
        items: true;
      };
    }>,
  };
}

type UseOrders = {
  where: Prisma.OrderWhereInput;
};

export function useOrders({ where }: UseOrders) {
  const [orders, result] = api.zen.order.findMany.useSuspenseQuery({
    where,
    include: {
      items: true,
    },
  });

  return {
    ...result,
    orders: orders as unknown as Array<
      Prisma.OrderGetPayload<{
        include: {
          items: true;
        };
      }>
    >,
  };
}

export function useCountOrders({ where }: UseOrders) {
  const [orderCount] = api.zen.order.count.useSuspenseQuery({
    where,
  });

  return {
    orderCount,
  };
}
