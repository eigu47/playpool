import React from "react";

import { CuboidCollider } from "@react-three/rapier";
import { useDrag } from "@use-gesture/react";
import { SphereGeometry, Vector3 } from "three";

import Ball from "@/components/canvas/Ball";
import { BALLS, getInitialPositions } from "@/constants/BALLS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const COLOR_BALLS = BALLS.filter(({ id }) => id !== 0);
const ballGeometry = new SphereGeometry(0.026, 16, 16);
const forceVector = new Vector3();

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
  const positions = getInitialPositions();
  const setBallState = useBallsStore((state) => state.setBallStatus);

  const bind = useDrag(({ last, movement }) => {
    if (useMultiplayerStore.getState().isUserTurn() != false) return;
    if (
      useGameStore.getState().gameMode === "shot" &&
      last &&
      movement[1] > 0
    ) {
      const force = Math.min(movement[1] / window.innerHeight, 0.5) / 1800;

      forceVector
        .copy(useGameStore.getState().shotNormal ?? new Vector3())
        .multiplyScalar(force)
        .setY(0);

      useBallsStore.getState().ballsState[0]?.body?.applyImpulse(forceVector);

      handleEndShot && handleEndShot(forceVector);
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
          if (useMultiplayerStore.getState().isUserTurn() != false) return;
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          if (useMultiplayerStore.getState().isUserTurn() != false) return;
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
      <CuboidCollider
        args={[0.7, 0.1, 1.2]}
        position={[0, -0.12, 0]}
        sensor
        name="pocket"
        onIntersectionEnter={(e) => {
          const ballId = e.other.rigidBodyObject?.name;
          if (ballId == undefined) return;

          setBallState("pocket", +ballId as (typeof BALLS)[number]["id"]);
        }}
      />
      <CuboidCollider
        args={[0.7, 0.22, 1.2]}
        position={[0, 0, 0]}
        sensor
        name="out"
        onIntersectionExit={(e) => {
          const ballId = e.other.rigidBodyObject?.name;
          if (ballId == undefined) return;

          setBallState("out", +ballId as (typeof BALLS)[number]["id"]);
        }}
      />
    </>
  );
}
