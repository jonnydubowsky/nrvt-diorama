import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type CyclistProps = TransformProps & {
  jerseyColor?: string;
  playing?: boolean;
};

export function Cyclist({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  jerseyColor = palette.jerseyTeal,
  playing = true,
}: CyclistProps) {
  const front = useRef<THREE.Mesh>(null);
  const rear = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!playing) return;
    const spin = delta * 10;
    if (front.current) front.current.rotation.z += spin;
    if (rear.current) rear.current.rotation.z += spin;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={front} position={[0.16, 0.12, 0]} castShadow>
        <torusGeometry args={[0.1, 0.018, 6, 10]} />
        <meshLambertMaterial color="#2c3034" flatShading />
      </mesh>
      <mesh ref={rear} position={[-0.16, 0.12, 0]} castShadow>
        <torusGeometry args={[0.1, 0.018, 6, 10]} />
        <meshLambertMaterial color="#2c3034" flatShading />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.28, 0.03, 0.03]} />
        <meshLambertMaterial color="#4a4e52" flatShading />
      </mesh>
      <mesh position={[0.02, 0.28, 0]} rotation={[0.15, 0, 0.1]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.09]} />
        <meshLambertMaterial color={jerseyColor} flatShading />
      </mesh>
      <mesh position={[0.02, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.065, 6, 6]} />
        <meshLambertMaterial color="#e6c8a8" flatShading />
      </mesh>
      <mesh position={[0.12, 0.24, 0.02]} rotation={[0, 0, -0.8]}>
        <boxGeometry args={[0.04, 0.14, 0.04]} />
        <meshLambertMaterial color={jerseyColor} flatShading />
      </mesh>
      <mesh position={[-0.02, 0.18, 0]} rotation={[0.4, 0, 0.6]}>
        <boxGeometry args={[0.04, 0.13, 0.04]} />
        <meshLambertMaterial color="#3a4550" flatShading />
      </mesh>
    </group>
  );
}
