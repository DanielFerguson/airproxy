import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
import type { BaseApiResponse, TableApiResponse } from "../../../types/custom";
import type { CfListKeysResponse } from "../../../types/custom";

export const baseRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.base.findUnique({
        where: {
          id: input.id,
        },
        include: {
          requests: true,
          tables: {
            include: {
              views: true,
            },
          },
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.base.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        tables: {
          include: {
            views: true,
          },
        },
      },
    });
  }),
  toggleStatus: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.prisma.base.findUnique({
        where: {
          id: input.baseId,
        },
      });

      if (!base) {
        throw new Error("Base not found");
      }

      await ctx.prisma.base.update({
        where: {
          id: base.id,
        },
        data: {
          active: !base.active,
        },
      });
    }),
  createToken: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.prisma.base.findUnique({
        where: {
          id: input.baseId,
        },
      });

      if (!base) {
        throw new Error("Base not found");
      }

      await ctx.prisma.base.update({
        where: {
          id: base.id,
        },
        data: {
          apiToken: uuidv4(),
        },
      });
    }),
  removeToken: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.prisma.base.findUnique({
        where: {
          id: input.baseId,
        },
      });

      if (!base) {
        throw new Error("Base not found");
      }

      await ctx.prisma.base.update({
        where: {
          id: base.id,
        },
        data: {
          apiToken: null,
        },
      });
    }),
  toggleAllTableStatus: protectedProcedure
    .input(z.object({ baseId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.table.updateMany({
        where: {
          baseId: input.baseId,
        },
        data: {
          active: input.status,
        },
      });
    }),
  setStatus: protectedProcedure
    .input(z.object({ baseId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.base.update({
        where: {
          id: input.baseId,
        },
        data: {
          active: input.status,
        },
      });
    }),
  setAllTablesStatus: protectedProcedure
    .input(z.object({ baseId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.table.updateMany({
        where: {
          baseId: input.baseId,
        },
        data: {
          active: input.status,
        },
      });
    }),
  bustCache: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .mutation(async ({ input }) => {
      // Bust the cache of each of these tables
      const CF_HEADERS = {
        Authorization: `Bearer ${process.env.CF_BEARER_TOKEN}`,
      };

      // Get all keys with the prefix
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CF_KV_ID}/keys?prefix=data:${input.baseId}}`,
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
    }),
  setAllStatus: protectedProcedure
    .input(z.object({ status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.base.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          active: input.status,
        },
      });
    }),
  refetch: protectedProcedure.mutation(async ({ ctx }) => {
    // Get the users personalAccessTokens
    const personalAccessTokens = await ctx.prisma.personalAccessToken.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // For each personalAccessToken, fetch the bases
    await personalAccessTokens.forEach(async (token) => {
      const response = await fetch("https://api.airtable.com/v0/meta/bases", {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      const bases: BaseApiResponse = await response.json();

      // For each base, check if it exists in the database
      bases.bases.forEach(async (base) => {
        // Upsert base
        await ctx.prisma.base.upsert({
          where: {
            id: base.id,
          },
          update: {
            name: base.name,
          },
          create: {
            id: base.id,
            name: base.name,
            personalAccessTokenId: token.id,
            userId: ctx.session.user.id,
          },
        });

        // Fetch the tables attached to this base
        const tableRequest = await fetch(
          `https://api.airtable.com/v0/meta/bases/${base.id}/tables`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        const tableResponse: TableApiResponse = await tableRequest.json();

        tableResponse.tables.forEach(async (table) => {
          // Upsert table
          await ctx.prisma.table.upsert({
            where: {
              id: table.id,
            },
            update: {
              name: table.name,
            },
            create: {
              baseId: base.id,
              id: table.id,
              name: table.name,
            },
          });

          // Upsert views
          table.views.forEach(async (view) => {
            await ctx.prisma.view.upsert({
              where: {
                id: view.id,
              },
              update: {
                name: view.name,
                type: view.type,
              },
              create: {
                id: view.id,
                tableId: table.id,
                name: view.name,
                type: view.type,
              },
            });
          });
        });
      });
    });
  }),
});
