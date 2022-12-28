import { type NextPage } from "next";
import dynamic from "next/dynamic";

import GUI from "@/components/dom/GUI";

const Canvas = dynamic(() => import("@/components/canvas/Canvas"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Canvas />
      <GUI />
    </>
  );
};

export default Home;
