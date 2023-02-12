import type { Vector3 } from "three";
import create from "zustand";

import type { BallBody, BallMesh } from "@/components/canvas/Balls";
import { getInitialPositions } from "@/constants/balls";

type BallState = {
  id: number;
  mesh: BallMesh;
  body: BallBody;
};
export type GameModes = "idle" | "shot" | "moving";

type GameStore = {
  selectedBall: BallState | null;
  ballsState: BallState[];
  shotNormal: Vector3 | null;
  gameMode: GameModes;
  setSelectedBall: (ball: number) => void;
  addBallMesh: (mesh: BallMesh, index: number) => void;
  addBallBody: (body: BallBody, index: number) => void;
  setShotNormal: (normal: Vector3 | null) => void;
  setGameMode: (mode: GameModes) => void;
  resetPositions: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  selectedBall: null,
  shotNormal: null,
  gameMode: "idle",
  ballsState: [],

  setSelectedBall: (ball) => set({ selectedBall: get().ballsState[ball] }),
  addBallMesh(mesh, index) {
    set((state) => {
      const ballsState = state.ballsState;

      ballsState[index] = {
        ...ballsState[index],
        id: index,
        mesh,
      };

      return {
        ballsState,
      };
    });
  },
  addBallBody(body, index) {
    set((state) => {
      const ballsState = state.ballsState;

      ballsState[index] = {
        ...ballsState[index],
        id: index,
        body,
      };

      return {
        ballsState,
      };
    });
  },
  setShotNormal: (normal) => set({ shotNormal: normal }),
  setGameMode: (mode) => {
    if (mode === "shot") {
      if (get().gameMode === "idle" && get().selectedBall?.id === 0)
        set({ gameMode: "shot" });
      return;
    }

    set({ gameMode: mode });
  },
  resetPositions: () => {
    const positions = getInitialPositions();

    get()
      .ballsState.flatMap((ball) => ball.body)
      .forEach((body, index) => {
        body.setLinvel({ x: 0, y: 0, z: 0 });
        body.setAngvel({ x: 0, y: 0, z: 0 });
        body.setTranslation({
          x: positions[index][0],
          y: positions[index][1],
          z: positions[index][2],
        });

        body.isOnPlay = true;
      });
  },
}));
