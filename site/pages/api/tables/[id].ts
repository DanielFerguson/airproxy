import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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

    res.status(200).json({
      table: response,
    });
    return;
  }

  //
  // Parse intended action
  //

  const { action } = JSON.parse(req.body);

  if (!action || action !== "TOGGLE_STATUS") {
    res.status(400).json({
      message: "`action` is missing from the request.",
    });
    return;
  }

  //
  // Update a singular base
  //

  if (action === "TOGGLE_STATUS" && req.method === "POST") {
    const { enabled } = JSON.parse(req.body);

    await prisma.table.update({
      where: {
        id,
      },
      data: {
        active: enabled,
      },
    });

    res.status(200).json({
      message: "Status is now active.",
    });
  }
};
