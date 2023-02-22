import { type NextPage } from "next";
import dynamic from "next/dynamic";

import Modal from "@/components/dom/Modal";
import ResetBtn from "@/components/dom/ResetBtn";
import { useBallsStore } from "@/utils/ballsStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Scene />
      <IndexGUI />
    </>
  );
};

export default Home;

function IndexGUI() {
  const cueBallState = useBallsStore((state) => state.ballsData[0]?.state);

  return (
    <>
      <Modal showModal={cueBallState === "pocket"}>
        <ResetBtn />
      </Modal>
    </>
  );
}
