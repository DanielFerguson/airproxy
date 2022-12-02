import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  const { id } = req.query;

  if (!session || !email) {
    res.status(401).json({
      message:
        "You must be signed in to view the protected content on this page.",
    });
    return;
  }

  if (typeof id !== "string") {
    res.status(400).json({
      message: "The id is malformed.",
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
  // Get the number of requests for this table in the last 24 hours
  //

  if (req.method === "GET") {
    const response = await prisma.$queryRaw`
        SELECT
            COUNT(r.id) AS count
        FROM
            Table AS t
            LEFT JOIN Request AS r ON r.tableId = t.id
                AND r.createdAt > NOW() - INTERVAL 24 HOUR
        WHERE
            t.id = ${id};
    `;

    res.status(200).json(response);
    return;
  }
};
