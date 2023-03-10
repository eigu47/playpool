import React from "react";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { SphereGeometry } from "three";

import { BALLS, getInitialPositions } from "@/constants/BALLS";
import { type BallId, useBallsStore } from "@/utils/ballsStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const ballGeometry = new SphereGeometry(0.026, 16, 16);
const positions = getInitialPositions();

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
  const setBallState = useBallsStore((state) => state.setBallStatus);
  const addDummyBall = useMultiplayerStore((state) => state.addDummyBall);

  useFrame(({ clock }) => {
    console.log(clock.elapsedTime);
  });

  return (
    <>
      {BALLS.map(({ id }) => (
        <>
          <RigidBody
            ref={(ref) => addDummyBall("body", ref, id)}
            key={id}
            colliders="ball"
            position={positions[id]}
            rotation={[
              Math.PI * Math.random() * 2,
              Math.PI * Math.random() * 2,
              Math.PI * Math.random() * 2,
            ]}
            onSleep={() => {
              if (
                useMultiplayerStore
                  .getState()
                  .dummyBallsState.every(({ body }) => body?.raw().isSleeping)
              ) {
                useMultiplayerStore.setState({ hideDummyScene: true });
              }
            }}
          >
            <mesh geometry={ballGeometry}>
              <meshStandardMaterial map={ballTextures[id]} />
            </mesh>
          </RigidBody>
        </>
      ))}
      <CuboidCollider
        args={[0.7, 0.1, 1.2]}
        position={[0, -0.12, 0]}
        sensor
        name="pocket"
        onIntersectionEnter={(e) => {
          const ballId = e.other.rigidBodyObject?.name;
          if (ballId == undefined) return;

          setBallState("pocket", +ballId as BallId);
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

          setBallState("out", +ballId as BallId);
        }}
      />
    </>
  );
}
