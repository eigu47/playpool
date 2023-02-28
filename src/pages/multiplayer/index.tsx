import { type NextPage } from "next";
import dynamic from "next/dynamic";
import type { Vector3 } from "three";

import GUI from "@/components/dom/GUI";
import MultiGUI from "@/components/dom/MultiGUI";
import MultiScore from "@/components/dom/MultiScore";
import { useBallsStore } from "@/utils/ballsStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const Home: NextPage = () => {
  const getBallsPositions = useBallsStore((state) => state.getBallsPositions);

  async function handleEndShot(forceVector: Vector3) {
    const userId = useMultiplayerStore.getState().userInfo?.id;
    if (userId == undefined) return;

    fetch("/api/pusher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ forceVector, userId }),
    });
  }

  async function handleEndTurn() {
    const userId = useMultiplayerStore.getState().userInfo?.id;
    if (userId == undefined) return;

    const positions = getBallsPositions();

    fetch("/api/pusher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, positions }),
    });
  }

  return (
    <>
      <Scene handleEndTurn={handleEndTurn} handleEndShot={handleEndShot} />

      <GUI>
        <MultiGUI />
        <MultiScore />
      </GUI>
    </>
  );
};

export default Home;
