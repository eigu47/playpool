import React from "react";

import type { BALLS } from "@/constants/BALLS";
import { type BallState, useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

type Props = {
  showBalls: (typeof BALLS)[number][];
  text?: string;
};

export default function Score({ showBalls, text }: Props) {
  const ballsState = useBallsStore((state) => state.ballsState);
  const gameMode = useGameStore((state) => state.gameMode);

  return (
    <>
      {gameMode !== "menu" && (
        <>
          <div className="flex gap-3 text-white">
            <div className="flex select-none gap-1 rounded-xl p-1 text-center text-xs font-bold leading-[18px] ring-1 ring-cyan-500">
              {showBalls.map((ball) => (
                <BallIcon
                  key={ball.id}
                  ball={ball}
                  status={ballsState[ball.id]?.status}
                />
              ))}
            </div>
            <p>{text}</p>
          </div>
        </>
      )}
    </>
  );
}

type BallProps = {
  ball: (typeof BALLS)[number];
  status?: BallState["status"];
};

function BallIcon({ ball: { id, color, type }, status }: BallProps) {
  return (
    <>
      <div
        className="relative h-5 w-5 rounded-full"
        style={{
          background: type === "stripe" ? "#faf3eb" : color,
          color: id === 1 || id === 9 ? "black" : "white",
        }}
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
      </div>
    </>
  );
}
