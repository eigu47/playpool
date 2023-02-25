import React from "react";

import { useBallsStore } from "@/utils/ballsStore";

type Props = {
  className?: string;
};

export default function ResetBtn({ className }: Props) {
  const resetPositions = useBallsStore((state) => state.resetPositions);

  return (
    <button
      onClick={() => resetPositions()}
      className={`select-none rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700 ${className}`}
    >
      RESET
    </button>
  );
}
