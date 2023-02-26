import React from "react";

import Score from "@/components/dom/Score";
import { BALLS } from "@/constants/BALLS";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const SOLID_BALLS = [...BALLS.filter(({ type }) => type === "solid"), BALLS[8]];
const STRIPE_BALLS = [
  ...BALLS.filter(({ type }) => type === "stripe"),
  BALLS[8],
];

export default function MultiScore() {
  const playerNames = useMultiplayerStore((state) =>
    state.playersInfo.flatMap(({ username }) => username)
  );
  const username = useMultiplayerStore((state) => state.userInfo?.username);

  return (
    <div className="fixed top-0 left-0 m-3 flex flex-col gap-3">
      <Score balls={SOLID_BALLS} text={playerNames[0] ?? username} />
      <Score
        balls={STRIPE_BALLS}
        text={playerNames[1] ?? "Waiting for opponent..."}
      />
    </div>
  );
}
