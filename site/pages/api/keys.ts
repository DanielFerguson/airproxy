import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

interface View {
  id: string;
  name: string;
  type: string;
}

interface Table {
  id: string;
  name: string;
  views: View[];
}

interface Base {
  id: string;
  name: string;
}

interface BaseApiResponse {
  bases: Base[];
}

interface TableApiResponse {
  tables: Table[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
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
  // Get the key from the request
  //

  const body = JSON.parse(req.body);

  if (!body.key) {
    res.status(400).json({
      message: "Missing `key` variable",
    });
    return;
  }

  const token = body.key;

  //
  // Fetch the bases
  //

  const baseRequest = await fetch("https://api.airtable.com/v0/meta/bases", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!baseRequest.ok) {
    res.status(500).send({
      message: "Whoops! Something went wrong on our end.",
    });
    return;
  }

  //
  // Verified the key, save it to the database
  //

  // TODO: Remove verified_at, useless now
  await prisma.keys.upsert({
    update: {
      token: body.key,
    },
    where: {
      email: email,
    },
    create: {
      email,
      token,
    },
  });

  //
  // Save the bases to the database
  //

  const baseResponse: BaseApiResponse = await baseRequest.json();

  baseResponse.bases.forEach(async (base) => {
    await prisma.base.upsert({
      where: {
        id: base.id,
      },
      update: {
        name: base.name,
      },
      create: {
        email,
        keysEmail: email,
        id: base.id,
        name: base.name,
      },
    });
  });

  //
  // Fetch the tables and views, save them to the database
  //

  // TODO Optimise into batches of requests (remember Airtables rate-limit)
  baseResponse.bases.forEach(async (base) => {
    const tableRequest = await fetch(
      `https://api.airtable.com/v0/meta/bases/${base.id}/tables`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tableResponse: TableApiResponse = await tableRequest.json();

    tableResponse.tables.forEach(async (table) => {
      await prisma.table.upsert({
        where: {
          id: table.id,
        },
        update: {
          name: table.name,
        },
        create: {
          baseId: base.id,
          id: table.id,
          name: table.name,
        },
      });

      // TODO: Optimise this atrocity
      table.views.forEach(async (view) => {
        await prisma.view.upsert({
          where: {
            id: view.id,
          },
          update: {
            name: view.name,
            type: view.type,
          },
          create: {
            id: view.id,
            tableId: table.id,
            name: view.name,
            type: view.type,
          },
        });
      });
    });
  });

  //
  // Great success! (~in the voice of Borat~)
  //

  res.status(200).json({
    message: "Success!",
  });
};
