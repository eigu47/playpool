import type { Vector3 } from "three";
import create from "zustand";

import { useBallsStore } from "@/utils/ballsStore";

export type GameModes = "idle" | "shot" | "moving";

type GameStore = {
  shotNormal: Vector3 | null;
  gameMode: GameModes;
  setShotNormal: (normal: Vector3 | null) => void;
  setGameMode: (mode: GameModes) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  shotNormal: null,
  gameMode: "idle",

  setShotNormal(shotNormal) {
    set({ shotNormal });
  },

  setGameMode(gameMode) {
    if (gameMode === "shot") {
      if (get().gameMode !== "idle") return;
    }

    if (gameMode === "idle") {
      if (
        useBallsStore
          .getState()
          .ballsState.every(({ status: state }) => state === "sleep") === false
      )
        return;
    }

    set({ gameMode });
  },
}));
