import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import type { Vector3 } from "three";

import { env } from "@/env.mjs";

export type ShotInfo = {
  userId: string;
  forceVector?: Vector3;
  positions?: Vector3[];
};

export const pusher = new Pusher({
  appId: env.PUSHER_app_id,
  key: env.PUSHER_key,
  secret: env.PUSHER_secret,
  cluster: env.PUSHER_cluster,
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { forceVector, userId, positions } = req.body;
    if (userId == undefined) return res.status(400);

    if (forceVector)
      await pusher.trigger("presence-channel", "shot", {
        forceVector,
        userId,
      } satisfies ShotInfo);

    if (positions) {
      await pusher.trigger("presence-channel", "end-turn", {
        positions,
        userId,
      } satisfies ShotInfo);
    }

    res.status(200).send("OK");
  } catch (e) {
    console.error(e);
  }
}
