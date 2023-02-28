import { useEffect, useMemo, useRef } from "react";

import Pusher, { type Members } from "pusher-js";

import { env } from "@/env.mjs";
import type { GameData, Member } from "@/pages/api/pusher/auth";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

type Props = {
  username: string;
};

export default function Channel({ username }: Props) {
  const addPlayer = useMultiplayerStore((store) => store.addPlayer);
  const setUserInfo = useMultiplayerStore((store) => store.setUserInfo);
  const setTurn = useMultiplayerStore((store) => store.setTurn);
  const setGameMode = useGameStore((store) => store.setGameMode);
  const setResetCamera = useGameStore((store) => store.setResetCamera);
  const resetPositions = useBallsStore((store) => store.resetPositions);

  const membersRef = useRef<{ id: string; username: string }[]>([]);

  const pusher = useMemo(
    () =>
      new Pusher(env.NEXT_PUBLIC_PUSHER_key, {
        cluster: env.NEXT_PUBLIC_PUSHER_cluster,
        authEndpoint: "/api/pusher/auth",
        auth: {
          params: { username },
        },
      }),
    [username]
  );

  useEffect(() => {
    const cacheChannel = pusher.subscribe("presence-cache-channel");

    cacheChannel.bind("pusher:subscription_succeeded", (members: Members) => {
      members.each((member: Member) => {
        membersRef.current.push({
          id: member.id,
          username: member.info.username,
        });
      });

      setUserInfo({ id: members.me.id, username: members.me.info.username });
    });

    cacheChannel.bind("pusher:member_added", (member: Member) => {
      membersRef.current.push({
        id: member.id,
        username: member.info.username,
      });
    });

    cacheChannel.bind("game-data", ({ players, positions }: GameData) => {
      console.log(players, positions);
      if (players == null || positions == null) return;

      players.forEach(({ id }) => {
        const user = membersRef.current.find((user) => user.id === id);
        if (user) {
          addPlayer(user);
        }
      });

      resetPositions(positions);

      setTurn(0);
      setResetCamera(true);

      setGameMode("idle", true);
    });

    // cacheChannel.bind("pusher:member_removed", (member: Member) => {
    //   //
    // });

    return () => {
      pusher.unsubscribe("presence-cache-channel");
    };
  }, [pusher]);

  return null;
}
