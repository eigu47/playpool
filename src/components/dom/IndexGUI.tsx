import { useState } from "react";

import Button from "@/components/dom/Button";
import { ResetBtn } from "@/components/dom/Button";
import Modal from "@/components/dom/Modal";
import { MultiplayerForm } from "@/components/dom/MultiGUI";
import Score from "@/components/dom/Score";
import { BALLS } from "@/constants/BALLS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

const SHOW_BALLS = BALLS.filter((ball) => ball.id !== 0);

export default function IndexGUI() {
  const cueBallState = useBallsStore((state) => state.ballsState[0]?.status);
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setResetCamera = useGameStore((state) => state.setResetCamera);

  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <Modal show={cueBallState === "pocket" || cueBallState === "out"}>
        <ResetBtn />
      </Modal>

      <Modal show={gameMode === "menu"}>
        <div className="flex w-72 flex-col gap-6">
          {!showInput && (
            <>
              <Button
                onClick={() => {
                  setGameMode("idle", true);
                  setResetCamera(true);
                }}
                text="TRY ALONE"
              />
              <Button
                onClick={() => {
                  setShowInput(true);
                }}
                text="MULTIPLAYER (WIP)"
              />
            </>
          )}

          {showInput && (
            <>
              <MultiplayerForm />
              <Button
                onClick={() => {
                  setShowInput(false);
                }}
                text="BACK"
              />
            </>
          )}
        </div>
      </Modal>

      <div className="fixed top-0 left-0 m-3 flex">
        <Score balls={SHOW_BALLS} />
      </div>
    </>
  );
}
