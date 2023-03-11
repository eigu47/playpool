import React, { Suspense, useRef } from "react";

import { Loader, OrbitControls, Preload, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, vec3 } from "@react-three/rapier";
import { SphereGeometry, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { CAMERA_PROPS } from "@/components/canvas/Camera";
import Debugs from "@/components/canvas/Debugs";
import PoolTable from "@/components/canvas/PoolTable";
import { BALLS, getInitialPositions } from "@/constants/BALLS";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

export default function Scene() {
  const setResetCamera = useGameStore((state) => state.setResetCamera);
  const hideDummyScene = useMultiplayerStore((state) => state.hideDummyScene);

  return (
    <>
      <Canvas
        onMouseDown={() => setResetCamera(false)}
        onTouchStart={() => setResetCamera(false)}
        // hidden={hideDummyScene}
        // frameloop={hideDummyScene ? "never" : "demand"}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <color args={["hsl(210, 50%, 20%)"]} attach="background" />

        <Camera />
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

const ballGeometry = new SphereGeometry(0.026, 16, 16);
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
  const addDummyBall = useMultiplayerStore((state) => state.addDummyBall);

  return (
    <>
      {BALLS.map(({ id }) => (
        <RigidBody
          ref={(ref) => addDummyBall(ref, id)}
          userData={{ id, status: "play" }}
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
                .dummyBalls.every(
                  (ball) =>
                    ball?.isSleeping() || ball?.userData.status !== "play"
                )
            ) {
              // useMultiplayerStore.setState({ hideDummyScene: true });
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

const cameraCenter = new Vector3();

function Camera() {
  const dummyCueBall = useMultiplayerStore((state) => state.dummyBalls[0]);
  const cameraRef = useRef<OrbitControlsImpl>(null);

  useFrame(({ camera }, delta) => {
    if (dummyCueBall) {
      cameraCenter.copy(vec3(dummyCueBall.translation()));
      cameraRef.current?.target.lerp(cameraCenter, delta * 4);
    }
  });

  return (
    <OrbitControls
      ref={cameraRef}
      makeDefault
      rotateSpeed={
        CAMERA_PROPS.shot?.rotateSpeed ?? CAMERA_PROPS.default.rotateSpeed
      }
      maxDistance={
        CAMERA_PROPS.shot?.maxDistance ?? CAMERA_PROPS.default.maxDistance
      }
      minPolarAngle={
        CAMERA_PROPS.shot?.minPolarAngle ?? CAMERA_PROPS.default.minPolarAngle
      }
      minDistance={CAMERA_PROPS.default.minDistance}
      maxPolarAngle={CAMERA_PROPS.default.maxPolarAngle}
    />
  );
}
