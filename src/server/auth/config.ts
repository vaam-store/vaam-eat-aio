import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { db } from "@app/server/db";
import type { Prisma } from "@prisma/client";

type PrismaUser = Prisma.UserGetPayload<{
  include: {
    vendorMembership: true,
  }
}>;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: PrismaUser & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  //   username?: string;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [KeycloakProvider],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth",
    signOut: "/auth/logout",
  },
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  trustHost: true,
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30 * 6,
  },
} satisfies NextAuthConfig;
