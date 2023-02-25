import React from "react";

import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types";
import type { Vector3 } from "three";
import { type SphereGeometry, type Mesh } from "three";

import type { BALLS } from "@/constants/BALLS";
import { PHYSIC_CONSTANTS } from "@/constants/PHYSICS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

type Props = {
  ball: (typeof BALLS)[number];
  ballGeometry: SphereGeometry;
  position: Vector3 | undefined;
  bind?: () => ReactDOMAttributes;
  onClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  handleEndTurn?: () => void;
  handleWakeBall?: (ballId: number) => void;
};

export default function Ball({
  ball: { id: ballId },
  ballGeometry,
  position,
  bind,
  onClick,
  onPointerEnter,
  onPointerLeave,
  handleEndTurn,
  handleWakeBall,
}: Props) {
  const ballTexture = useTexture(`/balls/${ballId}.jpg`);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);
  const setBallState = useBallsStore((state) => state.setBallStatus);
  const addBall = useBallsStore((state) => state.addBall);

  return (
    <>
      <RigidBody
        ref={(ref) => addBall("body", ref, ballId)}
        name={ballId.toString()}
        key={ballId}
        colliders="ball"
        friction={PHYSIC_CONSTANTS.BALL_FRICTION}
        restitution={PHYSIC_CONSTANTS.BALL_RESTITUTION}
        angularDamping={PHYSIC_CONSTANTS.DAMPING}
        position={position}
        rotation={[
          Math.PI * Math.random() * 2,
          Math.PI * Math.random() * 2,
          Math.PI * Math.random() * 2,
        ]}
        onSleep={() => {
          setBallState("sleep", ballId);

          if (
            useBallsStore
              .getState()
              .ballsState.some(({ status }) => status === "wake") === false
          ) {
            setGameMode("idle");

            handleEndTurn && handleEndTurn();
          }
        }}
        onWake={() => {
          handleWakeBall && handleWakeBall(ballId);
          setBallState("wake", ballId);
          setGameMode("moving");
        }}
      >
        <mesh
          ref={(ref) => addBall("mesh", ref, ballId)}
          name={ballId.toString()}
          key={ballId}
          geometry={ballGeometry}
          {...(bind && (bind() as Mesh))}
          onClick={() => {
            setSelectedBall(ballId);
            onClick && onClick();
          }}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <meshStandardMaterial map={ballTexture} />
        </mesh>
      </RigidBody>
    </>
  );
}
