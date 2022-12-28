import { router } from "../trpc";
import { authRouter } from "./auth";
import { baseRouter } from "./base";
import { newsletterRouter } from "./newsletter";
import { personalAccessKeyRouter } from "./personalAccessKey";
import { requestRouter } from "./request";
import { statRouter } from "./stat";
import { tableRouter } from "./table";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  base: baseRouter,
  personalAccessToken: personalAccessKeyRouter,
  stat: statRouter,
  table: tableRouter,
  request: requestRouter,
  newsletter: newsletterRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
