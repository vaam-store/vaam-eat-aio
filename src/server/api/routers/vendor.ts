import { createTRPCRouter, protectedProcedure } from '@app/server/api/trpc';
import { VendorMemberRole } from '@prisma/client';
import { VendorInputSchema } from '@zenstackhq/runtime/zod/input';

export const vendorRouter = createTRPCRouter({
  create: protectedProcedure
    .input(VendorInputSchema.create)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const vendor = await ctx.db.vendor.create({
        ...(input as any),
        data: {
          ...(input.data as any),
          members: {
            create: {
              role: VendorMemberRole.ADMIN,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });

      return vendor;
    }),
});
