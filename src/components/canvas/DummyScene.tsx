import React, { Suspense } from "react";

import { Loader, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import Camera from "@/components/canvas/Camera";
import Debugs from "@/components/canvas/Debugs";
import DummyBalls from "@/components/canvas/DummyBalls";
import PoolTable from "@/components/canvas/PoolTable";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

export default function Scene() {
  const setResetCamera = useGameStore((state) => state.setResetCamera);
  const hideDummyScene = useMultiplayerStore((state) => state.hideDummyScene);

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 5] }}
        onMouseDown={() => setResetCamera(false)}
        onTouchStart={() => setResetCamera(false)}
        hidden={hideDummyScene}
        frameloop={hideDummyScene ? "never" : "demand"}
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
