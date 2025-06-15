import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@app/server/api/trpc";
import { sendEmail } from "@app/server/email/send-email";
import crypto from "crypto";
import { env } from "@app/env";
import { appRender } from "@app/server/email/app-render";

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

      await ctx.db.user.update({
        where: { id: userId },
        data: { name, image },
      });

      return { success: true };
    }),

  sendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userEmail = ctx.session.user.email;

    if (!userEmail) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not have an email address.",
      });
    }

    // Generate a secure verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store the token in the database
    await ctx.db.verificationToken.create({
      data: {
        identifier: userId, // Using userId as identifier for simplicity, could be email
        token,
        expires,
      },
    });

    // Construct the verification link
    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/settings/verify-email?token=${token}`;

    // Render the email component to an HTML string
    const emailHtml = await appRender({
      type: "email-verification",
      verificationLink,
    });

    // Send the email
    await sendEmail(
      ctx.emailTransporter,
      env.EMAIL_FROM,
      userEmail,
      "Verify your email address",
      emailHtml,
    );

    return { success: true, message: "Verification email sent." };
  }),

  verifyEmailToken: publicProcedure
    .input(z.object({ token: z.string().min(1, "Token is required") }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      const verificationToken = await ctx.db.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid or expired verification token.",
        });
      }

      if (verificationToken.expires < new Date()) {
        // Delete expired token
        await ctx.db.verificationToken.delete({
          where: { token },
        });
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Verification token has expired.",
        });
      }

      // Mark user's email as verified
      await ctx.db.user.update({
        where: { id: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });

      // Delete the token after successful verification (single-use)
      await ctx.db.verificationToken.delete({
        where: { token },
      });

      return { success: true, message: "Email verified successfully." };
    }),

  getVerificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    return { isVerified: !!user?.emailVerified };
  }),
});
