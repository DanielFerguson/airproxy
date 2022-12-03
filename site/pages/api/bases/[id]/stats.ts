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
  // Get stats for the account
  //

  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const results = await prisma.$queryRaw`
    SELECT
      count(id) as totalRequests,
      COUNT(DISTINCT(latlng)) as customerCount,
	    SUM(size) as totalRequestsSize
    FROM
      Request
    WHERE
      baseId = ${id} AND
      createdAt > NOW() - INTERVAL 30 DAY
  `;

  // @ts-ignore
  const data = results[0];

  res.status(200).json(data);
};
