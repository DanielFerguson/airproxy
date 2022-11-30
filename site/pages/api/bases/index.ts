import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const email = session?.user?.email;

  if (!session || !email) {
    res.status(401).json({
      message:
        "You must be signed in to view the protected content on this page.",
    });
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.status(406).json({
      message: "Method not acceptable.",
    });
    return;
  }

  //
  // Get all of the users bases
  //

  if (req.method === "GET") {
    const response = await prisma.base.findMany({
      select: {
        id: true,
        name: true,
        active: true,
        tables: {
          select: {
            id: true,
            name: true,
            views: true,
          },
        },
      },
    });

    res.send({
      bases: response,
    });
  }
};
