import { useMemo } from "react";
import { getTrailCurve } from "../lib/curves";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type BoardwalkProps = TransformProps & {
  meander?: number;
  trailOffset?: number;
  station?: number;
  length?: number;
  plankCount?: number;
  woodColor?: string;
  wetlandColor?: string;
};

export function Boardwalk({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  meander = 1,
  trailOffset = 2.15,
  station = 0.27,
  length = 3.2,
  plankCount = 14,
  woodColor = palette.boardwalk,
  wetlandColor = palette.wetland,
}: BoardwalkProps) {
  const placement = useMemo(() => {
    const trail = getTrailCurve(meander, trailOffset);
    const p = trail.getPointAt(station);
    const tangent = trail.getTangentAt(station);
    return {
      position: position ?? ([p.x, 0, p.z] as [number, number, number]),
      heading: Math.atan2(tangent.x, tangent.z),
    };
  }, [meander, position, station, trailOffset]);

  const planks = useMemo(() => {
    return Array.from({ length: plankCount }, (_, i) => {
      const z = -length / 2 + (i + 0.5) * (length / plankCount);
      return z;
    });
  }, [length, plankCount]);

  return (
    <group
      position={placement.position}
      rotation={[rotation[0], rotation[1] + placement.heading, rotation[2]]}
      scale={scale}
    >
      <mesh position={[-0.15, -0.01, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.04, length + 0.8]} />
        <meshLambertMaterial color={wetlandColor} flatShading />
      </mesh>
      <mesh position={[-0.55, 0.01, 0.2]} receiveShadow>
        <boxGeometry args={[0.9, 0.03, 1.1]} />
        <meshLambertMaterial color={palette.water} flatShading />
      </mesh>
      <mesh position={[0.35, 0.01, -0.6]} receiveShadow>
        <boxGeometry args={[0.7, 0.03, 0.8]} />
        <meshLambertMaterial color={palette.waterDeep} flatShading />
      </mesh>

      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.07, 0]}>
          <boxGeometry args={[0.07, 0.08, length + 0.12]} />
          <meshLambertMaterial color="#6e533c" flatShading />
        </mesh>
      ))}

      {planks.map((z) => (
        <mesh key={z} position={[0, 0.13, z]} receiveShadow>
          <boxGeometry args={[0.72, 0.05, length / plankCount - 0.03]} />
          <meshLambertMaterial color={woodColor} flatShading />
        </mesh>
      ))}

      {[-0.34, 0.34].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.38, 0]}>
            <boxGeometry args={[0.04, 0.06, length]} />
            <meshLambertMaterial color="#6e533c" flatShading />
          </mesh>
          {[-length / 2, 0, length / 2].map((z) => (
            <mesh key={z} position={[x, 0.26, z]}>
              <boxGeometry args={[0.045, 0.28, 0.045]} />
              <meshLambertMaterial color="#6e533c" flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {[-1.1, -0.4, 0.5].map((z, i) => (
        <mesh key={z} position={[-0.85, 0.18, z]} castShadow>
          <coneGeometry args={[0.07, 0.42, 5]} />
          <meshLambertMaterial
            color={i === 1 ? "#6a7d4a" : "#7c8f58"}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
