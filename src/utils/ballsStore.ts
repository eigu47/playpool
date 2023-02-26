import type { RigidBodyApi } from "@react-three/rapier";
import type { BufferGeometry, Material, Mesh, Vector3 } from "three";
import create from "zustand";

import { getInitialPositions, type BALLS } from "@/constants/BALLS";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

type BallId = (typeof BALLS)[number]["id"];
export type BallStatus = "sleep" | "wake" | "pocket" | "out";
export type MeshGeometry = Mesh<BufferGeometry, Material | Material[]>;

export type BallState = {
  id: BallId;
  status: BallStatus;
  body?: RigidBodyApi;
  mesh?: MeshGeometry;
};

type BallsStore = {
  selectedBall: BallState | null;
  ballsState: BallState[];
  setSelectedBall: (id: BallId | null, checkShot?: boolean) => void;
  addBall: <Type extends "body" | "mesh">(
    type: Type,
    ref: (Type extends "body" ? RigidBodyApi : MeshGeometry) | null,
    id: BallId
  ) => void;
  setBallStatus: (status: BallStatus, id: BallId, force?: boolean) => void;
  resetPositions: (positions?: Vector3[]) => void;
};

export const useBallsStore = create<BallsStore>((set, get) => ({
  selectedBall: null,
  ballsState: [],

  setSelectedBall(id, checkShot = false) {
    if (id == null) return set({ selectedBall: null });

    if (get().ballsState[id]?.status === "pocket") return;

    set(({ ballsState }) => ({ selectedBall: ballsState[id] }));

    if (checkShot === true) {
      if (id === 0) {
        if (useMultiplayerStore.getState().isUserTurn() != false) return;
        useGameStore.getState().setGameMode("shot");
        return;
      }

      if (useGameStore.getState().gameMode === "shot")
        useGameStore.getState().setGameMode("idle");
    }
  },

  addBall(type, ref, id) {
    if (ref == null) return;

    set((state) => {
      const ballsState = [...state.ballsState];

      ballsState[id] = {
        ...ballsState[id],
        id,
        status: "sleep",
        [type]: ref,
      };
      return { ballsState };
    });
  },

  setBallStatus(status, id, force = false) {
    const ballState = get().ballsState[id];

    if (force === false) {
      if (
        ballState == undefined ||
        ballState.status === "pocket" ||
        ballState.status === "out"
      )
        return;
    }

    set((state) => {
      const ballsState = [...state.ballsState];

      ballsState[id] = {
        ...ballsState[id],
        id,
        status,
      };
      return { ballsState };
    });
  },

  resetPositions(positions = getInitialPositions()) {
    set((state) => {
      const ballsState = [...state.ballsState];

      ballsState.forEach((state, index) => {
        const position = positions[index];
        if (state.body == undefined || position == undefined) return;

        state.body.setLinvel({ x: 0, y: 0, z: 0 });
        state.body.setAngvel({ x: 0, y: 0, z: 0 });
        state.body.setTranslation(position);
        state.status = "wake";
      });
      return { ballsState };
    });

    useGameStore.getState().setResetCamera(true);
  },
}));
