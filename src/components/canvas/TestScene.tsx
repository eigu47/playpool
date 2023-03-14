import React, { Suspense } from "react";

import { Loader, MapControls, Preload, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, useRapier } from "@react-three/rapier";
import { SphereGeometry, Vector3 } from "three";

import Debugs from "@/components/canvas/Debugs";
import PoolTable from "@/components/canvas/PoolTable";
import { BALLS, getInitialPositions } from "@/constants/BALLS";
import { PHYSIC_CONSTANTS } from "@/constants/PHYSICS";
import { useBallsStore } from "@/utils/ballsStore";

export default function Scene() {
  return (
    <>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <color args={["hsl(210, 50%, 20%)"]} attach="background" />

        {/* <Camera /> */}
        <MapControls />
        <Suspense>
          <Physics>
            <PoolTable />
            <DummyBalls />
            <Debugs />
          </Physics>
        </Suspense>
        <Preload all />
      </Canvas>

      <Loader />
    </>
  );
}

const ballGeometry = new SphereGeometry(PHYSIC_CONSTANTS.BALL_RADIUS, 16, 16);
const positions = getInitialPositions();

function DummyBalls() {
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
  const addBallBody = useBallsStore((state) => state.addBallBody);
  const rapier = useRapier();

  return (
    <>
      {BALLS.map(({ id }) => (
        <RigidBody
          ref={(ref) => addBallBody(ref, id)}
          userData={{ id, status: "play" }}
          key={id}
          colliders="ball"
          position={positions[id]}
          friction={PHYSIC_CONSTANTS.BALL_FRICTION}
          restitution={PHYSIC_CONSTANTS.BALL_RESTITUTION}
          linearDamping={PHYSIC_CONSTANTS.LINEAR_DAMPING}
          angularDamping={PHYSIC_CONSTANTS.ANGULAR_DAMPING}
          onSleep={() => {
            if (useBallsStore.getState().ballsBody[0]?.isSleeping()) {
              useBallsStore
                .getState()
                .ballsBody[0]?.applyImpulse(
                  new Vector3(0.0030310458016130602, 0, -0.0052209744760603706),
                  true
                );
            }
          }}
        >
          <mesh geometry={ballGeometry}>
            <meshStandardMaterial map={ballTextures[id]} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
