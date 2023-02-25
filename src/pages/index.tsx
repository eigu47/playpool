import { type NextPage } from "next";
import dynamic from "next/dynamic";

import IndexGUI from "@/components/dom/IndexGUI";
import Score from "@/components/dom/Score";
import { BALLS } from "@/constants/BALLS";
import { useGameStore } from "@/utils/gameStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const SHOW_BALLS = BALLS.filter((ball) => ball.id !== 0);

const Home: NextPage = () => {
  const setGameMode = useGameStore((state) => state.setGameMode);

  return (
    <>
      <Scene handleEndTurn={() => setGameMode("shot")} />
      <IndexGUI />
      <div className="fixed top-0 left-0 m-3 flex">
        <Score showBalls={SHOW_BALLS} />
      </div>
    </>
  );
};

export default Home;
