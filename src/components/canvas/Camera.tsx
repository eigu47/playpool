import React, { useRef } from "react";

import { OrbitControls, QuadraticBezierLine } from "@react-three/drei";
import { type Object3DNode, useFrame } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";
import { useControls } from "leva";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl, Line2 } from "three-stdlib";

import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore, type GameModes } from "@/utils/gameStore";

export const CAMERA_PROPS: Partial<
  Record<GameModes, Partial<OrbitControlsImpl>>
> &
  Record<"default", Partial<OrbitControlsImpl>> = {
  default: {
    rotateSpeed: 0.5,
    maxDistance: 3,
    minDistance: 1,
    maxPolarAngle: Math.PI / 2.4,
    minPolarAngle: 0,
  },
  shot: {
    rotateSpeed: 0.2,
    maxDistance: 1.5,
    minPolarAngle: Math.PI / 2.4,
  },
  moving: {
    minDistance: 3,
  },
  // debug: {
  //   maxPolarAngle: Math.PI,
  //   minDistance: 0,
  // },
} as const;
type Line2Props = Object3DNode<Line2, typeof Line2> & {
  setPoints: (
    start: Vector3 | [number, number, number],
    end: Vector3 | [number, number, number],
    mid: Vector3 | [number, number, number]
  ) => void;
};

const cameraInitialPos = new Vector3(0, 0.78, 2.9);
const lineVector = new Vector3();
const lineEndVector = new Vector3();

export default function Camera() {
  const { debugOn } = useControls("Debug", { debugOn: false });
  const cameraRef = useRef<OrbitControlsImpl>(null);
  const lineRef = useRef<Line2Props>(null);

  const gameMode = useGameStore((state) => state.gameMode);
  const setShotNormal = useGameStore((state) => state.setShotNormal);
  const selectedBall = useBallsStore((state) => state.selectedBall);
  const resetCamera = useGameStore((state) => state.resetCamera);

  const rotateCamera = gameMode === "menu" || gameMode === "waiting";

  useFrame(({ camera }, delta) => {
    if (debugOn) return null;

    if (selectedBall) {
      const cameraCenter = vec3(selectedBall.translation());
      cameraRef.current?.target.lerp(cameraCenter, delta * 4);

      if (gameMode === "shot") {
        lineVector
          .subVectors(cameraCenter, camera.position)
          .normalize()
          .setY(cameraCenter.y);

        setShotNormal(lineVector);

        lineRef.current?.setPoints(
          cameraCenter,
          lineEndVector.lerp(
            cameraCenter
              .clone()
              .add(lineVector.clone().multiplyScalar(2.5))
              .setY(cameraCenter.y),
            delta * 40
          ),
          cameraCenter
        );
      }
    }

    if (resetCamera && !rotateCamera && gameMode !== "shot") {
      camera.position.lerp(cameraInitialPos, delta * 4);
    }
  });

  return (
    <>
      <OrbitControls
        ref={cameraRef}
        makeDefault
        enablePan={debugOn}
        autoRotate={rotateCamera}
        autoRotateSpeed={-1}
        enableRotate={!rotateCamera}
        rotateSpeed={
          CAMERA_PROPS[gameMode]?.rotateSpeed ??
          CAMERA_PROPS["default"].rotateSpeed
        }
        maxDistance={
          CAMERA_PROPS[gameMode]?.maxDistance ??
          CAMERA_PROPS["default"].maxDistance
        }
        minDistance={
          CAMERA_PROPS[gameMode]?.minDistance ??
          CAMERA_PROPS["default"].minDistance
        }
        maxPolarAngle={
          CAMERA_PROPS[gameMode]?.maxPolarAngle ??
          CAMERA_PROPS["default"].maxPolarAngle
        }
        minPolarAngle={
          CAMERA_PROPS[gameMode]?.minPolarAngle ??
          CAMERA_PROPS["default"].minPolarAngle
        }
      />

      <QuadraticBezierLine ref={lineRef} start={[0, 0, 0]} end={[0, 0, 0]} />
    </>
  );
}
