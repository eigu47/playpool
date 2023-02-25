import { useProgress } from "@react-three/drei";
import { useRouter } from "next/router";

import Button from "@/components/dom/Button";
import Modal from "@/components/dom/Modal";
import { useGameStore } from "@/utils/gameStore";

export default function IndexGUI() {
  const { progress } = useProgress();
  const gameMode = useGameStore((state) => state.gameMode);

  return (
    <>
      <Modal showModal={gameMode === "menu"}>
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
        <Button onClick={() => router.push("/")} text="TRY ALONE" />
      </div>
    </>
  );
}
