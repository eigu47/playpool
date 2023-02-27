import create from "zustand";

type MultiplayerStore = {
  userInfo: UserInfo | null;
  playersInfo: PlayerInfo[];
  playerTurn: 0 | 1 | null;
  setUserInfo: (user: UserInfo) => void;
  addPlayer: (user: Required<UserInfo>) => void;
  setTurn: (playerOrSwap: 0 | 1 | "swap") => void;
  isUserTurn: () => boolean;
  updatePlayer: (
    id: string,
    ballTypeOrConnection: PlayerBallType | boolean
  ) => void;
};

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  userInfo: null,
  playersInfo: [],
  playerTurn: null,

  setUserInfo({ id, username }) {
    set({ userInfo: { id, username } });
  },

  addPlayer({ id, username }) {
    set(({ playersInfo }) => ({
      playersInfo: [
        ...playersInfo,
        { id, username, connected: true, ballType: null },
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
}));

type UserInfo = {
  id?: string;
  username: string;
};

export type PlayerBallType = "stripe" | "solid" | null;
export type PlayerInfo = {
  id: string;
  username: string;
  connected: boolean;
  ballType: PlayerBallType;
};
