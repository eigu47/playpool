type Props = {
  onClick: () => void;
  text: string;
};

export default function Button({ onClick, text }: Props) {
  return (
    <button
      onClick={onClick}
      className="select-none rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700"
    >
      {text}
    </button>
  );
}

import { useBallsStore } from "@/utils/ballsStore";

export function ResetBtn() {
  const resetPositions = useBallsStore((state) => state.resetPositions);

  return <Button onClick={() => resetPositions()} text="RESET" />;
}
