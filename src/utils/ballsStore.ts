import type { RigidBodyApi } from "@react-three/rapier";
import type { BufferGeometry, Material, Mesh } from "three";
import { Vector3 } from "three";
import create from "zustand";

import type { BALLS } from "@/constants/BALLS";
import { getInitialPositions } from "@/constants/BALLS";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const ZeroVector3 = new Vector3(0, 0, 0);

type BallId = (typeof BALLS)[number]["id"];
export type BallStatus = "sleep" | "wake" | "pocket" | "out";
export type MeshGeometry = Mesh<BufferGeometry, Material | Material[]>;

type BallsStore = {
  selectedBall: BallState | null;
  ballsState: BallState[];
  setSelectedBall: (id: BallId | null, checkShot?: boolean) => void;
  addBall: <Type extends "body" | "mesh">(
    ...args: Type extends "body"
      ? [type: Type, body: RigidBodyApi | null, id: BallId]
      : [type: Type, mesh: MeshGeometry | null, id: BallId]
  ) => void;
  setBallStatus: (status: BallStatus, id: BallId, force?: boolean) => void;
  resetPositions: (positions?: Vector3[]) => void;
  getBallsPositions: () => Vector3[];
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
        if (
          useMultiplayerStore.getState().userInfo?.username != undefined &&
          useMultiplayerStore.getState().isUserTurn() !== true
        )
          return;
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

        state.body.setLinvel(ZeroVector3, false);
        state.body.setAngvel(ZeroVector3, false);
        state.body.setTranslation(position, false);
        state.status = "sleep";
      });
      return { ballsState };
    });

    useGameStore.getState().setResetCamera(true);
  },

  getBallsPositions() {
    return get().ballsState.map(({ body }) => {
      const pos = body?.raw().translation();
      return pos ? new Vector3(pos.x, pos.y, pos.z) : new Vector3();
    });
  },
}));

export type BallState = {
  id: BallId;
  status: BallStatus;
  body?: RigidBodyApi;
  mesh?: MeshGeometry;
};
