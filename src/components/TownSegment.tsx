import { useMemo } from "react";
import { Billboard } from "@react-three/drei";
import { makeLabelTexture } from "../lib/geometry";
import { palette } from "../lib/palette";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type TownSegmentProps = TransformProps & {
  name?: string;
  subtitle?: string;
  seed?: number;
  buildingCount?: number;
  wallColor?: string;
  roofColor?: string;
};

function ClapboardBuilding({
  offset,
  width,
  depth,
  height,
  yaw,
  wallColor,
  roofColor,
}: {
  offset: [number, number, number];
  width: number;
  depth: number;
  height: number;
  yaw: number;
  wallColor: string;
  roofColor: string;
}) {
  return (
    <group position={offset} rotation={[0, yaw, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color={wallColor} flatShading />
      </mesh>
      <mesh
        position={[0, height + 0.16, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <coneGeometry args={[Math.max(width, depth) * 0.78, 0.32, 4]} />
        <meshLambertMaterial color={roofColor} flatShading />
      </mesh>
      <mesh position={[width * 0.22, height + 0.22, depth * 0.12]}>
        <boxGeometry args={[0.08, 0.16, 0.08]} />
        <meshLambertMaterial color="#8a6a58" flatShading />
      </mesh>
      <mesh position={[0, 0.22, depth / 2 + 0.005]}>
        <boxGeometry args={[0.12, 0.22, 0.02]} />
        <meshLambertMaterial color="#6b5344" flatShading />
      </mesh>
      <mesh position={[-width * 0.22, height * 0.55, depth / 2 + 0.005]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshLambertMaterial color="#cfe0e6" flatShading />
      </mesh>
    </group>
  );
}

export function TownSegment({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  name = "Town",
  subtitle = "NRVT",
  seed = 1,
  buildingCount = 4,
  wallColor = palette.clapboard,
  roofColor = palette.roof,
}: TownSegmentProps) {
  const buildings = useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: buildingCount }, (_, i) => {
      const angle = (i / buildingCount) * Math.PI * 1.4 - 0.4;
      const radius = randRange(rng, 0.55, 1.05);
      return {
        offset: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
          number,
          number,
          number,
        ],
        width: randRange(rng, 0.52, 0.78),
        depth: randRange(rng, 0.44, 0.64),
        height: randRange(rng, 0.48, 0.78),
        yaw: angle + randRange(rng, -0.2, 0.2),
      };
    });
  }, [buildingCount, seed]);

  const label = useMemo(() => makeLabelTexture(name, subtitle), [name, subtitle]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[2.3, 0.03, 2.1]} />
        <meshLambertMaterial color="#c8d4b0" flatShading />
      </mesh>

      {buildings.map((building, index) => (
        <ClapboardBuilding
          key={index}
          {...building}
          wallColor={wallColor}
          roofColor={roofColor}
        />
      ))}

      <Billboard position={[0, 1.55, 0]} follow>
        <mesh>
          <planeGeometry args={[2.1, 0.52]} />
          <meshBasicMaterial map={label} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}
