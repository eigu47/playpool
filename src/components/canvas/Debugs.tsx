import React from "react";

import { Debug } from "@react-three/rapier";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Debugs() {
  const { debugOn } = useControls("Debug", { debugOn: false });

  return (
    <>
      {debugOn && (
        <>
          <Debug />
          <Perf position="top-left" />
        </>
      )}
    </>
  );
}
