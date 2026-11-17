"use client";

import dynamic from "next/dynamic";

const CanvasScene = dynamic(() => import("./canvas-scene"), { ssr: false });

export function MoleculeBackground({ mini }: { mini?: boolean }) {
  return (
    <div className={mini ? "relative h-full w-full" : "absolute inset-0"}>
      <CanvasScene mini={mini} />
    </div>
  );
}

export function MiniMolecule({ kind }: { kind: "benzene" | "methane" | "network" }) {
  const Mini = dynamic(() => import("./mini-molecule"), { ssr: false });
  return (
    <div className="relative h-full w-full">
      <Mini kind={kind} />
    </div>
  );
}
