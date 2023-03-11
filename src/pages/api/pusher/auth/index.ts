import type { NextApiRequest, NextApiResponse } from "next";
import type { Vector3 } from "three";

import { getInitialPositions } from "@/constants/BALLS";
import { pusher } from "@/pages/api/pusher";
import type { PlayerBallType } from "@/utils/multiplayerStore";

type Users = { users: { id: string }[] };
export type Member = {
  id: string;
  info: {
    username: string;
  };
};
export type CacheChannelInfo = {
  occupied: boolean;
  cache?: {
    data?: GameData;
    ttl?: number;
  };
};
export type GameData = {
  players:
    | { id: string; connected: boolean; ballType: PlayerBallType }[]
    | null;
  positions: Vector3[] | null;
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

    // const cacheChannel: CacheChannelInfo = await (
    //   await pusher.get({
    //     path: "/channels/presence-cache-channel",
    //     params: {
    //       info: "cache",
    //     },
    //   })
    // ).json();
    // if (cacheChannel?.cache?.data?.players?.length === 2) return;

    const users: Users = await (
      await pusher.get({
        path: "/channels/presence-cache-channel/users",
      })
    ).json();

    const user0Id = users?.users[0]?.id;
    const user1Id = users?.users[1]?.id;

    if (users.users.length === 2 && user0Id && user1Id) {
      pusher.trigger("presence-cache-channel", "game-data", {
        players: [
          { id: user0Id, connected: true, ballType: null },
          { id: user1Id, connected: true, ballType: null },
        ],
        positions: getInitialPositions(),
      } satisfies GameData);
    }

    pusher.trigger("precense-cache-channel", "game-data", {
      players: null,
      positions: null,
    } satisfies GameData);
  } catch (e) {
    console.error(e);
  }
}
