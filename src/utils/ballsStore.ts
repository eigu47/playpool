import type { RigidBodyApi } from "@react-three/rapier";
import type { BufferGeometry, Material, Mesh, Vector3 } from "three";
import create from "zustand";

import { getInitialPositions, type BALLS } from "@/constants/BALLS";

export type MeshGeometry = Mesh<BufferGeometry, Material | Material[]>;

export type BallsData = {
  id: (typeof BALLS)[number]["id"];
  state: BallStates;
  body?: RigidBodyApi;
  mesh?: MeshGeometry;
};
export type BallStates = "sleep" | "wake" | "pocket" | "out";

type BallsStore = {
  selectedBall: BallsData | null;
  ballsData: BallsData[];
  setSelectedBall: (ball: BallsData["id"]) => void;
  addBallBody: (body: RigidBodyApi, id: BallsData["id"]) => void;
  addBallMesh: (mesh: MeshGeometry, id: BallsData["id"]) => void;
  setBallState: (state: BallStates, id: BallsData["id"]) => void;
  resetPositions: (positions?: Vector3[]) => void;
};

export const useBallsStore = create<BallsStore>((set, get) => ({
  selectedBall: null,
  ballsData: [],

  setSelectedBall(ball) {
    set(({ ballsData: ballsState }) => ({ selectedBall: ballsState[ball] }));
  },
  addBallBody(body, id) {
    set(({ ballsData: ballsState }) => {
      ballsState[id] = {
        ...ballsState[id],
        id,
        state: "sleep",
        body,
      };

      return { ballsData: ballsState };
    });
  },
  addBallMesh(mesh, id) {
    set(({ ballsData: ballsState }) => {
      ballsState[id] = {
        ...ballsState[id],
        id,
        state: "sleep",
        mesh,
      };

      return { ballsData: ballsState };
    });
  },
  setBallState(state, id) {
    set(({ ballsData: ballsState }) => {
      ballsState[id] = {
        ...ballsState[id],
        id,
        state,
      };

      return { ballsData: ballsState };
    });
  },
  resetPositions(positions = getInitialPositions()) {
    set(({ ballsData: ballsState }) => {
      ballsState.forEach(({ body, state }, index) => {
        const position = positions[index];
        if (body == undefined || position == undefined) return;

        body.setLinvel({ x: 0, y: 0, z: 0 });
        body.setAngvel({ x: 0, y: 0, z: 0 });
        body.setTranslation(position);

        state = "sleep";
      });

      return { ballsData: ballsState };
    });
  },
}));
