import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET" && req.method !== "PUT") {
    res.status(405).json({
      message: "Unauthorized.",
    });
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  const email = session?.user?.email;

  console.log(session);

  if (!email) {
    res.status(500).send({
      message: "Whoops! Something went wrong on our end.",
    });
    return;
  }

  //
  // Retrieve the UserPreferences for the is user, and create one if
  // it doesn't alredy exist
  //

  if (req.method === "GET") {
    const preferences = await prisma.userPreferences.upsert({
      where: {
        email,
      },
      update: {},
      create: {
        email,
        prefersDarkMode: false,
      },
    });

    res.status(200).json(preferences);
  }

  //
  // Update the UserPreferences
  //

  if (req.method === "PUT") {
    const { prefersDarkMode } = JSON.parse(req.body);

    if (!prefersDarkMode) {
      res
        .status(400)
        .json({ message: "`prefersDarkMode` is a required fields." });
    }

    await prisma.userPreferences.update({
      where: {
        email,
      },
      data: {
        prefersDarkMode,
      },
    });

    res.status(200).json({
      message: "Successfully updated your preferences.",
    });
  }
};
