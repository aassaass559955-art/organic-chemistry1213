"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BenzeneMolecule, MethaneMolecule } from "./canvas-scene";

export default function MiniMolecule({ kind }: { kind: "benzene" | "methane" | "network" }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[6, 6, 6]} intensity={32} color="#00B894" />
      <pointLight position={[-6, -4, 3]} intensity={22} color="#0984E3" />
      <Suspense fallback={null}>
        {kind === "benzene" && <BenzeneMolecule />}
        {kind === "methane" && <MethaneMolecule />}
        {kind === "network" && (
          <group scale={0.9}>
            <BenzeneMolecule />
          </group>
        )}
      </Suspense>
    </Canvas>
  );
}
