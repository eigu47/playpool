import type { NextApiRequest, NextApiResponse } from "next";

import { pusher } from "@/pages/api/pusher";

type Users = {
  users: { id: string }[];
};

export type Member = {
  id: string;
  info: {
    username: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { socket_id, channel_name, username } = req.body;
  const user_id = Math.random().toString(32).slice(2);

  const presenceData = {
    user_id,
    user_info: {
      username,
    },
  };

  try {
    const auth = pusher.authorizeChannel(socket_id, channel_name, presenceData);
    res.send(auth);

    const users = (await (
      await pusher.get({
        path: "/channels/presence-channel/users",
      })
    ).json()) as Users;

    if (users.users.length === 2) {
      pusher.trigger("presence-channel", "players-ready", users.users);
    }
  } catch (e) {
    console.error(e);
  }
}
