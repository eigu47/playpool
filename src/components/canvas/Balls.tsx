import React, { useRef } from "react";

import { useTexture } from "@react-three/drei";
import { RigidBody, type RigidBodyApi } from "@react-three/rapier";
import { Vector3 } from "three";

import getInitialPositions from "@/constants/balls";
import { PHYSIC_CONSTANTS } from "@/constants/physic";
import { useCamera } from "@/utils/store";

const balls = Array(16);

const position = new Vector3();

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
  const setShotMode = useCamera((state) => state.setShotMode);

  const setCameraCenter = useCamera((state) => state.setCameraCenter);

  const ballBodies = useRef<RigidBodyApi[] | null[]>([]);

  const positions = getInitialPositions();

  return (
    <>
      {balls.map((ball, index) => (
        <RigidBody
          ref={(ref) => {
            ballBodies.current[index] = ref;
          }}
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
        >
          <mesh
            onClick={({ object }) => {
              object.getWorldPosition(position);

              setCameraCenter(position);

              if (index === 0) {
                setShotMode(true);
              } else {
                setShotMode(false);
              }
            }}
          >
            <sphereGeometry args={[0.026, 16, 16]} />
            <meshStandardMaterial map={ballTextures[index]} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
