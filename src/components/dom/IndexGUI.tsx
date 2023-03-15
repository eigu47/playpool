import { useState } from "react";

import Button from "@/components/dom/Button";
import Modal from "@/components/dom/Modal";
import { MultiplayerForm } from "@/components/dom/MultiplayerGUI";
import Score from "@/components/dom/Score";
import { BALLS } from "@/constants/BALLS";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

const SHOW_BALLS = [
  ...BALLS.filter(({ id }) => id !== 0 && id !== 8),
  BALLS[8],
];

export default function IndexGUI() {
  const ballStatus = useBallsStore((state) =>
    state.ballsBody.flatMap((ball) => ball.userData?.status)
  );
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setResetCamera = useGameStore((state) => state.setResetCamera);
  const resetPositions = useBallsStore((state) => state.resetPositions);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);

  const [showInput, setShowInput] = useState(false);

  console.log(ballStatus.slice(1));

  return (
    <>
      <Modal
        show={
          ballStatus[0] && (ballStatus[0] !== "play" || ballStatus[8] != "play")
        }
      >
        <div className="flex flex-col gap-8 text-3xl text-white/70 font-semibold">
          <p className="text-center ">
            {ballStatus.slice(1).every((status) => status === "pocket")
              ? "You WIN!"
              : "You LOSE!"}
          </p>
          <Button
            onClick={() => {
              resetPositions();
              setSelectedBall(0);
            }}
            text="START AGAIN"
          />
        </div>
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
                text="PLAY"
              />
              <Button
                onClick={() => {
                  resetPositions();
                  setGameMode("idle", true);
                }}
                text="RESET TABLE"
              />
              {/* <Button
                onClick={() => {
                  setShowInput(true);
                }}
                text="MULTIPLAYER (WIP)"
              /> */}
              <a
                href="https://github.com/Eigu47/playpool"
                rel="noreferrer"
                target="_blank"
                className="select-none rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:border-gray-700 disabled:bg-gray-900 disabled:text-gray-500 disabled:hover:text-gray-500"
              >
                <GitHubIcon />
              </a>
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

function GitHubIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-gray-400 h-8 w-8 mx-auto -my-1"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
