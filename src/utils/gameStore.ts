import type { Vector3 } from "three";
import create from "zustand";

import { useBallsStore } from "@/utils/ballsStore";

export type GameModes = "idle" | "shot" | "moving" | "menu";

type GameStore = {
  shotNormal: Vector3 | null;
  gameMode: GameModes;
  resetCamera: boolean;
  setShotNormal: (normal: Vector3 | null) => void;
  setGameMode: (mode: GameModes, force?: boolean) => void;
  setResetCamera: (reset: boolean) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  shotNormal: null,
  gameMode: "menu",
  resetCamera: false,

  setShotNormal(shotNormal) {
    set({ shotNormal });
  },

  setGameMode(gameMode, force = false) {
    if (force === false) {
      const prevMode = get().gameMode;
      if (prevMode === gameMode || prevMode === "menu") return;

      if (gameMode === "shot") {
        if (
          prevMode !== "idle" ||
          useBallsStore.getState().selectedBall?.id !== 0
        )
          return;
      }
    }

    set({ gameMode });
  },

  setResetCamera(resetCamera) {
    set({ resetCamera });
  },
}));
