import { type NextPage } from "next";

import Canvas from "@/components/canvas/Canvas";
import GUI from "@/components/dom/GUI";

const Home: NextPage = () => {
  return (
    <>
      <Canvas />
      <GUI />
    </>
  );
};

export default Home;
