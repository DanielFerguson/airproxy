import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

interface RequestOverview {
  requests: number;
  time: string;
}

export const requestRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result: RequestOverview[] = await ctx.prisma.$queryRaw`
        SELECT
            count(id) as requests,
            date_format(createdAt, '%Y-%m-%d %H:%i:00') as time
        FROM
            Request
        WHERE
            baseId IN(
                SELECT
                    id FROM Base
                WHERE
                    userId = ${ctx.session.user.id}
            ) AND
            createdAt > NOW() - INTERVAL 60 MINUTE
        GROUP BY time
        ORDER BY time ASC;
  `;

    return result;
  }),
});
