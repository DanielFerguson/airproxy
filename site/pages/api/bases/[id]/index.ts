import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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
  // Get a singular base
  //

  if (req.method === "GET") {
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

    res.status(200).json(response);
    return;
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
    res.status(400).json({
      message: "`action` is missing from the request.",
    });
    return;
  }

  //
  // Update a singular base
  //

  if (action === "UPDATE_ACTIVE_STATUS" && req.method === "POST") {
    const { active } = JSON.parse(req.body);

    await prisma.base.update({
      where: {
        id,
      },
      data: {
        active,
      },
    });

    res.status(200).json({
      message: "Status is now active.",
    });
  }

  //
  // Disable all tables connected to this table
  //

  if (action === "DISABLE_ALL_TABLES" && req.method === "POST") {
    await prisma.table.updateMany({
      where: {
        baseId: id,
      },
      data: {
        active: false,
      },
    });

    res.status(200).json({
      message: "All tables have been disabled.",
    });
  }

  //
  // Enable all tables connected to this table
  //

  if (action === "ENABLE_ALL_TABLES" && req.method === "POST") {
    await prisma.table.updateMany({
      where: {
        baseId: id,
      },
      data: {
        active: true,
      },
    });

    res.status(200).json({
      message: "All tables have been enabled.",
    });
  }

  //
  // Remove token from base
  //

  if (action === "REMOVE_TOKEN_FROM_BASE" && req.method === "POST") {
    await prisma.base.updateMany({
      where: {
        id,
        email,
      },
      data: {
        apiToken: null,
      },
    });

    res.status(200).json({
      message: "Successfully removed token from base.",
    });
  }

  //
  // Create and attach a token to the base
  //

  if (action === "CREATE_AND_ADD_TOKEN_TO_BASE" && req.method === "POST") {
    await prisma.base.update({
      where: {
        id,
      },
      data: {
        apiToken: uuidv4(),
      },
    });

    res.status(200).json({
      message: "Successfully created and attached API token to base.",
    });
  }
};
