import React from "react";

import { Loader, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import Balls from "@/components/canvas/Balls";
import Camera from "@/components/canvas/Camera";
import Debugs from "@/components/canvas/Debugs";
import PoolTable from "@/components/canvas/PoolTable";

export default function CanvasTSX() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <color args={["hsl(210, 50%, 20%)"]} attach="background" />

        <Camera />

        <Physics>
          <PoolTable />
          <Balls />
          <Debugs />
        </Physics>
      </Canvas>

      <Loader />
    </>
  );
}
