import React, { useRef } from "react";

import { Sphere, useTexture } from "@react-three/drei";
import { RigidBody, type RigidBodyApi } from "@react-three/rapier";
import { useDrag } from "@use-gesture/react";
import { SphereGeometry, Vector3 } from "three";

import getInitialPositions from "@/constants/balls";
import { PHYSIC_CONSTANTS } from "@/constants/physic";
import { useCamera } from "@/utils/store";

const ballGeometry = new SphereGeometry(0.026, 16, 16);

const balls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const cameraCenter = new Vector3();
const cameraPosition = new Vector3();
const ballNormal = new Vector3();

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
  const setGameMode = useCamera((state) => state.setGameMode);
  const setCameraCenter = useCamera((state) => state.setCameraCenter);

  const ballBodies = useRef<RigidBodyApi[] | null[]>([]);
  const positions = getInitialPositions();

  const bind = useDrag(({ last, movement }) => {
    if (useCamera.getState().gameMode === "shot" && last && movement[1] > 0) {
      // console.log((movement[1] / window.innerHeight) * 2);
      // ballNormal.subVectors(cameraCenter, cameraPosition).normalize;
      // console.log(ballNormal);
    }
  });

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
            geometry={ballGeometry}
            //
            {...(index === 0 && { ...(bind() as any) })}
            //
            onClick={({ object }) => {
              object.getWorldPosition(cameraCenter);
              setCameraCenter(cameraCenter);

              if (index === 0) {
                setGameMode("shot");
              } else {
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
