import { type Vector3 } from "three";
import create from "zustand";

type StoreType = {
  cameraCenter: null | Vector3;
  shotMode: boolean;
  setCameraCenter: (center: null | Vector3) => void;
  setShotMode: (center: boolean) => void;
};

export const useCamera = create<StoreType>((set) => ({
  cameraCenter: null,
  shotMode: false,

  setCameraCenter: (center) => set({ cameraCenter: center }),
  setShotMode: (mode) => set({ shotMode: mode }),
}));
