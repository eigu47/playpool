import { type NextPage } from "next";
import dynamic from "next/dynamic";
import type { Vector3 } from "three";

import GUI from "@/components/dom/GUI";
import MultiplayerGUI from "@/components/dom/MultiplayerGUI";
import MultiplayerScore from "@/components/dom/MultiplayerScore";
import { useBallsStore } from "@/utils/ballsStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const Home: NextPage = () => {
  const getBallsPositions = useBallsStore((state) => state.getBallsPositions);

  async function handleEndShot(forceVector: Vector3) {
    fetch("/api/pusher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        forceVector,
        userId: useMultiplayerStore.getState().userInfo?.id,
      }),
    });
  }

  async function handleEndTurn() {
    if (useMultiplayerStore.getState().isUserTurn() === false) return;

    fetch("/api/pusher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        positions: getBallsPositions(),
        userId: useMultiplayerStore.getState().userInfo?.id,
      }),
    });
  }

  return (
    <>
      <Scene handleEndTurn={handleEndTurn} handleEndShot={handleEndShot} />

      <GUI>
        <MultiplayerGUI />
        <MultiplayerScore />
      </GUI>
    </>
  );
};

export default Home;
