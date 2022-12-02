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
  // Get requests for all bases
  //

  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const result = await prisma.$queryRaw`
    SELECT
        count(id) AS requests,
        date_format(createdAt, '%Y-%m-%d %H:%i:00') AS time
    FROM
        Request
    WHERE
        baseId = ${id} AND
        createdAt > NOW() - INTERVAL 60 MINUTE
    GROUP BY
        time
    ORDER BY
        time ASC
  `;

  res.status(200).json({
    requests: result,
  });
};
