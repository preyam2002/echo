"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Mesh } from "three";

const StarNode = ({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
      <Html distanceFactor={10}>
        <div className="text-xs text-cyan-400 whitespace-nowrap pointer-events-none select-none">
          {label}
        </div>
      </Html>
    </mesh>
  );
};

const StarMap = () => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate
          autoRotateSpeed={0.3}
        />

        {/* Placeholder star nodes */}
        <StarNode position={[0, 0, 0]} label="Origin" />
        <StarNode position={[2, 1, -1]} label="Alpha" />
        <StarNode position={[-3, -1, 2]} label="Beta" />

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default StarMap;
