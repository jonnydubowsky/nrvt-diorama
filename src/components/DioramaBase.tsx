import { useMemo } from "react";
import { Billboard } from "@react-three/drei";
import { BASE } from "../lib/curves";
import { makeLabelTexture } from "../lib/geometry";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type DioramaBaseProps = TransformProps & {
  width?: number;
  length?: number;
  soilDepth?: number;
  grassColor?: string;
  showCutaway?: boolean;
};

export function DioramaBase({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = BASE.width,
  length = BASE.length,
  soilDepth = BASE.soilDepth,
  grassColor = palette.grass,
  showCutaway = true,
}: DioramaBaseProps) {
  const northMark = useMemo(() => makeLabelTexture("N", "Danbury"), []);

  const layers = showCutaway
    ? [
        { color: palette.soilSod, height: soilDepth * 0.1, y: -soilDepth * 0.05 },
        { color: palette.topsoil, height: soilDepth * 0.22, y: -soilDepth * 0.21 },
        { color: palette.subsoil, height: soilDepth * 0.22, y: -soilDepth * 0.43 },
        { color: palette.clay, height: soilDepth * 0.2, y: -soilDepth * 0.64 },
        { color: palette.till, height: soilDepth * 0.16, y: -soilDepth * 0.82 },
        { color: palette.bedrock, height: soilDepth * 0.18, y: -soilDepth * 0.99 },
      ]
    : [{ color: palette.topsoil, height: soilDepth, y: -soilDepth / 2 }];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, length]} />
        <meshLambertMaterial color={grassColor} flatShading />
      </mesh>

      {layers.map((layer) => (
        <mesh key={layer.color} position={[0, layer.y, 0]} receiveShadow>
          <boxGeometry args={[width, layer.height, length]} />
          <meshLambertMaterial color={layer.color} flatShading />
        </mesh>
      ))}

      <mesh position={[0, -soilDepth - 0.06, 0]}>
        <boxGeometry args={[width + 0.35, 0.12, length + 0.35]} />
        <meshLambertMaterial color="#6b5344" flatShading />
      </mesh>

      <mesh position={[-width / 2 + 0.35, 0.08, length / 2 - 0.55]}>
        <boxGeometry args={[1.1, 0.08, 0.7]} />
        <meshLambertMaterial color="#efe6d6" flatShading />
      </mesh>
      <mesh position={[-width / 2 + 0.35, 0.28, length / 2 - 0.55]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshLambertMaterial color="#c9b59a" flatShading />
      </mesh>
      <Billboard position={[-width / 2 + 0.35, 0.72, length / 2 - 0.55]} follow>
        <mesh>
          <planeGeometry args={[0.7, 0.22]} />
          <meshBasicMaterial map={northMark} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}
