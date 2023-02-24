import React from "react";

import { CuboidCollider } from "@react-three/rapier";
import { useDrag } from "@use-gesture/react";
import { SphereGeometry, Vector3 } from "three";

import Ball from "@/components/canvas/Ball";
import { BALLS, getInitialPositions } from "@/constants/BALLS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

const COLOR_BALLS = BALLS.filter(({ id }) => id !== 0);
const ballGeometry = new SphereGeometry(0.026, 16, 16);
const forceVector = new Vector3();

export default function Balls() {
  const positions = getInitialPositions();
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setBallState = useBallsStore((state) => state.setBallStatus);

  const bind = useDrag(({ last, movement }) => {
    if (
      useGameStore.getState().gameMode === "shot" &&
      last &&
      movement[1] > 0
    ) {
      const force = Math.min(movement[1] / window.innerHeight, 0.5) / 1500;

      forceVector
        .copy(useGameStore.getState().shotNormal ?? new Vector3())
        .multiplyScalar(force)
        .setY(0);

      useBallsStore.getState().ballsState[0]?.body?.applyImpulse(forceVector);
    }
  });

  return (
    <>
      <Ball
        ball={BALLS[0]}
        position={positions[0]}
        ballGeometry={ballGeometry}
        bind={bind}
        onClick={() => setGameMode("shot")}
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "default")}
      />
      {COLOR_BALLS.map((ball) => (
        <Ball
          ball={ball}
          key={ball.id}
          position={positions[ball.id]}
          ballGeometry={ballGeometry}
          onClick={() => setGameMode("idle")}
          handleEndTurn={() => setGameMode("shot")}
        />
      ))}
      <CuboidCollider
        args={[0.7, 0.1, 1.2]}
        position={[0, -0.12, 0]}
        sensor
        onIntersectionEnter={(e) => {
          const ballId = e.other.rigidBodyObject?.name;
          if (ballId == undefined) return;

          setBallState("pocket", +ballId as (typeof BALLS)[number]["id"]);
        }}
      />
    </>
  );
}
