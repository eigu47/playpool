import { useState } from "react";

import Button from "@/components/dom/Button";
import Modal from "@/components/dom/Modal";
import { MultiplayerForm } from "@/components/dom/MultiplayerGUI";
import Score from "@/components/dom/Score";
import { BALLS } from "@/constants/BALLS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

const SHOW_BALLS = BALLS.filter((ball) => ball.id !== 0);

export default function IndexGUI() {
  const cueBallStatus = useBallsStore(
    (state) => state.ballsBody[0]?.userData?.status
  );
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setResetCamera = useGameStore((state) => state.setResetCamera);
  const resetPositions = useBallsStore((state) => state.resetPositions);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);

  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <Modal show={cueBallStatus && cueBallStatus !== "play"}>
        <Button
          onClick={() => {
            resetPositions();
            setSelectedBall(0);
          }}
          text="START AGAIN"
        />
      </Modal>

      <Modal show={gameMode === "menu"}>
        <div className="flex w-72 flex-col gap-12">
          {!showInput && (
            <>
              <Button
                onClick={() => {
                  setGameMode("idle", true);
                  setResetCamera(true);
                }}
                text="PLAY ALONE"
              />
              <Button
                onClick={() => {
                  resetPositions();
                }}
                text="RESET TABLE"
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
