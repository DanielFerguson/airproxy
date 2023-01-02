import NextAuth, { type NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
