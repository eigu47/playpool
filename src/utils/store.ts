import { type Vector3 } from "three";
import create from "zustand";

type GameModes = "idle" | "shot" | "pause";

type StoreType = {
  cameraCenter: null | Vector3;
  gameMode: GameModes;
  setCameraCenter: (center: null | Vector3) => void;
  setGameMode: (mode: GameModes) => void;
};

export const useCamera = create<StoreType>((set) => ({
  cameraCenter: null,
  gameMode: "idle",

  setCameraCenter: (center) => set({ cameraCenter: center }),
  setGameMode: (mode) => set({ gameMode: mode }),
}));
