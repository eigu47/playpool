import React from "react";

import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types";
import type { Vector3 } from "three";
import type { SphereGeometry, Mesh } from "three";

import type { BALLS } from "@/constants/BALLS";
import { PHYSIC_CONSTANTS } from "@/constants/PHYSICS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

type Props = {
  ball: typeof BALLS[number];
  ballGeometry: SphereGeometry;
  position: Vector3 | undefined;
  bind?: () => ReactDOMAttributes;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  handleEndTurn?: () => void;
  handleWakeBall?: (ballId: number) => void;
};

export default function Ball({
  ball: { id },
  ballGeometry,
  position,
  bind,
  onPointerEnter,
  onPointerLeave,
  handleEndTurn,
  handleWakeBall,
}: Props) {
  const ballTexture = useTexture(`/balls/${id}.jpg`);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);
  const addBody = useBallsStore((state) => state.addBallBody);

  return (
    <RigidBody
      ref={(ref) => addBody(ref, id)}
      userData={{ id, status: "play" }}
      name={`body-${id}`}
      colliders="ball"
      friction={PHYSIC_CONSTANTS.BALL_FRICTION}
      restitution={PHYSIC_CONSTANTS.BALL_RESTITUTION}
      linearDamping={PHYSIC_CONSTANTS.LINEAR_DAMPING}
      angularDamping={PHYSIC_CONSTANTS.ANGULAR_DAMPING}
      position={position}
      rotation={[
        Math.PI * Math.random() * 2,
        Math.PI * Math.random() * 2,
        Math.PI * Math.random() * 2,
      ]}
      onSleep={() => {
        if (
          useGameStore.getState().gameMode === "moving" &&
          useBallsStore
            .getState()
            .ballsBody.every(
              (ball) => ball?.isSleeping() || ball?.userData.status !== "play"
            )
        ) {
          setGameMode("idle");
          handleEndTurn && handleEndTurn();
        }
      }}
      onWake={() => {
        if (
          useBallsStore.getState().ballsBody[id]?.userData.status === "play"
        ) {
          setGameMode("moving");
          handleWakeBall && handleWakeBall(id);
        }
      }}
    >
      <mesh
        name={`mesh-${id}`}
        geometry={ballGeometry}
        {...(bind && (bind() as Mesh))}
        onClick={() => setSelectedBall(id, true)}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <meshStandardMaterial map={ballTexture} />
      </mesh>
    </RigidBody>
  );
}
