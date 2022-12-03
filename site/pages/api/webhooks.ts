import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";

const endpointSecret =
  "whsec_550e4316e36068a6e59914e968330abeedff9189f77b42c2e2201972b4dac673";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const requestBuffer = await buffer(req);
    const signature = req.headers["stripe-signature"] as string;

    const stripe = new Stripe(
      "sk_test_51MA6dTG5EtvPzQrOq0KcsxJixTL5qsDM7w1tjN04gAdyKOevAJlSOBmmL8I7NdE8nvCR6mowSZmENC9vvO7jXUeD008QfzHTHJ",
      { apiVersion: "2022-11-15" }
    );

    const event = stripe.webhooks.constructEvent(
      requestBuffer.toString(),
      signature,
      endpointSecret
    );

    // Extract the object from the event.
    const data = event.data;
    const eventType = event.type;

    switch (eventType) {
      case "checkout.session.completed":
        // TODO
        console.log(eventType, data);
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
        break;
      case "invoice.paid":
        // TODO
        console.log(eventType, data);
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break;
      case "invoice.payment_failed":
        // TODO
        console.log(eventType, data);
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break;
      default:
      // Unhandled event type
    }

    // you can now safely work with the request. The event returned is the parsed request body.
    res.send(200);
  } catch (error) {
    // @ts-ignore
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};
