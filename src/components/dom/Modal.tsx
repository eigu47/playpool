import React from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  children?: React.ReactNode;
  show?: boolean;
  duration?: number;
};

export default function Modal({
  children,
  show = false,
  duration = 500,
}: Props) {
  const [modalRef] = useAutoAnimate({ duration });

  return (
    <div ref={modalRef}>
      {show && (
        <div className="fixed top-0 flex h-full w-full items-center justify-center bg-[#232323]/30 backdrop-blur-sm">
          {children}
        </div>
      )}
    </div>
  );
}
