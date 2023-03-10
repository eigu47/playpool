import type { RapierRigidBody } from "@react-three/rapier";
import create from "zustand";

import type { BallId, RigidBodyData } from "@/utils/ballsStore";

type MultiplayerStore = {
  userInfo: UserInfo | null;
  playersInfo: PlayerInfo[];
  playerTurn: 0 | 1 | null;
  hideDummyScene: boolean;
  dummyBalls: RigidBodyData[];
  setUserInfo: ({ id, username, isPlaying }: Partial<UserInfo>) => void;
  addPlayer: (id: string, username: string) => void;
  setTurn: (playerOrSwap: 0 | 1 | "swap") => void;
  isUserTurn: () => boolean;
  updatePlayer: (
    id: string,
    ballTypeOrConnection: PlayerBallType | boolean
  ) => void;
  addDummyBall: (body: RapierRigidBody | null, id: BallId) => void;
};

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  userInfo: null,
  playersInfo: [],
  playerTurn: null,
  hideDummyScene: true,
  dummyBalls: [],

  setUserInfo({
    id = get().userInfo?.id,
    username = get().userInfo?.username,
    isPlaying = false,
  }) {
    if (username == undefined) return;

    set({ userInfo: { id, username, isPlaying } });
  },

  addPlayer(id, username) {
    set(({ playersInfo }) => ({
      playersInfo: [
        { id, username, connected: true, ballType: null },
        ...playersInfo,
      ],
    }));
  },

  isUserTurn() {
    const playerTurn = get().playerTurn;
    if (playerTurn == null) return false;

    const playerTurnId = get().playersInfo[playerTurn]?.id;
    if (playerTurnId == undefined) return false;

    const userInfoId = get().userInfo?.id;
    if (playerTurnId === userInfoId) return true;
    return false;
  },

  setTurn(playerOrSwap) {
    if (get().playersInfo.length < 2 || get().playerTurn != null) return;

    if (playerOrSwap === "swap") {
      set(({ playerTurn }) => ({ playerTurn: playerTurn === 0 ? 1 : 0 }));
      return;
    }

    set({ playerTurn: playerOrSwap });
  },

  updatePlayer(id, ballTypeOrConnection) {
    if (typeof ballTypeOrConnection === "boolean") {
      set(({ playersInfo }) => ({
        playersInfo: playersInfo.map((player) =>
          player.id === id
            ? { ...player, connected: ballTypeOrConnection }
            : player
        ),
      }));
      return;
    }

    set(({ playersInfo }) => ({
      playersInfo: playersInfo.map((player) =>
        player.id === id
          ? { ...player, ballType: ballTypeOrConnection }
          : player
      ),
    }));
  },

  addDummyBall(body, id) {
    if (body == null) return;

    set((state) => {
      const dummyBalls = [...state.dummyBalls];
      dummyBalls[id] = body as RigidBodyData;
      return { dummyBalls };
    });
  },
}));

type UserInfo = {
  id?: string;
  username: string;
  isPlaying: boolean;
};

export type PlayerBallType = "stripe" | "solid" | null;
export type PlayerInfo = {
  id: string;
  username: string;
  connected: boolean;
  ballType: PlayerBallType;
};
