import React, { useRef } from "react";

import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Vector3, type Mesh } from "three";
import type { Line2, OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useCamera } from "@/utils/store";

const lineVector = new Vector3();

export default function Camera() {
  const { debugOn } = useControls("Debug", { debugOn: false });
  const cameraRef = useRef<OrbitControlsImpl>(null);
  const lineRef = useRef(null);

  const cameraCenter = useCamera((state) => state.cameraCenter);
  const gameMode = useCamera((state) => state.gameMode);

  useFrame(({ camera }, delta) => {
    cameraCenter && cameraRef.current?.target.lerp(cameraCenter, delta * 4);

    if (gameMode === "shot" && cameraCenter) {
      lineVector
        .subVectors(cameraCenter, camera.position)
        .setY(cameraCenter.y)
        .normalize();
    }
  });

  return (
    <>
      <OrbitControls
        ref={cameraRef}
        makeDefault
        rotateSpeed={gameMode === "shot" ? 0.2 : 0.5}
        maxDistance={gameMode === "shot" ? 0.75 : 1.5}
        minDistance={0.5}
        maxPolarAngle={debugOn ? Math.PI : Math.PI / 2.4}
        minPolarAngle={gameMode === "shot" ? Math.PI / 2.4 : 0}
        target={[0, 0, 0]}
      />
    </>
  );
}
