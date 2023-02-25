import type { NextApiRequest, NextApiResponse } from "next";

import { pusher } from "@/pages/api/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { socket_id, channel_name, user_name } = req.body;
  const user_id = Math.random().toString(32).slice(2);

  const presenceData = {
    user_id,
    user_name,
  };

  try {
    const auth = pusher.authorizeChannel(socket_id, channel_name, presenceData);
    res.send(auth);
  } catch (e) {
    console.error(e);
  }
}
