import React, { useRef } from "react";

import { Sphere, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

import getInitialPositions from "@/constants/balls";
import { PHYSIC_CONSTANTS } from "@/constants/physic";
import { useStore } from "@/utils/store";

const balls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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

  const ballBody = useRef(null);

  const positions = getInitialPositions();

  const setCameraCenter = useStore((state) => state.setCameraCenter);

  return (
    <>
      {balls.map((pos) => (
        <RigidBody
          key={pos}
          colliders="ball"
          friction={PHYSIC_CONSTANTS.BALL_FRICTION}
          restitution={PHYSIC_CONSTANTS.BALL_RESTITUTION}
          angularDamping={1}
        >
          <Sphere
            args={[0.026, 16, 16]}
            position={positions[pos]}
            rotation={[
              Math.PI * Math.random() * 2,
              Math.PI * Math.random() * 2,
              Math.PI * Math.random() * 2,
            ]}
            onClick={(e) => {
              e.object.getWorldPosition(position);
              setCameraCenter(position);
            }}
          >
            <meshBasicMaterial map={ballTextures[pos]} />
          </Sphere>
        </RigidBody>
      ))}
    </>
  );
}
