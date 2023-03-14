import { type NextPage } from "next";
import dynamic from "next/dynamic";

import GUI from "@/components/dom/GUI";
import IndexGUI from "@/components/dom/IndexGUI";
import { useGameStore } from "@/utils/gameStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});
// const TestScene = dynamic(() => import("@/components/canvas/TestScene"), {
//   ssr: false,
// });

const Home: NextPage = () => {
  const setGameMode = useGameStore((state) => state.setGameMode);

  return (
    <>
      <Scene handleEndTurn={() => setGameMode("shot")} />
      {/* <TestScene /> */}
      <GUI>
        <IndexGUI />
      </GUI>
    </>
  );
};

export default Home;
