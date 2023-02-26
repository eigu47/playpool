import { useEffect, useRef } from "react";

import Pusher, { type Members } from "pusher-js";

import { env } from "@/env.mjs";
import type { Member } from "@/pages/api/pusher/auth";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

type Props = {
  username: string;
};

export default function MultiplayerChannel({ username }: Props) {
  const gameMode = useGameStore((store) => store.gameMode);
  const setPusher = useMultiplayerStore((store) => store.setPusher);
  const addPlayer = useMultiplayerStore((store) => store.addPlayer);
  const setUserInfo = useMultiplayerStore((store) => store.setUserInfo);

  const membersRef = useRef<{ id: string; username: string }[]>([]);

  const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_key, {
    cluster: env.NEXT_PUBLIC_PUSHER_cluster,
    authEndpoint: "/api/pusher/auth",
    auth: {
      params: { username },
    },
  });

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      const channel = pusher.subscribe("presence-channel");

      channel.bind("pusher:subscription_succeeded", (members: Members) => {
        members.each((member: Member) => {
          membersRef.current.push({
            id: member.id,
            username: member.info.username,
          });
        });

        setUserInfo({ id: members.me.id, username: members.me.info.username });
      });

      channel.bind("pusher:member_added", (member: Member) => {
        membersRef.current.push({
          id: member.id,
          username: member.info.username,
        });
      });

      channel.bind("pusher:member_removed", (member: Member) => {
        //
      });

      channel.bind("players-ready", (users: { id: string }[]) => {
        if (gameMode !== "waiting") return;

        users.forEach(({ id }) => {
          const user = membersRef.current.find((user) => user.id === id);
          if (user) {
            addPlayer(user);
          }
        });

        setPusher(pusher);
      });
    }

    return () => {
      pusher.unsubscribe("presence-channel");
      subscribe = false;
    };
  }, []);

  return null;
}
