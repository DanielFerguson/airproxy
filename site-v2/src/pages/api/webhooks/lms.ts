import { PrismaClient } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";

export interface WebhookRequest {
  data: Data;
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  order_id: number;
  status: string;
  renews_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
}

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { data }: WebhookRequest = body;

  // Check that the user-agent is LemonSqueezy-Hookshot
  if (req.headers["user-agent"] !== "LemonSqueezy-Hookshot") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.attributes.user_email,
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        email: data.attributes.user_email,
        name: data.attributes.user_name,
      },
    });
  }

  await prisma.subscription.upsert({
    where: {
      orderId: data.attributes.order_id,
    },
    update: {
      status: data.attributes.status,
      renewsAt: new Date(data.attributes.renews_at),
      endsAt: new Date(data.attributes.ends_at),
      updatedAt: new Date(data.attributes.updated_at),
    },
    create: {
      orderId: data.attributes.order_id,
      status: data.attributes.status,
      renewsAt: new Date(data.attributes.renews_at),
      endsAt: new Date(data.attributes.ends_at),
      createdAt: new Date(data.attributes.created_at),
      updatedAt: new Date(data.attributes.updated_at),
      user: {
        connect: {
          email: data.attributes.user_email,
        },
      },
    },
  });

  res.status(200).json({ received: true });
};

export default handler;
