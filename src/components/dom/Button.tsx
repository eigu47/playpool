import { useBallsStore } from "@/utils/ballsStore";

type Props = {
  text: string;
  onClick?: () => void;
  type?: "submit";
  disabled?: boolean;
};

export default function Button({
  onClick,
  text,
  type,
  disabled = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="select-none rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700"
    >
      {text}
    </button>
  );
}

export function ResetBtn() {
  const resetPositions = useBallsStore((state) => state.resetPositions);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);

  return (
    <Button
      onClick={() => {
        resetPositions();
        setSelectedBall(0);
      }}
      text="RESET"
    />
  );
}
