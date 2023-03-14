import React from "react";

import { useDrag } from "@use-gesture/react";
import { SphereGeometry, Vector3 } from "three";

import Ball from "@/components/canvas/Ball";
import { BALLS, getInitialPositions } from "@/constants/BALLS";
import { PHYSIC_CONSTANTS } from "@/constants/PHYSICS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const COLOR_BALLS = BALLS.filter(({ id }) => id !== 0);
const ballGeometry = new SphereGeometry(PHYSIC_CONSTANTS.BALL_RADIUS);
const forceVector = new Vector3();
const positions = getInitialPositions();

type Props = {
  handleEndTurn?: () => void;
  handleWakeBall?: (ballId: number) => void;
  handleEndShot?: (forceVector: Vector3) => void;
};

export default function Balls({
  handleEndTurn,
  handleEndShot,
  handleWakeBall,
}: Props) {
  const isUserTurn = useMultiplayerStore((state) => state.isUserTurn);

  const bind = useDrag(({ last, movement }) => {
    if (handleEndShot && !isUserTurn()) return;

    if (
      useGameStore.getState().gameMode === "shot" &&
      last &&
      movement[1] > 0
    ) {
      const force = Math.min(movement[1] / window.innerHeight, 0.5) / 80;

      forceVector
        .copy(useGameStore.getState().shotNormal ?? new Vector3())
        .multiplyScalar(force)
        .setY(0);

      console.log("forceVector", forceVector);

      handleEndShot && handleEndShot(forceVector);
      useBallsStore.getState().ballsBody[0]?.applyImpulse(forceVector, true);
    }
  });

  return (
    <>
      <Ball
        ball={BALLS[0]}
        position={positions[0]}
        ballGeometry={ballGeometry}
        handleEndTurn={handleEndTurn}
        handleWakeBall={handleWakeBall}
        bind={bind}
        onPointerEnter={() => {
          if (handleEndShot && !isUserTurn()) return;

          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          if (handleEndShot && !isUserTurn()) return;

          document.body.style.cursor = "default";
        }}
      />
      {COLOR_BALLS.map((ball) => (
        <Ball
          key={ball.id}
          ball={ball}
          position={positions[ball.id]}
          ballGeometry={ballGeometry}
          handleEndTurn={handleEndTurn}
          handleWakeBall={handleWakeBall}
        />
      ))}
    </>
  );
}
