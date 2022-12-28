import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import type { CfListKeysResponse } from "../../../types/custom";

export const tableRouter = router({
  setStatus: protectedProcedure
    .input(z.object({ tableId: z.string(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.update({
        where: {
          id: input.tableId,
        },
        data: {
          active: input.active,
        },
      });

      if (!table) {
        throw new Error("Table not found");
      }

      return true;
    }),
  setTtl: protectedProcedure
    .input(z.object({ tableId: z.string(), ttl: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.update({
        where: {
          id: input.tableId,
        },
        data: {
          ttl: input.ttl,
        },
      });

      if (!table) {
        throw new Error("Table not found");
      }

      return true;
    }),
  bustCache: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.findFirst({
        where: {
          id: input.tableId,
        },
      });

      if (!table) {
        throw new Error("Table not found");
      }

      const CF_HEADERS = {
        Authorization: `Bearer ${process.env.CF_BEARER_TOKEN}`,
      };

      // Get all keys with the prefix
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CF_KV_ID}/keys?prefix=data:${table.baseId}:${table.id}`,
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

      return true;
    }),
});
