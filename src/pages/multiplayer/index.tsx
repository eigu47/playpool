import { type NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
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
  );
};

export default Home;
