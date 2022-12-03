import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import Stripe from "stripe";

const stripe = require("stripe")(
  "sk_test_51MA6dTG5EtvPzQrOq0KcsxJixTL5qsDM7w1tjN04gAdyKOevAJlSOBmmL8I7NdE8nvCR6mowSZmENC9vvO7jXUeD008QfzHTHJ"
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({
      message: "You must be signed in.",
    });
  }

  const email = session?.user?.email;

  if (!email || !session) {
    res.redirect(303, `${req.headers.origin}/api/auth/signin`);
    return;
  }

  const { priceId } = req.body;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: "https://airproxy.app/app?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://airproxy.app/app?session_id={CHECKOUT_SESSION_ID}",
  };

  const checkoutSession: Stripe.Checkout.Session =
    // @ts-ignore
    await stripe.checkout.sessions.create(params);

  // @ts-ignore
  res.redirect(303, checkoutSession.url);
};
