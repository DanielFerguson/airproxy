import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).json({
      message: "Unauthorized.",
    });
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({
      message: "You must be signed in.",
    });
  }

  const email = session?.user?.email;

  if (!email) {
    res.status(500).send({
      message: "Whoops! Something went wrong on our end.",
    });
    return;
  }

  //
  // Get the keys for this user
  //

  if (req.method === "GET") {
    const results = await prisma.base.findMany({
      where: {
        keysEmail: email,
        apiToken: {
          not: null,
        },
      },
      select: {
        id: true,
        apiToken: true,
        name: true,
      },
    });

    res.status(200).json(results);
    return;
  }
};
