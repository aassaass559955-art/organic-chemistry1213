"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const ELEMENT_COLORS = {
  C: "#00B894",
  H: "#7d8fb0",
  O: "#0984E3",
  N: "#6C5CE7",
} as const;

type AtomSpec = { pos: THREE.Vector3; color: string; radius: number };
type BondSpec = { mid: THREE.Vector3; quat: THREE.Quaternion; length: number; a: string; b: string };

const UP = new THREE.Vector3(0, 1, 0);

function bondBetween(a: THREE.Vector3, b: THREE.Vector3, aLabel: string, bLabel: string): BondSpec {
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  return { mid, quat, length, a: aLabel, b: bLabel };
}

function Bond({ bond }: { bond: BondSpec }) {
  return (
    <mesh position={bond.mid} quaternion={bond.quat}>
      <cylinderGeometry args={[0.045, 0.045, bond.length, 10]} />
      <meshStandardMaterial color="#3d5578" roughness={0.35} metalness={0.4} />
    </mesh>
  );
}

function Atom({ spec }: { spec: AtomSpec }) {
  return (
    <group position={spec.pos}>
      <mesh>
        <sphereGeometry args={[spec.radius, 28, 28]} />
        <meshStandardMaterial
          color={spec.color}
          roughness={0.22}
          metalness={0.2}
          emissive={spec.color}
          emissiveIntensity={0.28}
        />
      </mesh>
      <mesh scale={spec.radius * 1.9}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={spec.color} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function hexPositions(radius: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  });
}

export function BenzeneMolecule({ radius = 1.1 }: { radius?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.z += dt * 0.25;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.7;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });
  const carbons = useMemo(() => hexPositions(radius), [radius]);
  const hydrogens = useMemo(() => hexPositions(radius * 1.78), [radius]);
  return (
    <group ref={group} rotation={[0.5, 0.3, 0]}>
      {carbons.map((p, i) => (
        <Atom key={`c${i}`} spec={{ pos: p, color: ELEMENT_COLORS.C, radius: 0.3 }} />
      ))}
      {hydrogens.map((p, i) => (
        <Atom key={`h${i}`} spec={{ pos: p, color: ELEMENT_COLORS.H, radius: 0.16 }} />
      ))}
      {carbons.map((p, i) => (
        <Bond key={`cb${i}`} bond={bondBetween(p, carbons[(i + 1) % 6], "C", "C")} />
      ))}
      {carbons.map((p, i) => (
        <Bond key={`ch${i}`} bond={bondBetween(p, hydrogens[i], "C", "H")} />
      ))}
      <mesh>
        <torusGeometry args={[radius * 0.62, 0.02, 12, 64]} />
        <meshBasicMaterial color="#6C5CE7" transparent opacity={0.7} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.62, 0.055, 12, 64]} />
        <meshBasicMaterial color="#6C5CE7" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

export function MethaneMolecule() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.4;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7 + 2) * 0.15;
  });
  const hs = useMemo(
    () =>
      [
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 1, -1),
        new THREE.Vector3(-1, -1, 1),
      ].map((v) => v.normalize().multiplyScalar(1.05)),
    []
  );
  return (
    <group ref={group}>
      <Atom spec={{ pos: new THREE.Vector3(0, 0, 0), color: ELEMENT_COLORS.C, radius: 0.42 }} />
      {hs.map((p, i) => (
        <group key={i}>
          <Atom spec={{ pos: p, color: ELEMENT_COLORS.H, radius: 0.2 }} />
          <Bond bond={bondBetween(new THREE.Vector3(0, 0, 0), p, "C", "H")} />
        </group>
      ))}
    </group>
  );
}

type Network = { atoms: AtomSpec[]; bonds: BondSpec[] };

function makeNetwork(count: number, spread: [number, number, number]): Network {
  const labels = ["C", "C", "C", "C", "O", "N", "H"] as const;
  const atoms: AtomSpec[] = [];
  for (let i = 0; i < count; i++) {
    const label = labels[Math.floor(Math.random() * labels.length)];
    atoms.push({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * spread[0],
        (Math.random() - 0.5) * spread[1],
        (Math.random() - 0.5) * spread[2]
      ),
      color: ELEMENT_COLORS[label],
      radius: label === "H" ? 0.12 : label === "C" ? 0.22 : 0.2,
    });
  }
  const bonds: BondSpec[] = [];
  const maxDist = 2.1;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const d = atoms[i].pos.distanceTo(atoms[j].pos);
      if (d < maxDist && Math.random() > 0.35) {
        bonds.push(bondBetween(atoms[i].pos, atoms[j].pos, "A", "B"));
      }
    }
  }
  return { atoms, bonds };
}

function DriftingNetwork({ count = 26, spread = [16, 9, 6] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const network = useMemo(() => makeNetwork(count, spread), [count, spread]);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.045;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * -0.12,
      0.04
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * 0.06,
      0.04
    );
  });
  return (
    <group ref={group}>
      {network.atoms.map((a, i) => (
        <Atom key={i} spec={a} />
      ))}
      {network.bonds.map((b, i) => (
        <Bond key={i} bond={b} />
      ))}
    </group>
  );
}

function StarDust({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 26;
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#00B894"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.6, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, state.pointer.y * 0.4, 0.05);
  });
  return <group ref={group}>{children}</group>;
}

export default function CanvasScene({ mini }: { mini?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, mini ? 7 : 10], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.65} />
      <pointLight position={[8, 6, 6]} intensity={40} color="#00B894" />
      <pointLight position={[-8, -4, 4]} intensity={30} color="#0984E3" />
      <pointLight position={[0, 6, -6]} intensity={24} color="#6C5CE7" />
      <Suspense fallback={null}>
        <Rig>
          <DriftingNetwork count={mini ? 14 : 30} spread={mini ? [10, 6, 4] : [17, 9.5, 6]} />
          {!mini && (
            <>
              <group position={[4.6, 1.4, -2]} scale={0.9}>
                <BenzeneMolecule />
              </group>
              <group position={[-5.4, -1.8, -1]} scale={0.85}>
                <MethaneMolecule />
              </group>
              <group position={[-4.2, 2.6, -3]} scale={0.55}>
                <BenzeneMolecule />
              </group>
            </>
          )}
          <StarDust count={mini ? 220 : 520} />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
