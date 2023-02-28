import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

import { env } from "@/env.mjs";

export const pusher = new Pusher({
  appId: env.PUSHER_app_id,
  key: env.PUSHER_key,
  secret: env.PUSHER_secret,
  cluster: env.PUSHER_cluster,
  useTLS: true,
});

// export const pusher = new Pusher({
//   appId: process.env.PUSHER_app_id!,
//   key: process.env.PUSHER_key!,
//   secret: process.env.PUSHER_secret!,
//   cluster: process.env.PUSHER_cluster!,
//   useTLS: true,
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, username } = req.body;

  await pusher.trigger("presence-cache-channel", "message", {
    message,
    username,
  } as Message);

  res.status(200);
}

export type Message = {
  message: string;
  username: string;
};
