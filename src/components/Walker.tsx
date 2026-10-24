import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type WalkerProps = TransformProps & {
  coatColor?: string;
  playing?: boolean;
};

export function Walker({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  coatColor = palette.walkerCoat,
  playing = true,
}: WalkerProps) {
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const phase = useRef(0);

  useFrame((_, delta) => {
    if (!playing) return;
    phase.current += delta * 6;
    const swing = Math.sin(phase.current) * 0.45;
    if (leftArm.current) leftArm.current.rotation.x = swing;
    if (rightArm.current) rightArm.current.rotation.x = -swing;
    if (leftLeg.current) leftLeg.current.rotation.x = -swing;
    if (rightLeg.current) rightLeg.current.rotation.x = swing;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.12, 0.22, 0.08]} />
        <meshLambertMaterial color={coatColor} flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshLambertMaterial color="#e6c8a8" flatShading />
      </mesh>
      <mesh ref={rightArm} position={[0.08, 0.32, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.035, 0.16, 0.035]} />
        <meshLambertMaterial color={coatColor} flatShading />
      </mesh>
      <mesh ref={leftArm} position={[-0.08, 0.32, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.035, 0.16, 0.035]} />
        <meshLambertMaterial color={coatColor} flatShading />
      </mesh>
      <mesh ref={rightLeg} position={[0.035, 0.14, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshLambertMaterial color="#4a3c34" flatShading />
      </mesh>
      <mesh ref={leftLeg} position={[-0.035, 0.14, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshLambertMaterial color="#4a3c34" flatShading />
      </mesh>
    </group>
  );
}
