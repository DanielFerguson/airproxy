import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { Redis } from "@upstash/redis";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  const { id } = req.query;

  if (!session || !email) {
    return res.status(401).json({
      message:
        "You must be signed in to view the protected content on this page.",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "The id is malformed.",
    });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(406).json({
      message: "Method not acceptable.",
    });
  }

  //
  // Get a singular base
  //

  if (req.method === "GET") {
    const response = await prisma.table.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        views: true,
        active: true,
      },
    });

    return res.status(200).json({
      table: response,
    });
  }

  //
  // Parse intended action
  //

  const { action } = JSON.parse(req.body);

  if (
    !action ||
    (action !== "TOGGLE_STATUS" &&
      action !== "UPDATE_TABLE_TTL" &&
      action !== "BUST_TABLE_CACHE")
  ) {
    return res.status(400).json({
      message: "`action` is missing from the request.",
    });
  }

  const redis = Redis.fromEnv();

  //
  // Update a singular base
  //

  if (action === "TOGGLE_STATUS" && req.method === "POST") {
    const { enabled } = JSON.parse(req.body);

    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.table.update({
        where: {
          id,
        },
        data: {
          active: enabled,
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "Status is now active.",
    });
  }

  //
  // Bust a table's cache
  //

  if (action === "BUST_TABLE_CACHE" && req.method === "POST") {
    const keys = await redis.keys(`*:${id}:*`);

    await redis.unlink(...keys);

    return res.status(200).json({
      message: "Cache has been busted.",
    });
  }

  //
  // Update a tables TTL
  //

  if (action === "UPDATE_TABLE_TTL" && req.method === "POST") {
    const { ttl } = JSON.parse(req.body);

    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.table.update({
        where: {
          id,
        },
        data: {
          ttl: parseInt(ttl),
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "Status is now active.",
    });
  }
};
