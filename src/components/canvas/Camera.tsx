import React, { useRef } from "react";

import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useStore } from "@/utils/store";

export default function Camera() {
  const { debugOn } = useControls("Debug", { debugOn: false });
  const cameraRef = useRef<OrbitControlsImpl>(null);

  const cameraCenter = useStore((state) => state.cameraCenter);

  useFrame((_, delta) => {
    cameraCenter && cameraRef.current?.target.lerp(cameraCenter, delta * 4);
  });

  return (
    <OrbitControls
      ref={cameraRef}
      makeDefault
      rotateSpeed={0.5}
      maxDistance={2}
      minDistance={0.5}
      maxPolarAngle={debugOn ? Math.PI : Math.PI / 2.2}
      target={[0, 0, 0]}
    />
  );
}
