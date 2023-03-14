type Props = {
  text?: string;
  onClick?: () => void;
  type?: "submit";
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function Button({
  onClick,
  text,
  type,
  disabled = false,
  children,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="select-none rounded-lg border border-gray-600 bg-gray-800 py-2 px-5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:border-gray-700 disabled:bg-gray-900 disabled:text-gray-500 disabled:hover:text-gray-500"
    >
      {text}
      {children}
    </button>
  );
}
