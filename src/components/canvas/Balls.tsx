import React from "react";

import { Sphere, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import getInitialPositions from "@/constants/balls";

const balls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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

  const positions = getInitialPositions();

  return (
    <>
      {balls.map((pos, index) => (
        <RigidBody key={index} colliders="ball">
          <Sphere args={[0.026, 16, 16]} position={positions[index]}>
            <meshBasicMaterial map={ballTextures[index]} />
          </Sphere>
        </RigidBody>
      ))}
    </>
  );
}
