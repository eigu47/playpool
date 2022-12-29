import React from "react";

import { useControls } from "leva";

import styles from "./GUI.module.css";
import { useGameStore } from "@/utils/store";

export default function GUI() {
  const gameMode = useGameStore((state) => state.gameMode);
  const { debugOn } = useControls("Debug", { debugOn: false });

  const resetPositions = useGameStore((state) => state.resetPositions);

  return (
    <div className={styles.GUI}>
      <div className={styles.gameMode}>{gameMode}</div>
      <div>
        <button onClick={resetPositions}>RESET</button>
      </div>
    </div>
  );
}
