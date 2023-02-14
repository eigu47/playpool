import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Scene />
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
        <button
          className=""
          onClick={() => {
            router.push("/");
          }}
        >
          BACK
        </button>
      </div>
    </>
  );
};

export default Home;
