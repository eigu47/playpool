import React, { useRef } from "react";

import { useTexture } from "@react-three/drei";
import { type RigidBodyApi, RigidBody } from "@react-three/rapier";
import type { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types";
import { type Vector3, type SphereGeometry, type Mesh } from "three";

import type { BALLS } from "@/constants/BALLS";
import { PHYSIC_CONSTANTS } from "@/constants/PHYSICS";
import {
  type BallStates,
  type MeshGeometry,
  useBallsStore,
} from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

type Props = {
  ball: (typeof BALLS)[number];
  position: Vector3;
  ballGeometry: SphereGeometry;
  bind?: (...args: any[]) => ReactDOMAttributes;
  onClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export default function Ball({
  ball: { id: ballId },
  position,
  ballGeometry,
  bind,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: Props) {
  const ballTexture = useTexture(`/balls/${ballId}.jpg`);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);
  const addBallBody = useBallsStore((state) => state.addBallBody);
  const addBallMesh = useBallsStore((state) => state.addBallMesh);
  const setBallState = useBallsStore((state) => state.setBallState);

  const ballState = useRef<BallStates>("sleep");
  const ballBody = useRef<RigidBodyApi>();
  const ballMesh = useRef<MeshGeometry>();

  return (
    <>
      <RigidBody
        ref={(ref) => {
          if (ref == null) return;

          ballBody.current = ref;
          ballState.current = "sleep";
          addBallBody(ref, ballId);
        }}
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
          if (
            ballBody.current == undefined ||
            ballState.current === "pocket" ||
            ballState.current === "out"
          )
            return;

          ballState.current = "sleep";
          setBallState("sleep", ballId);

          if (
            useBallsStore
              .getState()
              .ballsData.every(({ state }) => state === "sleep")
          ) {
            setGameMode("idle");

            // handleEndTurn();
            if (useBallsStore.getState().selectedBall?.id === 0)
              setGameMode("shot");
          }
        }}
        onWake={() => {
          if (
            ballBody.current == undefined ||
            ballState.current === "pocket" ||
            ballState.current === "out"
          )
            return;

          ballState.current = "wake";
          setBallState("wake", ballId);

          setGameMode("moving");
        }}
      >
        <mesh
          ref={(ref) => {
            if (ref == null) return;

            ballMesh.current = ref;
            addBallMesh(ref, ballId);
          }}
          name={`ball${ballId}`}
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
