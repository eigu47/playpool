import React from "react";

import type { BALLS } from "@/constants/BALLS";
import { type BallState, useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

type Props = {
  balls: (typeof BALLS)[number][];
  text?: string;
  show?: boolean;
};

export default function Score({ balls, text, show = false }: Props) {
  const ballsState = useBallsStore((state) =>
    state.ballsState.flatMap(({ status }) => status)
  );
  const gameMode = useGameStore((state) => state.gameMode);

  return (
    <>
      {(gameMode !== "menu" || show) && (
        <div className="flex gap-3 text-white">
          <div className="grid select-none grid-cols-8 gap-1 rounded-xl p-1 text-center text-xs font-bold leading-[18px] ring-1 ring-cyan-500 sm:grid-flow-col">
            {balls.map((ball) => (
              <BallIcon
                key={ball.id}
                ball={ball}
                status={ballsState[ball.id]}
              />
            ))}
          </div>
          <p>{text}</p>
        </div>
      )}
    </>
  );
}

type BallProps = {
  ball: (typeof BALLS)[number];
  status?: BallState["status"];
};

function BallIcon({ ball: { id, color, type }, status }: BallProps) {
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);

  return (
    <button
      className="relative h-5 w-5 rounded-full"
      style={{
        background: type === "stripe" ? "#faf3eb" : color,
        color: id === 1 || id === 9 ? "black" : "white",
      }}
      onClick={() => {
        setSelectedBall(id);
        if (gameMode === "shot") setGameMode("idle");
      }}
      disabled={status === "pocket"}
    >
      {type === "stripe" && (
        <div
          className="absolute top-0 h-5 w-5 rounded-full"
          style={{
            background: color,
            clipPath: "inset(18% 0 18% 0)",
          }}
        >
          {id}
        </div>
      )}
      {type !== "stripe" && id}
      {status !== "pocket" && (
        <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-black opacity-80" />
      )}
    </button>
  );
}
