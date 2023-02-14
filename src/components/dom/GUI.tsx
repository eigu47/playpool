import React from "react";

import { useControls } from "leva";

import { useGameStore } from "@/utils/store";

export default function GUI() {
  const gameMode = useGameStore((state) => state.gameMode);
  const { debugOn } = useControls("Debug", { debugOn: false });

  const resetPositions = useGameStore((state) => state.resetPositions);

  return (
    <div className="absolute top-0 left-0 text-white">
      <div>{gameMode}</div>
      <div>
        <button
          onClick={() => resetPositions()}
          className="rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700"
        >
          RESET
        </button>
      </div>
    </div>
  );
}
