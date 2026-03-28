"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Mesh } from "three";
import type { SolarSystem } from "@/types";

const StarNode = ({
  position,
  label,
  security,
  isSelected,
  onClick,
}: {
  position: [number, number, number];
  label: string;
  security?: number;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => {
    if (security === undefined) return "#00ffcc";
    if (security >= 0.7) return "#00ff88";
    if (security >= 0.4) return "#ffcc00";
    return "#ff4444";
  }, [security]);

  const scale = isSelected ? 1.8 : hovered ? 1.4 : 1;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 3 : hovered ? 2.5 : 2}
      />
      {(hovered || isSelected) && (
        <Html distanceFactor={8}>
          <div className="bg-zinc-900/90 border border-zinc-700 rounded-lg px-3 py-2 pointer-events-none select-none whitespace-nowrap">
            <div className="text-xs font-semibold text-cyan-400">{label}</div>
            {security !== undefined && (
              <div className="text-[10px] text-zinc-400">
                Security: {(security * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const ConnectionLine = ({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) => {
  const ref = useRef<Mesh>(null);

  // Use a thin cylinder as a line since <line> has TS issues with R3F
  const { position, rotation, length } = useMemo(() => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ = (start[2] + end[2]) / 2;

    return {
      position: [midX, midY, midZ] as [number, number, number],
      rotation: [
        Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) - Math.PI / 2,
        Math.atan2(dz, dx),
        0,
      ] as [number, number, number],
      length: len,
    };
  }, [start, end]);

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.003, 0.003, length, 4]} />
      <meshBasicMaterial color="#00ffcc" opacity={0.12} transparent />
    </mesh>
  );
};

interface StarMapProps {
  systems?: SolarSystem[];
  selectedSystemId?: string | null;
  onSystemSelect?: (id: string) => void;
}

const StarMapScene = ({
  systems,
  selectedSystemId,
  onSystemSelect,
}: StarMapProps) => {
  const nodes = useMemo(() => {
    if (systems && systems.length > 0) {
      // Normalize positions to fit the scene
      const maxCoord = systems.reduce((max, s) => {
        if (!s.position) return max;
        return Math.max(
          max,
          Math.abs(s.position[0]),
          Math.abs(s.position[1]),
          Math.abs(s.position[2])
        );
      }, 1);
      const scale = 15 / maxCoord;

      return systems.slice(0, 200).map((s) => ({
        id: s.id,
        label: s.name || s.id.slice(0, 8),
        position: (s.position
          ? [
              s.position[0] * scale,
              s.position[1] * scale,
              s.position[2] * scale,
            ]
          : [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5]) as [number, number, number],
        security: s.security,
      }));
    }

    // Placeholder data
    return [
      { id: "origin", label: "Origin", position: [0, 0, 0] as [number, number, number], security: 1.0 },
      { id: "alpha", label: "Alpha Sector", position: [3, 1, -2] as [number, number, number], security: 0.8 },
      { id: "beta", label: "Beta Frontier", position: [-4, -1, 3] as [number, number, number], security: 0.3 },
      { id: "gamma", label: "Gamma Void", position: [1, 3, 4] as [number, number, number], security: 0.1 },
      { id: "delta", label: "Delta Station", position: [-2, 2, -3] as [number, number, number], security: 0.6 },
    ];
  }, [systems]);

  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#00ffcc" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#4444ff" />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        fade
        speed={0.5}
      />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate
        autoRotateSpeed={0.15}
        maxDistance={40}
        minDistance={2}
      />

      {nodes.map((node) => (
        <StarNode
          key={node.id}
          position={node.position}
          label={node.label}
          security={node.security}
          isSelected={selectedSystemId === node.id}
          onClick={() => onSystemSelect?.(node.id)}
        />
      ))}

      {/* Connect nearby nodes */}
      {nodes.slice(0, 50).map((a, i) =>
        nodes
          .slice(i + 1, Math.min(i + 4, nodes.length))
          .map((b) => (
            <ConnectionLine
              key={`${a.id}-${b.id}`}
              start={a.position}
              end={b.position}
            />
          ))
      )}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
      </EffectComposer>
    </>
  );
};

const StarMap = ({ systems, selectedSystemId, onSystemSelect }: StarMapProps) => {
  return (
    <div className="w-full h-full bg-black relative">
      <Canvas camera={{ position: [0, 8, 15], fov: 55 }}>
        <StarMapScene
          systems={systems}
          selectedSystemId={selectedSystemId}
          onSystemSelect={onSystemSelect}
        />
      </Canvas>

      {/* HUD overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/60 font-mono">
          Echo Navigator
        </div>
        <div className="text-[10px] text-zinc-500 font-mono mt-1">
          {systems ? `${systems.length} systems loaded` : "Awaiting data..."}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex gap-4 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400" /> High Sec
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400" /> Med Sec
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" /> Low Sec
        </div>
      </div>
    </div>
  );
};

export default StarMap;
