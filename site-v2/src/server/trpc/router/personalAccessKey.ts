import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import type { BaseApiResponse, TableApiResponse } from "../../../types/custom";
import { PersonalAccessToken } from "@prisma/client";

export const personalAccessKeyRouter = router({
  add: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Attempt to fetch the bases from Airtable
      const response = await fetch("https://api.airtable.com/v0/meta/bases", {
        headers: {
          Authorization: `Bearer ${input.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      // Save the key to the database
      let personalAccessToken: PersonalAccessToken;

      try {
        personalAccessToken = await ctx.prisma.personalAccessToken.create({
          data: {
            token: input.token,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        throw new Error("Token already exists");
      }

      const data: BaseApiResponse = await response.json();

      data.bases.forEach(async (base) => {
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
            personalAccessTokenId: personalAccessToken.id,
            userId: ctx.session.user.id,
          },
        });

        // Fetch the tables attached to this base
        const tableRequest = await fetch(
          `https://api.airtable.com/v0/meta/bases/${base.id}/tables`,
          {
            headers: {
              Authorization: `Bearer ${input.token}`,
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

        return {
          id: base.id,
          name: base.name,
          active: true,
          personalAccessTokenId: personalAccessToken.id,
          userId: ctx.session.user.id,
        };
      });

      return true;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.personalAccessToken.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete all views associated with this token
      await ctx.prisma.view.deleteMany({
        where: {
          table: {
            base: {
              personalAccessTokenId: input.id,
            },
          },
        },
      });

      // Delete all tables associated with this token
      await ctx.prisma.table.deleteMany({
        where: {
          base: {
            personalAccessTokenId: input.id,
          },
        },
      });

      // Delete all bases associated with this token
      await ctx.prisma.base.deleteMany({
        where: {
          personalAccessTokenId: input.id,
        },
      });

      await ctx.prisma.personalAccessToken.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
});
