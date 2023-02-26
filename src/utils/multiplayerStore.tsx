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
  playersTurn: boolean;
  setUserInfo: (user: UserInfo) => void;
  setPusher: (pusher: Pusher) => void;
  addPlayer: (user: Required<UserInfo>) => void;
  changeTurn: (playerOrSwap: 0 | 1 | "swap") => void;
  updatePlayer: (id: string, status: PlayerStatus) => void;
};

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  userInfo: null,
  playersInfo: [],
  pusher: null,
  playersTurn: false,

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

  changeTurn(playerOrSwap) {
    if (playerOrSwap === "swap") {
      if (get().playersInfo.length !== 2 || get().userInfo?.id == undefined)
        return;

      set(({ playersTurn }) => ({ playersTurn: !playersTurn }));
      return;
    }

    const playerId = get().playersInfo[playerOrSwap]?.id;
    const userId = get().userInfo?.id;

    if (playerId == undefined || userId == undefined) return;

    if (playerId === userId) {
      set({ playersTurn: true });
      return;
    }

    set({ playersTurn: false });
  },

  updatePlayer(id, status) {
    set(({ playersInfo }) => ({
      playersInfo: playersInfo.map((player) =>
        player.id === id ? { ...player, status } : player
      ),
    }));
  },
}));
