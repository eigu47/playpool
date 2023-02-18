import React from "react";

import { Leva } from "leva";
import { useRouter } from "next/router";

import ResetBtn from "@/components/dom/ResetBtn";
import { useGameStore } from "@/utils/store";

export default function GUI() {
  const gameMode = useGameStore((state) => state.gameMode);
  const { query } = useRouter();

  const debugMode =
    process.env.NODE_ENV === "development" || query.debug === "";

  return (
    <>
      {debugMode && (
        <div className="fixed bottom-0 left-0 m-3 text-center text-white">
          <p>{gameMode}</p>
          <ResetBtn />
        </div>
      )}

      <Leva hidden={!debugMode} />
    </>
  );
}
