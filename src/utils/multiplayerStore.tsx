import type Pusher from "pusher-js";
import create from "zustand";

import type { BallStatus } from "@/utils/ballsStore";

type UserInfo = {
  id?: string;
  username: string;
};

export type PlayerStatus = "waiting" | "playing" | "watching" | "disconnected";
export type PlayerInfo = {
  id: string;
  username: string;
  score: BallScore[];
  status: PlayerStatus;
};

export type BallScore = {
  id: number;
  status: BallStatus;
};

type MultiplayerStore = {
  userInfo: UserInfo | null;
  playersInfo: PlayerInfo[];
  pusher: Pusher | null;
  playerTurn: 0 | 1 | null;
  setUserInfo: (user: UserInfo) => void;
  setPusher: (pusher: Pusher) => void;
  addPlayer: (user: Required<UserInfo>) => void;
  setTurn: (playerOrSwap: 0 | 1 | "swap") => void;
  isUserTurn: () => boolean;
  updatePlayer: (id: string, status: PlayerStatus) => void;
};

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  userInfo: null,
  playersInfo: [],
  pusher: null,
  playerTurn: null,

  setUserInfo({ id, username }) {
    set({ userInfo: { username, id } });
  },

  setPusher(pusher) {
    set({ pusher });
  },

  addPlayer({ id, username }) {
    set(({ playersInfo }) => ({
      playersInfo: [
        ...playersInfo,
        { id, username, score: [], status: "waiting" },
      ],
    }));
  },

  isUserTurn() {
    const playerTurn = get().playerTurn;
    const userInfoId = get().userInfo?.id;
    if (playerTurn == null || userInfoId == undefined) return false;

    const playerTurnId = get().playersInfo[playerTurn]?.id;
    if (playerTurnId == undefined) return false;

    if (playerTurnId === userInfoId) return true;
    return false;
  },

  setTurn(playerOrSwap) {
    if (
      get().playersInfo.length < 2 ||
      get().userInfo?.id == undefined ||
      get().playerTurn != null
    )
      return;

    if (playerOrSwap === "swap") {
      set(({ playerTurn }) => ({ playerTurn: playerTurn === 0 ? 1 : 0 }));
      return;
    }

    set({ playerTurn: playerOrSwap });
  },

  updatePlayer(id, status) {
    set(({ playersInfo }) => ({
      playersInfo: playersInfo.map((player) =>
        player.id === id ? { ...player, status } : player
      ),
    }));
  },
}));
