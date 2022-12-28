import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

interface Stats {
  totalRequests: number;
  uniqueUsersCount: number;
}

export const statRouter = router({
  overall: protectedProcedure.query(async ({ ctx }) => {
    const data: Stats[] = (await ctx.prisma.$queryRaw`
        SELECT
            count(id) as totalRequests,
            COUNT(DISTINCT(latlng)) as uniqueUsersCount
        FROM
            Request
        WHERE
            baseId IN(
                SELECT
                    id FROM Base
                WHERE
                    userId = ${ctx.session.user.id}) AND
            createdAt > NOW() - INTERVAL 30 DAY
    `) as Stats[];

    if (data.length === 0) {
      return {
        totalRequests: 0,
        uniqueUsersCount: 0,
      };
    }

    return data[0];
  }),
  statsPerBase: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data: Stats[] = await ctx.prisma.$queryRaw`
        SELECT
            count(id) as totalRequests,
            COUNT(DISTINCT(latlng)) as uniqueUsersCount
        FROM
            Request
        WHERE
            baseId = ${input.baseId} AND
            createdAt > NOW() - INTERVAL 30 DAY
        GROUP BY baseId
  `;

      return data[0];
    }),
});
