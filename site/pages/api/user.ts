import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
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
  // Delete the user, anonymizing their request data
  //

  if (req.method === "DELETE") {
    // Delete the users preferences
    await prisma.userPreferences.delete({
      where: {
        email: email,
      },
    });

    // Delete the user's API token
    await prisma.keys.delete({
      where: {
        email: email,
      },
    });

    // Get a list of the users bases
    const bases = await prisma.base.findMany({
      where: {
        keysEmail: email,
      },
      select: {
        id: true,
      },
    });

    // Get a list of the users tables for each base
    const tables = await Promise.all(
      bases.map(async (base) => {
        return await prisma.table.findMany({
          where: {
            baseId: base.id,
          },
          select: {
            id: true,
          },
        });
      })
    );

    // Anonymize the user's request for each base
    await Promise.all(
      bases.map(async (base) => {
        return await prisma.request.updateMany({
          where: {
            baseId: base.id,
          },
          data: {
            baseId: "",
            tableId: "",
          },
        });
      })
    );

    // TODO: Unsubscribe the user from Stripe

    // Delete the user's views for each table
    await Promise.all(
      tables.map(async (table) => {
        return await Promise.all(
          table.map(async (table) => {
            return await prisma.view.deleteMany({
              where: {
                tableId: table.id,
              },
            });
          })
        );
      })
    );

    // Delete the users tables
    await Promise.all(
      bases.map(async (base) => {
        return await prisma.table.deleteMany({
          where: {
            baseId: base.id,
          },
        });
      })
    );

    // Delete the users bases
    await prisma.base.deleteMany({
      where: {
        keysEmail: email,
      },
    });
  }
};
