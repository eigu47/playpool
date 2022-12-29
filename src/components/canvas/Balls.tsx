import React, { useRef } from "react";

import { useTexture } from "@react-three/drei";
import { RigidBody, type RigidBodyApi } from "@react-three/rapier";
import { useDrag } from "@use-gesture/react";
import {
  type Mesh,
  SphereGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";

import getInitialPositions from "@/constants/balls";
import { PHYSIC_CONSTANTS } from "@/constants/physic";
import { useGameStore } from "@/utils/store";

export interface BallBody extends RigidBodyApi {
  isAwake: boolean;
  isOnPlay: boolean;
}

export type BallMesh = Mesh<BufferGeometry, Material | Material[]> | null;

const ballGeometry = new SphereGeometry(0.026, 16, 16);

const balls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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
      {balls.map((ball, index) => (
        <RigidBody
          ref={(ref) => {
            ballBodies.current[index] = {
              ...(ref as any),
              isAwake: false,
              isOnPlay: true,
            };

            addBallBody(ballBodies.current[index], index);
          }}
          name={index.toString()}
          key={index}
          colliders="ball"
          friction={PHYSIC_CONSTANTS.BALL_FRICTION}
          restitution={PHYSIC_CONSTANTS.BALL_RESTITUTION}
          angularDamping={PHYSIC_CONSTANTS.DAMPING}
          position={positions[index]}
          rotation={[
            Math.PI * Math.random() * 2,
            Math.PI * Math.random() * 2,
            Math.PI * Math.random() * 2,
          ]}
          onSleep={() => {
            ballBodies.current[index].isAwake = false;

            if (
              ballBodies.current
                .flatMap((body) => body?.isAwake)
                .every((isAwake) => isAwake === false)
            ) {
              setGameMode("idle");

              if (useGameStore.getState().selectedBall === 0) {
                setGameMode("shot");
              }
            }
          }}
          onWake={() => {
            if (ballBodies.current[index].isOnPlay === false) return;

            ballBodies.current[index].isAwake = true;
            setGameMode("moving");
          }}
          onIntersectionEnter={({ target }) => {
            if (target.rigidBodyObject?.name) {
              const ball = ballBodies.current[+target.rigidBodyObject.name];

              ball.isOnPlay = false;
              ball.isAwake = false;
            }
          }}
        >
          <mesh
            ref={(ref) => {
              ballMeshes.current[index] = ref;

              addBallMesh(ref, index);
            }}
            name={index.toString()}
            geometry={ballGeometry}
            {...(index === 0 && { ...(bind() as any) })}
            onClick={() => {
              setSelectedBall(index);

              if (index === 0) {
                setGameMode("shot");
              } else {
                useGameStore.getState().gameMode === "shot" &&
                  setGameMode("idle");
              }
            }}
          >
            <meshStandardMaterial map={ballTextures[index]} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
