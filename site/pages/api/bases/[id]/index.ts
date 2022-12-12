import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

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
    // @ts-ignore
    const response = await prisma.base.findFirstOrThrow({
      where: {
        id,
        email,
      },
      select: {
        id: true,
        name: true,
        active: true,
        apiToken: true,
        tables: {
          select: {
            id: true,
            name: true,
            views: true,
            active: true,
            ttl: true,
          },
        },
      },
    });

    return res.status(200).json(response);
  }

  //
  // Parse intended action
  //

  const { action } = JSON.parse(req.body);

  if (
    !action ||
    (action !== "UPDATE_ACTIVE_STATUS" &&
      action !== "DISABLE_ALL_TABLES" &&
      action !== "ENABLE_ALL_TABLES" &&
      action !== "REMOVE_TOKEN_FROM_BASE" &&
      action !== "CREATE_AND_ADD_TOKEN_TO_BASE")
  ) {
    return res.status(400).json({
      message: "`action` is missing from the request.",
    });
  }

  const redis = Redis.fromEnv();

  //
  // Update a singular base
  //

  if (action === "UPDATE_ACTIVE_STATUS" && req.method === "POST") {
    const { active } = JSON.parse(req.body);

    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.base.update({
        where: {
          id,
        },
        data: {
          active,
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "Status is now active.",
    });
  }

  //
  // Disable all tables connected to this table
  //

  if (action === "DISABLE_ALL_TABLES" && req.method === "POST") {
    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.table.updateMany({
        where: {
          baseId: id,
        },
        data: {
          active: false,
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "All tables have been disabled.",
    });
  }

  //
  // Enable all tables connected to this table
  //

  if (action === "ENABLE_ALL_TABLES" && req.method === "POST") {
    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.table.updateMany({
        where: {
          baseId: id,
        },
        data: {
          active: true,
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "All tables have been enabled.",
    });
  }

  //
  // Remove token from base
  //

  if (action === "REMOVE_TOKEN_FROM_BASE" && req.method === "POST") {
    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.base.updateMany({
        where: {
          id,
          email,
        },
        data: {
          apiToken: null,
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "Successfully removed token from base.",
    });
  }

  //
  // Create and attach a token to the base
  //

  if (action === "CREATE_AND_ADD_TOKEN_TO_BASE" && req.method === "POST") {
    const keys = await redis.keys(`*:${id}:*`);

    await Promise.all([
      prisma.base.update({
        where: {
          id,
        },
        data: {
          apiToken: uuidv4(),
        },
      }),
      redis.unlink(...keys),
    ]);

    return res.status(200).json({
      message: "Successfully created and attached API token to base.",
    });
  }
};
