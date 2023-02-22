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

  setShotNormal(normal) {
    set({ shotNormal: normal });
  },
  setGameMode: (mode) => {
    if (mode === "shot") {
      if (get().gameMode === "idle") set({ gameMode: "shot" });

      return;
    }

    if (mode === "idle") {
      if (
        useBallsStore
          .getState()
          .ballsData.every(({ state }) => state === "sleep")
      ) {
        set({ gameMode: "idle" });

        return;
      }
    }

    set({ gameMode: mode });
  },
}));
