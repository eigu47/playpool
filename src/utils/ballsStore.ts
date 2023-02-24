import type { RigidBodyApi } from "@react-three/rapier";
import type { BufferGeometry, Material, Mesh, Vector3 } from "three";
import create from "zustand";

import { getInitialPositions, type BALLS } from "@/constants/BALLS";

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
  setSelectedBall: (id: BallId) => void;
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

  setSelectedBall(id) {
    set(({ ballsState }) => ({ selectedBall: ballsState[id] }));
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
<<<<<<< HEAD

    if (force === false) {
      if (
        ballState == undefined ||
        ballState.status === "pocket" ||
        ballState.status === "out"
      )
        return;
    }
=======
    if (
      force === false &&
      (ballState == undefined ||
        ballState.status === "pocket" ||
        ballState.status === "out")
    )
      return;
>>>>>>> 0adc09b393ba5301080217e913bf209029466dab

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
<<<<<<< HEAD
=======

      ballsState.forEach(({ body }, index) => {
        const position = positions[index];
        if (body == undefined || position == undefined) return;
>>>>>>> 0adc09b393ba5301080217e913bf209029466dab

      ballsState.forEach((state, index) => {
        const position = positions[index];
        if (state.body == undefined || position == undefined) return;

<<<<<<< HEAD
        state.body.setLinvel({ x: 0, y: 0, z: 0 });
        state.body.setAngvel({ x: 0, y: 0, z: 0 });
        state.body.setTranslation(position);
        state.status = "wake";
      });
=======
        get().setBallStatus("sleep", index as BallId, true);
      });

>>>>>>> 0adc09b393ba5301080217e913bf209029466dab
      return { ballsState };
    });

    get().setSelectedBall(0);
  },
}));
