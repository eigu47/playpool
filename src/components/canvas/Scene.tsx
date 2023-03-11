import React, { Suspense } from "react";

import { Loader, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import type { Vector3 } from "three";

import Balls from "@/components/canvas/Balls";
import Camera from "@/components/canvas/Camera";
import Debugs from "@/components/canvas/Debugs";
import PoolTable from "@/components/canvas/PoolTable";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

type Props = {
  children?: React.ReactNode;
  handleEndTurn?: () => void;
  handleWakeBall?: (ballId: number) => void;
  handleEndShot?: (forceVector: Vector3) => void;
};

export default function Scene({
  children,
  handleEndTurn,
  handleWakeBall,
  handleEndShot,
}: Props) {
  const setResetCamera = useGameStore((state) => state.setResetCamera);
  // const hideDummyScene = useMultiplayerStore((state) => state.hideDummyScene);

  return (
    <>
      <Canvas
        onMouseDown={() => setResetCamera(false)}
        onTouchStart={() => setResetCamera(false)}
        // hidden={!hideDummyScene}
        // frameloop="demand"
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <color args={["hsl(210, 50%, 20%)"]} attach="background" />

        <Camera />
        <Suspense>
          <Physics>
            <PoolTable />
            <Balls
              handleEndTurn={handleEndTurn}
              handleWakeBall={handleWakeBall}
              handleEndShot={handleEndShot}
            />
            {children}
            <Debugs />
          </Physics>
        </Suspense>
        <Preload all />
      </Canvas>

      <Loader />
    </>
  );
}
