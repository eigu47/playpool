import React from "react";

import { useGameStore } from "@/utils/store";

type Props = {
  className?: string;
};

export default function ResetBtn({ className }: Props) {
  const resetPositions = useGameStore((state) => state.resetPositions);

  return (
    <button
      onClick={() => resetPositions()}
      className={`rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700 ${className}`}
    >
      RESET
    </button>
  );
}
