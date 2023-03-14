import { type RapierRigidBody, vec3 } from "@react-three/rapier";
import { Vector3 } from "three";
import { create } from "zustand";

import { getInitialPositions, type BALLS } from "@/constants/BALLS";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const ZeroVector3 = new Vector3(0, 0, 0);

export type BallId = typeof BALLS[number]["id"];
export type BallStatus = "play" | "pocket" | "out";
export type RigidBodyData = RapierRigidBody & {
  userData: { id: BallId; status: BallStatus };
};

type BallsStore = {
  selectedBall: RigidBodyData | null;
  ballsBody: RigidBodyData[];
  setSelectedBall: (id: BallId | null, focus?: boolean) => void;
  addBallBody: (body: RapierRigidBody | null, id: BallId) => void;
  setBallStatus: (status: BallStatus, id: BallId, force?: boolean) => void;
  resetPositions: (positions?: Vector3[]) => void;
  getBallsPositions: () => Vector3[];
};

export const useBallsStore = create<BallsStore>((set, get) => ({
  selectedBall: null,
  ballsState: [],
  ballsBody: [],

  setSelectedBall(id, focus = false) {
    if (id == null) return set({ selectedBall: null });

    if (get().ballsBody[id]?.userData?.status !== "play") return;

    set(({ ballsBody }) => ({ selectedBall: ballsBody[id] }));

    if (focus === true && id === 0) {
      if (
        useMultiplayerStore.getState().userInfo?.username &&
        useMultiplayerStore.getState().isUserTurn() === false
      )
        return;
      useGameStore.getState().setGameMode("shot");
      return;
    }

    if (useGameStore.getState().gameMode === "shot")
      useGameStore.getState().setGameMode("idle");
  },

  addBallBody(body, id) {
    if (body == null) return;

    set((state) => {
      const ballsBody = [...state.ballsBody];
      ballsBody[id] = body as RigidBodyData;
      return { ballsBody };
    });
  },

  setBallStatus(status, id, force = false) {
    if (force === false && get().ballsBody[id]?.userData.status !== "play")
      return;

    set((state) => {
      const ballsBody = [...state.ballsBody];
      const ballBody = ballsBody[id];
      if (ballBody) ballBody.userData.status = status;

      return { ballsBody };
    });
  },

  resetPositions(positions = getInitialPositions()) {
    set((state) => {
      const ballsBody = [...state.ballsBody];

      ballsBody.forEach((body, index) => {
        const position = positions[index];
        if (body == undefined || position == undefined) return;

        body.setLinvel(ZeroVector3, false);
        body.setAngvel(ZeroVector3, false);
        body.setTranslation(position, false);
        body.userData.status = "play";
      });
      return { ballsBody };
    });

    useGameStore.getState().setResetCamera(true);
  },

  getBallsPositions() {
    return get().ballsBody.map((body) => vec3(body?.translation()));
  },
}));
