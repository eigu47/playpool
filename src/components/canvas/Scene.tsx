import React from "react";

import { Loader, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import Balls from "@/components/canvas/Balls";
import Camera from "@/components/canvas/Camera";
import Debugs from "@/components/canvas/Debugs";
import PoolTable from "@/components/canvas/PoolTable";

type Props = {
  children?: React.ReactNode;
};

export default function Scene({ children }: Props) {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 5] }}
        className="absolute h-full w-full"
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <color args={["hsl(210, 50%, 20%)"]} attach="background" />

        <Camera />

        <Physics>
          <PoolTable />
          <Balls />
          <Debugs />
          {children}
        </Physics>
        <Preload all />
      </Canvas>

      <Loader />
    </>
  );
}
