import { useEffect, useRef } from "react";

import Pusher, { type Members } from "pusher-js";
import type { Vector3 } from "three";

import { env } from "@/env.mjs";
import type { ShotInfo } from "@/pages/api/pusher";
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

  const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_key, {
    cluster: env.NEXT_PUBLIC_PUSHER_cluster,
    authEndpoint: "/api/pusher/auth",
    auth: {
      params: { username },
    },
  });

  useEffect(() => {
    const cacheChannel = pusher.subscribe("presence-cache-channel");
    const messageChannel = pusher.subscribe("presence-channel");

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

    cacheChannel.bind("pusher:member_removed", (member: Member) => {
      console.log("member_removed", member);
    });

    cacheChannel.bind("game-data", ({ players, positions }: GameData) => {
      if (players == null || positions == null) return;

      // User is already playing
      if (useMultiplayerStore.getState().userInfo?.isPlaying === true) {
        //
        return;
      }

      // Game is not started
      if (useMultiplayerStore.getState().playerTurn == null) {
        players.forEach(({ id }) => {
          const user = membersRef.current.find((user) => user.id === id);
          if (user) {
            addPlayer(user.id, user.username);

            if (user.id === useMultiplayerStore.getState().userInfo?.id) {
              setUserInfo({ isPlaying: true });
            }
          }
        });

        setTurn(0);
        resetPositions(positions);
        setGameMode("idle", true);
        setResetCamera(true);
      }
    });

    messageChannel.bind(
      "shot",
      ({ forceVector, userId }: { forceVector: Vector3; userId: string }) => {
        if (useMultiplayerStore.getState().isUserTurn() === true) return;

        useBallsStore.getState().ballsState[0]?.body?.applyImpulse(forceVector);
      }
    );

    messageChannel.bind("end-turn", ({ positions, userId }: ShotInfo) => {
      if (useMultiplayerStore.getState().isUserTurn() === false) {
        useBallsStore.getState().resetPositions(positions);
      }

      useMultiplayerStore.getState().setTurn("swap");
    });

    return () => {
      pusher.unsubscribe("presence-cache-channel");
      pusher.unsubscribe("presence-channel");
    };
  }, []);

  return null;
}
