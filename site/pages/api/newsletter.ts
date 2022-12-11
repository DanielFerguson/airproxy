// create an api endpoint to handle the newsletter subscription, and post it to a custom api
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const response = await fetch("https://app.loops.so/api/v1/contacts/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 5bb01681c85e3bf7d2f5c47f9daa998d",
    },
    body: JSON.stringify({
      email: email,
      userGroup: "airproxy",
      source: "Airproxy Newsletter",
      airproxy: true,
    }),
  });

  return res.status(200).json(response);
};
