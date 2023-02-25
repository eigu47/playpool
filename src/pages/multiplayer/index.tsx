import { type NextPage } from "next";
import dynamic from "next/dynamic";

import GUI from "@/components/dom/GUI";
import MultiGUI from "@/components/dom/MultiGUI";
import Score from "@/components/dom/Score";
import { BALLS } from "@/constants/BALLS";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const SOLID_BALLS = BALLS.filter((ball) => ball.type === "solid");
const STRIPE_BALLS = BALLS.filter((ball) => ball.type === "stripe");

const Home: NextPage = () => {
  return (
    <>
      <Scene />

      <GUI>
        <MultiGUI />
        <div className="fixed top-0 left-0 m-3 flex flex-col gap-3">
          <Score showBalls={SOLID_BALLS} text="YOUR SCORE" />
          <Score showBalls={STRIPE_BALLS} text="OPPONENT SCORE" />
        </div>
      </GUI>
    </>
  );
};

export default Home;
