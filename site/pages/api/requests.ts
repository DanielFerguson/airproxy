import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
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
  // Get requests for all bases
  //

  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const result = await prisma.$queryRaw`
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
          email = ${email}) AND
    	createdAt > NOW() - INTERVAL 60 MINUTE
    GROUP BY time
    ORDER BY time ASC;
  `;

  res.status(200).json({
    requests: result,
  });
};
