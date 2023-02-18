import type { Vector3 } from "three";
import create from "zustand";

import type { BallBody, BallMesh } from "@/components/canvas/Balls";
import { getInitialPositions } from "@/constants/BALLS";

type BallState = {
  id: number;
  mesh: BallMesh;
  body: BallBody;
};
export type GameModes = "idle" | "shot" | "moving" | "end";

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
  resetPositions: (positions?: Vector3[]) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  selectedBall: null,
  shotNormal: null,
  gameMode: "idle",
  ballsState: [],

  setSelectedBall(ball) {
    set({ selectedBall: get().ballsState[ball] });
  },
  addBallMesh(mesh, index) {
    set(({ ballsState }) => {
      ballsState[index] = {
        ...ballsState[index],
        id: index,
        mesh,
      };

      return { ballsState };
    });
  },
  addBallBody(body, index) {
    set(({ ballsState }) => {
      ballsState[index] = {
        ...ballsState[index],
        id: index,
        body,
      };

      return { ballsState };
    });
  },
  setShotNormal(normal) {
    set({ shotNormal: normal });
  },
  setGameMode: (mode) => {
    const prevMode = get().gameMode;

    if (mode === "shot") {
      if (prevMode === "idle") set({ gameMode: "shot" });

      return;
    }

    set({ gameMode: mode });
  },
  resetPositions(positions = getInitialPositions()) {
    set(({ ballsState }) => {
      ballsState.forEach(({ body }, index) => {
        body.setLinvel({ x: 0, y: 0, z: 0 });
        body.setAngvel({ x: 0, y: 0, z: 0 });
        body.setTranslation(positions[index]);

        body.isOnPlay = true;
      });

      return { ballsState };
    });
  },
}));
