import type { Vector3 } from "three";
import create from "zustand";

import type { BallBody, BallMesh } from "@/components/canvas/Balls";
import { getInitialPositions, type BALLS } from "@/constants/BALLS";

type BallState = {
  id: (typeof BALLS)[number]["id"];
  mesh?: BallMesh;
  body?: BallBody;
};
export type GameModes = "idle" | "shot" | "moving";

type GameStore = {
  selectedBall: BallState | null;
  ballsState: BallState[];
  shotNormal: Vector3 | null;
  gameMode: GameModes;
  setSelectedBall: (ball: BallState["id"]) => void;
  addBallMesh: (mesh: BallMesh, id: BallState["id"]) => void;
  addBallBody: (body: BallBody, id: BallState["id"]) => void;
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
  addBallMesh(mesh, id) {
    set(({ ballsState }) => {
      ballsState[id] = {
        ...ballsState[id],
        id,
        mesh,
      };

      return { ballsState };
    });
  },
  addBallBody(body, id) {
    set(({ ballsState }) => {
      ballsState[id] = {
        ...ballsState[id],
        id,
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
        const position = positions[index];
        if (body == undefined || position == undefined) return;

        body.setLinvel({ x: 0, y: 0, z: 0 });
        body.setAngvel({ x: 0, y: 0, z: 0 });
        body.setTranslation(position);

        body.isOnPlay = true;
      });

      return { ballsState };
    });
  },
}));
