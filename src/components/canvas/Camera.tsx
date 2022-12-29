import React, { useRef } from "react";

import { OrbitControls, QuadraticBezierLine } from "@react-three/drei";
import { type Line2Props } from "@react-three/drei/core/QuadraticBezierLine";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useGameStore, type GameModes } from "@/utils/store";

const cameraCenter = new Vector3();
const lineVector = new Vector3();

const cameraProps: Partial<Record<GameModes, Partial<OrbitControlsImpl>>> = {
  shot: {
    rotateSpeed: 0.2,
    maxDistance: 0.75,
    minPolarAngle: Math.PI / 2.4,
  },
  moving: {
    minDistance: 1.5,
  },
} as const;

export default function Camera() {
  const { debugOn } = useControls("Debug", { debugOn: false });
  const cameraRef = useRef<OrbitControlsImpl>(null);
  const lineRef = useRef<Line2Props>(null);

  const getSelectedBall = useGameStore((state) => state.getSelectedBall);
  const gameMode = useGameStore((state) => state.gameMode);
  const setShotNormal = useGameStore((state) => state.setShotNormal);
  const _selected = useGameStore((state) => state.selectedBall);

  const selectedBall = getSelectedBall();

  useFrame(({ camera }, delta) => {
    if (!selectedBall) return null;

    selectedBall.mesh?.getWorldPosition(cameraCenter);
    cameraRef.current?.target.lerp(cameraCenter, delta * 4);

    if (gameMode === "shot") {
      lineVector
        .subVectors(cameraCenter, camera.position)
        .normalize()
        .setY(cameraCenter.y);

      setShotNormal(lineVector);

      lineRef.current?.setPoints(
        cameraCenter,
        cameraCenter
          .clone()
          .add(lineVector.clone().multiplyScalar(2))
          .setY(cameraCenter.y),
        cameraCenter
      );
    }
  });

  return (
    <>
      <OrbitControls
        ref={cameraRef}
        makeDefault
        rotateSpeed={cameraProps[gameMode]?.rotateSpeed ?? 0.5}
        maxDistance={cameraProps[gameMode]?.maxDistance ?? 1.5}
        minDistance={cameraProps[gameMode]?.minDistance ?? 0.5}
        maxPolarAngle={debugOn ? Math.PI : Math.PI / 2.4}
        minPolarAngle={cameraProps[gameMode]?.minPolarAngle ?? 0}
        target={[0, 0, 0]}
      />

      <QuadraticBezierLine ref={lineRef} start={[0, 0, 0]} end={[0, 0, 0]} />
    </>
  );
}
