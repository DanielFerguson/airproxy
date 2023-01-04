import { format } from "date-fns";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

interface RequestOverview {
  utc: string;
  requests: number;
}

const generateTimestamps = () => {
  const timestamps = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 60000);
    timestamps.push(date.toISOString().slice(0, 16).replace("T", " "));
  }

  return timestamps;
};

export const requestRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const timestamps = generateTimestamps();

    const result: RequestOverview[] = await ctx.prisma.$queryRaw`
        SELECT
            date_format(createdAt, '%Y-%m-%d %H:%i') as utc,
            count(id) as requests
        FROM
            Request
        WHERE
            baseId IN(
                SELECT
                    id FROM Base
                WHERE
                    userId = ${ctx.session.user.id}
            ) AND
            createdAt > NOW() - INTERVAL 30 MINUTE
        GROUP BY utc
        ORDER BY utc ASC;
  `;

    const joined = timestamps
      .map((timestamp) => {
        const request = result.find((r) => r.utc === timestamp);

        return {
          Date: format(new Date(timestamp), "dd/MM HH:mm"),
          Requests: request ? Number(request.requests) : 0,
        };
      })
      .reverse();

    return joined;
  }),
  get: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const timestamps = generateTimestamps();

      const result: RequestOverview[] = await ctx.prisma.$queryRaw`
        SELECT
            date_format(createdAt, '%Y-%m-%d %H:%i') as utc,
            count(id) as requests
        FROM
            Request
        WHERE
            baseId = ${input.baseId} AND
            createdAt > NOW() - INTERVAL 60 MINUTE
        GROUP BY utc
        ORDER BY utc ASC;
  `;

      const joined = timestamps
        .map((timestamp) => {
          const request = result.find((r) => r.utc === timestamp);

          return {
            Date: timestamp,
            Requests: request ? Number(request.requests) : 0,
          };
        })
        .reverse();

      return joined;
    }),
});
