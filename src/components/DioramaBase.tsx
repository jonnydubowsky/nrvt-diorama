import { Html } from "@react-three/drei";
import { BASE } from "../lib/curves";
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
  const layers = showCutaway
    ? [
        { color: "#6a8a48", height: soilDepth * 0.12, y: -soilDepth * 0.06 },
        { color: "#a05630", height: soilDepth * 0.2, y: -soilDepth * 0.22 },
        { color: "#d4a86a", height: soilDepth * 0.2, y: -soilDepth * 0.42 },
        { color: "#e08a4a", height: soilDepth * 0.18, y: -soilDepth * 0.61 },
        { color: "#7a4030", height: soilDepth * 0.16, y: -soilDepth * 0.78 },
        { color: "#6e6a64", height: soilDepth * 0.2, y: -soilDepth * 0.96 },
      ]
    : [{ color: palette.topsoil, height: soilDepth, y: -soilDepth / 2 }];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width - 0.28, 0.05, length - 0.12]} />
        <meshLambertMaterial color={grassColor} flatShading />
      </mesh>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[width, 0.03, length]} />
        <meshLambertMaterial color={palette.topsoil} flatShading />
      </mesh>

      {layers.map((layer, index) => (
        <mesh key={layer.color} position={[0, layer.y, 0]} receiveShadow>
          <boxGeometry args={[width - index * 0.1, layer.height, length]} />
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
      <Html
        position={[-width / 2 + 0.35, 0.62, length / 2 - 0.55]}
        center
        distanceFactor={22}
        style={{ pointerEvents: "none" }}
      >
        <div className="town-label town-label--small">
          <strong>N</strong>
          <span>Danbury</span>
        </div>
      </Html>
    </group>
  );
}
