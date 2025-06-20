import { api } from '@app/trpc/react';
import type { Prisma } from '@zenstackhq/runtime/models';

type UseVendor = {
  id: string;
};

export function useVendor({ id }: UseVendor) {
  const [vendor, result] = api.zen.vendor.findUnique.useSuspenseQuery({
    where: {
      id,
    },
    include: {
      contacts: true,
    },
  });

  return {
    ...result,
    vendor: vendor as unknown as Prisma.VendorGetPayload<{
      include: {
        contacts: true;
      };
    }>,
  };
}

type UseVendors = {
  where: Prisma.VendorWhereInput;
};

export function useVendors({ where }: UseVendors) {
  const [vendors, result] = api.zen.vendor.findMany.useSuspenseQuery({
    where,
    include: {
      contacts: true,
    },
  });

  return {
    ...result,
    vendors: vendors as unknown as Array<
      Required<
        Prisma.VendorGetPayload<{
          include: {
            contacts: true;
          };
        }>
      >
    >,
  };
}
