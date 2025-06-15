import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@app/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").optional(),
        image: z.string().url("Invalid image URL").optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, image } = input;
      const userId = ctx.session.user.id;

      // In a real application, you would update the user in your database here.
      // For now, we'll just log the update.
      console.log(`Updating user ${userId} profile: name=${name}, image=${image}`);

      // Simulate database update
      // await ctx.db.user.update({
      //   where: { id: userId },
      //   data: { name, image },
      // });

      return { success: true };
    }),

  sendVerificationEmail: publicProcedure
    .mutation(async ({ ctx }) => {
      // In a real application, you would send a verification email here.
      // This would typically involve generating a token and sending an email with a link.
      // For now, we'll just log the action.
      console.log(`Sending verification email to user ${ctx.session?.user?.email}`);

      // Simulate sending email
      // await sendEmail(ctx.session.user.email, "Verify your email", "Click this link to verify...");

      return { success: true };
    }),
});