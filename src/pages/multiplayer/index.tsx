import { type NextPage } from "next";
import dynamic from "next/dynamic";

import GUI from "@/components/dom/GUI";
import MultiGUI from "@/components/dom/MultiGUI";
import MultiScore from "@/components/dom/MultiScore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const Home: NextPage = () => {
 return (
    <>
      <Scene />

      <GUI>
        <MultiGUI />
        <MultiScore />
      </GUI>
    </>
  );
};

export default Home;
