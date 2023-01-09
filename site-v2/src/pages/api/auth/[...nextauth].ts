import NextAuth, { type NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // pages: {
  //   signIn: "/auth/signin",
  // },
  callbacks: {
    async signIn({ user }) {
      await fetch("https://app.loops.so/api/v1/contacts/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.LOOPS_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          airproxy: true,
        }),
      });

      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_ID,
      clientSecret: env.AUTH0_SECRET,
      issuer: env.AUTH0_DOMAIN,
    }),
  ],
};

export default NextAuth(authOptions);
