import React, { useRef } from "react";

import { useTexture } from "@react-three/drei";
import {
  CuboidCollider,
  RigidBody,
  type RigidBodyApi,
} from "@react-three/rapier";
import { useDrag } from "@use-gesture/react";
import {
  type Mesh,
  SphereGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";

import { getInitialPositions, BALLS } from "@/constants/BALLS";
import { PHYSIC_CONSTANTS } from "@/constants/PHYSICS";
import { useGameStore } from "@/utils/store";

export interface BallBody extends RigidBodyApi {
  isAwake: boolean;
  isOnPlay: boolean;
}

export type BallMesh = Mesh<BufferGeometry, Material | Material[]> | null;

const ballGeometry = new SphereGeometry(0.026, 16, 16);
const forceVector = new Vector3();

export default function Balls() {
  const ballTextures = useTexture([
    "/balls/0.jpg",
    "/balls/1.jpg",
    "/balls/2.jpg",
    "/balls/3.jpg",
    "/balls/4.jpg",
    "/balls/5.jpg",
    "/balls/6.jpg",
    "/balls/7.jpg",
    "/balls/8.jpg",
    "/balls/9.jpg",
    "/balls/10.jpg",
    "/balls/11.jpg",
    "/balls/12.jpg",
    "/balls/13.jpg",
    "/balls/14.jpg",
    "/balls/15.jpg",
  ]);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setSelectedBall = useGameStore((state) => state.setSelectedBall);
  const addBallBody = useGameStore((state) => state.addBallBody);
  const addBallMesh = useGameStore((state) => state.addBallMesh);

  const ballBodies = useRef<BallBody[]>([]);
  const ballMeshes = useRef<BallMesh[]>([]);
  const positions = getInitialPositions();

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

      ballBodies.current[0]?.applyImpulse(forceVector);
    }
  });

  return (
    <>
      {BALLS.map(({ id: ballId, type: _ }) => (
        <RigidBody
          ref={(ref) => {
            if (ref == null) return;

            ballBodies.current[ballId] = {
              ...ref,
              isAwake: false,
              isOnPlay: true,
            };

            const ballBody = ballBodies.current[ballId];
            if (ballBody == undefined) return;

            addBallBody(ballBody, ballId);
          }}
          name={ballId.toString()}
          key={ballId}
          colliders="ball"
          friction={PHYSIC_CONSTANTS.BALL_FRICTION}
          restitution={PHYSIC_CONSTANTS.BALL_RESTITUTION}
          angularDamping={PHYSIC_CONSTANTS.DAMPING}
          position={positions[ballId]}
          rotation={[
            Math.PI * Math.random() * 2,
            Math.PI * Math.random() * 2,
            Math.PI * Math.random() * 2,
          ]}
          onSleep={() => {
            const ballBody = ballBodies.current[ballId];
            if (ballBody == undefined || ballBody.isOnPlay === false) return;

            ballBody.isAwake = false;
            addBallBody(ballBody, ballId);

            const gameMode = useGameStore.getState().gameMode;
            if (gameMode === "idle") return;

            if (ballBodies.current.every(({ isAwake }) => isAwake === false)) {
              setGameMode("idle");

              // handleEndTurn();
              if (useGameStore.getState().selectedBall?.id === 0)
                setGameMode("shot");
            }
          }}
          onWake={() => {
            const ballBody = ballBodies.current[ballId];
            if (ballBody == undefined || ballBody.isOnPlay === false) return;

            ballBody.isAwake = true;
            addBallBody(ballBody, ballId);

            setGameMode("moving");
          }}
        >
          <mesh
            ref={(ref) => {
              ballMeshes.current[ballId] = ref;

              addBallMesh(ref, ballId);
            }}
            name={`ball${ballId}`}
            geometry={ballGeometry}
            {...(ballId === 0 && (bind() as Mesh))}
            onClick={() => {
              setSelectedBall(ballId);

              if (ballId === 0) {
                setGameMode("shot");
                return;
              }

              setGameMode("idle");
            }}
            onPointerEnter={() => {
              if (ballId !== 0) return;
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              if (ballId !== 0) return;
              document.body.style.cursor = "default";
            }}
          >
            <meshStandardMaterial map={ballTextures[ballId]} />
          </mesh>
        </RigidBody>
      ))}

      <CuboidCollider
        args={[0.75, 0.15, 1.2]}
        position={[0, 0.1, 0]}
        sensor
        onIntersectionExit={(e) => {
          const ballId = e.other.rigidBodyObject?.name;
          if (ballId == undefined) return;

          const ballBody = ballBodies.current[+ballId];
          if (ballBody == undefined || ballBody.isOnPlay == false) return;

          ballBody.isOnPlay = false;
          ballBody.isAwake = false;
          addBallBody(ballBody, +ballId as (typeof BALLS)[number]["id"]);
        }}
      />
    </>
  );
}
