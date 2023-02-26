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
  const playerTurn = useMultiplayerStore((state) => state.playerTurn);

  function getText(player: 0 | 1): string | null {
    if (playerNames.length < 2) return null;

    const text = playerNames[player];
    if (text == undefined) return null;

    if (playerTurn === player) return `${text}'s turn`;

    return text;
  }

  return (
    <div className="fixed top-0 left-0 m-3 flex flex-col gap-3">
      <Score balls={SOLID_BALLS} text={getText(0) ?? username} />
      <Score
        balls={STRIPE_BALLS}
        text={getText(1) ?? "Waiting for opponent..."}
      />
    </div>
  );
}
