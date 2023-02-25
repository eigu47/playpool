import { useProgress } from "@react-three/drei";
import { useRouter } from "next/router";

import Button from "@/components/dom/Button";
import { ResetBtn } from "@/components/dom/Button";
import Modal from "@/components/dom/Modal";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";

export default function IndexGUI() {
  const { progress } = useProgress();
  const cueBallState = useBallsStore((state) => state.ballsState[0]?.status);
  const gameMode = useGameStore((state) => state.gameMode);

  const showResetBtn = cueBallState === "pocket" || cueBallState === "out";

  return (
    <>
      <Modal showModal={showResetBtn || gameMode === "menu"}>
        {showResetBtn && <ResetBtn />}
        {progress === 100 && gameMode === "menu" && <IndexMenu />}
      </Modal>
    </>
  );
}

function IndexMenu() {
  const router = useRouter();
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setResetCamera = useGameStore((state) => state.setResetCamera);

  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-100">8 Ball Pool</h1>
        <Button
          onClick={() => {
            setGameMode("idle", true);
            setResetCamera(true);
          }}
          text="TRY ALONE"
        />
        <Button
          onClick={() => router.push("/multiplayer")}
          text="MULTIPLAYER"
        />
      </div>
    </>
  );
}
