import React from "react";

import { Canvas } from "@react-three/fiber";
import { Debug, Physics } from "@react-three/rapier";
import { useControls } from "leva";

import Balls from "@/components/canvas/Balls";
import Camera from "@/components/canvas/Camera";
import PoolTable from "@/components/canvas/PoolTable";

export default function CanvasTSX() {
  const { debugOn } = useControls("Debug", { debugOn: false });

  return (
    <>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <color args={["hsl(210, 50%, 20%)"]} attach="background" />

        <Camera />

        <Physics>
          {debugOn && <Debug />}
          <PoolTable />
          <Balls />
        </Physics>
      </Canvas>
    </>
  );
}
