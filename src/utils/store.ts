import { type Vector3 } from "three";
import create from "zustand";

type StoreType = {
  cameraCenter: null | Vector3;
  setCameraCenter: (center: null | Vector3) => void;
};

export const useStore = create<StoreType>((set) => ({
  cameraCenter: null,

  setCameraCenter: (center) => set({ cameraCenter: center }),
}));
