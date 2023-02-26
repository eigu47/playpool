import React from "react";

import { useProgress } from "@react-three/drei";
import { Leva } from "leva";
import { useRouter } from "next/router";

import Button from "@/components/dom/Button";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

type Props = {
  children: React.ReactNode;
};

export default function GUI({ children }: Props) {
  const gameMode = useGameStore((state) => state.gameMode);
  const resetPositions = useBallsStore((state) => state.resetPositions);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);
  const { query } = useRouter();
  const { progress } = useProgress();

  const debugMode =
    process.env.NODE_ENV === "development" || query.debug === "";

  return (
    <>
      {progress === 100 && <>{children}</>}

      <Leva hidden={!debugMode} />
      {debugMode && (
        <div className="fixed bottom-0 left-0 m-3 text-center text-white">
          <p>{gameMode}</p>
          <Button
            onClick={() => {
              resetPositions();
              setSelectedBall(0);
            }}
            text="RESET"
          />
        </div>
      )}
    </>
  );
}
