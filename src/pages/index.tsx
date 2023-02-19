import { type NextPage } from "next";
import dynamic from "next/dynamic";

import Modal from "@/components/dom/Modal";
import ResetBtn from "@/components/dom/ResetBtn";
import { useGameStore } from "@/utils/store";

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
  const ball0OnPlay = useGameStore(
    (state) => state.ballsState[0]?.body?.isOnPlay
  );

  return (
    <>
      <Modal showModal={ball0OnPlay == undefined ? false : !ball0OnPlay}>
        <ResetBtn />
      </Modal>
    </>
  );
}
