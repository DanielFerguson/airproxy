import type { CfListKeysResponse } from "../../../types/custom";
import { router, protectedProcedure } from "../trpc";

type SubscriptionTier = "Free" | "Hobby" | "Team" | "Business";

interface SubscriptionDetails {
  requestsPerMonth: number;
  uniqueUsersPerMonth: number;
  level: SubscriptionTier;
}

export const userRouter = router({
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      return false;
    }

    // Bust the cache of each of these tables
    const CF_HEADERS = {
      Authorization: `Bearer ${process.env.CF_BEARER_TOKEN}`,
    };

    const LMS_HEADERS = {
      Authorization: `Bearer ${process.env.LMS_BEARER_TOKEN}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    };

    // Get all of the users subscriptions
    const subscriptions = await ctx.prisma.subscription.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    subscriptions.forEach(async (subscription) => {
      // Delete the subscription
      await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions/${subscription.subscriptionId}`,
        {
          headers: LMS_HEADERS,
          method: "DELETE",
        }
      );
    });

    // Delete all of the users views
    const bases = await ctx.prisma.base.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        tables: true,
      },
    });

    bases.forEach(async (base) => {
      await base.tables.forEach((table) => {
        // Delete all views for this table
        ctx.prisma.view.deleteMany({
          where: {
            tableId: table.id,
          },
        });
      });

      // Delete all tables for this base
      await ctx.prisma.table.deleteMany({
        where: {
          baseId: base.id,
        },
      });

      // Get all keys with the prefix
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CF_KV_ID}/keys?prefix=data:${base.id}}`,
        {
          headers: CF_HEADERS,
        }
      );

      const namespaces: CfListKeysResponse = await response.json();

      if (!namespaces.success) {
        throw new Error("Failed to get Cloudflare KV namespaces");
      }

      // Delete all keys
      namespaces.result.forEach((namespace) => {
        fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CF_KV_ID}/values/${namespace.name}`,
          {
            headers: CF_HEADERS,
            method: "DELETE",
          }
        );
      });
    });

    // Delete all bases for this user
    await ctx.prisma.base.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // Delete all PersonalAccessTokens for this user
    await ctx.prisma.personalAccessToken.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // Delete all accounts for this user
    await ctx.prisma.account.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // Delete the user
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });

    return true;
  }),
  subscription: protectedProcedure.query(
    async ({ ctx }): Promise<SubscriptionDetails> => {
      if (!ctx.session) {
        return {
          requestsPerMonth: 0,
          uniqueUsersPerMonth: 0,
          level: "Free",
        };
      }

      const subscription = await ctx.prisma.subscription.findFirst({
        where: {
          userId: ctx.session.user.id,
          AND: {
            renewsAt: {
              gte: new Date(),
            },
            status: "active",
          },
        },
      });

      if (!subscription) {
        return {
          requestsPerMonth: 1_000,
          uniqueUsersPerMonth: 250,
          level: "Free",
        };
      }

      return {
        requestsPerMonth:
          subscription.status === "active"
            ? subscription.productName === "Hobby"
              ? 10_000
              : subscription.productName === "Team"
              ? 50_000
              : 300_000
            : 1_000,
        uniqueUsersPerMonth:
          subscription.status === "active"
            ? subscription.productName === "Hobby"
              ? 1_000
              : subscription.productName === "Team"
              ? 5_000
              : 20_000
            : 250,
        level: (subscription.productName as SubscriptionTier) ?? "Free",
      };
    }
  ),
});
