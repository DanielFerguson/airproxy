import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const newsletterRouter = router({
  register: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await fetch("https://app.loops.so/api/v1/contacts/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          email: input.email,
          userGroup: "airproxy",
          source: "Airproxy Newsletter",
          airproxy: true,
        }),
      });
    }),
});
