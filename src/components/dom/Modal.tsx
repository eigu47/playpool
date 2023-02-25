import React from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  children?: React.ReactNode;
  showModal?: boolean;
  duration?: number;
  className?: string;
};

export default function Modal({
  children,
  showModal = false,
  duration = 500,
  className,
}: Props) {
  const [modalRef] = useAutoAnimate({ duration });

  return (
    <div ref={modalRef}>
      {showModal && (
        <div
          className={`fixed top-0 flex h-full w-full items-center justify-center bg-[#232323]/30 backdrop-blur-sm ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
